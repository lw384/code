// promise构造函数接受一个执行函数，执行函数执行完同步或者异步操作后，调用它的两个参数resolve reject
// var promise = new Promise(function(resolve,reject){
//   /*
//   * 成功：resolve
//   * 失败：reject
//   * */
// });
try{
  module.exports = Promise
}catch (e) {}

// 构造函数框架
function Promise(executor) {
  var self = this;
  self.status = 'pending';  // promise 当前的状态
  self.data = undefined; // promise 的值
  self.onResolvedCallback = []; // promise resolve 时的回调函数集，可能有多个
  self.onRejectedCallback = []; // promise reject 时的回调函数集，可能有多个
  /*
  * 为什么要在构造函数内部定义 resolve 和 reject 函数？
  * executor 执行函数以 resolve（value） reject （reason） 形式调用【隐含this指向，两个函数要定义在构造函数内部】
  * 不是以 resolve.call（promise，value）reject.all(promise,value)形式调用 【显式将this -> promise，两个函数定义在构造函数外部】
  * 另：bind 会返回一个新的函数，相当于每个Promise 对象都会拥有一对自己的resolve 与 reject 函数，所以写在内部外部等价
  * */
  // 判断状态为pending之后，将状态值改编为相应的状态，并把对应的value与reason存储在data属性上，之后执行相应的回调函数
  function resolve(value){
    if(value instanceof Promise){
      return value.then(resolve,reject)
    }
    setTimeout(function () { // 标准规定需要异步执行所有回调函数
      if(self.status === 'pending'){
        self.status = 'resolved';
        self.data = value;
        // 一开始理解为 通过for循环，给callback空数组初始赋值，但这样[]空数组永远都没办法触发for循环 很疑惑 ？？？
        //  解答，callback数组在pending状态会进行赋值，此处for循环是将回调函数与参数关联
        for(var i = 0;i < self.onResolvedCallback.length;i++){
          self.onResolvedCallback[i](value)
        }
      }
    })
  }
  function reject(reason){
    setTimeout(function () {
      if(self.status === 'pending'){
        self.status = 'rejected';
        self.data = reason;
        for(var i = 0;i<self.onRejectedCallback.length;i++){
          self.onRejectedCallback[i](reason)
        }
      }
    })
  }

  try { // 执行executor中可能出错，出错后catch 的值reject 这个promise
    executor(resolve,reject)
  }catch (e) {
    reject(e)
  }
}

/*
 * 不同promise的交互
 * resolvePromise函数即为根据x的值来决定promise2的状态的函数
 * 也即标准中的[Promise Resolution Procedure](https://promisesaplus.com/#point-47)
 * x为`promise2 = promise1.then(onResolved, onRejected)`里`onResolved/onRejected`的返回值
 * `resolve`和`reject`实际上是`promise2`的`executor`的两个实参，因为很难挂在其它的地方，所以一并传进来。
 * 相信各位一定可以对照标准把标准转换成代码，这里就只标出代码在标准中对应的位置，只在必要的地方做一些解释
*/
function resolvePromise(promise2,x,resolve,reject){
  var then;
  var thenCalledOrThrow = false;

  if( promise2 === x){  // 2.3.1
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }
  if(x instanceof Promise){
    if(x.status === 'pending'){
      x.then(function (value) {
        resolvePromise(promise2,value,resolve,reject)
      },reject)
    }else {
      x.then(resolve,reject)
    }
    return
  }

  if((x !== null)&&((typeof x === 'object')||(typeof x === 'function'))){
    try{
      then = x.then
      if(typeof then === 'function'){
        then.call(x,function rs(y) {
          if (thenCalledOrThrow) return   // 测试用例报错 2.3.3 因为此处没有并判断thenable对象 只能调用一次
          thenCalledOrThrow = true
          return resolvePromise(promise2,y,resolve,reject)
        },function rj(r) {
          if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
          thenCalledOrThrow = true
          return reject(r)
        })
      }else {
        resolve(x)
      }
    }catch (e) {
      if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
      thenCalledOrThrow = true
      return reject(e)
    }

  }else {
    resolve(x)
  }
}

/*
* then方法需挂载在promise原型上
* then 方法需要返回一个promise 新的对象
* 每个promise对象可以多次调用then方法，所以then方法不能返回this，因为每一次的返回promise不同
* then方法接受两个参数，分别是promise成功或失败后的回调
* */
Promise.prototype.then = function(onResolved,onRejected){
  var self =this
  var promise2   // promise2的取值取决于then里的函数的返回值
  // 规范中写明，then 的参数不是函数则省略（2.2.1） 且必须返回一个promise对象; （解决穿透？？？的问题）
  // 在then里执行onResolved 或者 onRejected,并根据返回值来确定promise2的结果
  onResolved = typeof onResolved === 'function' ? onResolved : function(v){return v};
  onRejected = typeof onRejected === 'function' ? onRejected : function (r) {throw r};
  if (self.status === 'resolved'){
    // 此时promise1的状态已经确定为resolved，调用onResolved，考虑到throw.使用try catch 块
    return promise2 = new Promise(function (resolve,reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.data)
          resolvePromise(promise2,x,resolve,reject)
          // if (x instanceof Promise){ // 如果onResolved返回值是一个promise，则取它的值直接作为promise2 的结果
          //   x.then(resolve,reject)
          // }
          // resolve(x) // 否则，以它的返回值作为promise2的结果
        }catch (e) {
          reject(e)  // 出错则捕获错误作为promise2 的结果
        }
      })
    })
  }
  if (self.status === 'rejected') {
      return promise2 = new Promise(function (resolve,reject) {
        setTimeout(function () {
        try {
          var x = onRejected(self.data)
          resolvePromise(promise2,x,resolve,reject)
          // if (x instanceof Promise){
          //   x.then(resolve,reject)
          // }
          // reject(x)
        }catch (e) {
          reject(e)
        }
      })
    })
  }
  if (self.status === 'pending'){
    /*
     * 当promise为pending状态时，不能确定调用onResolved或者是onRejected，
     * 只有确定状态才知道怎么处理
     *  所以，将 两种情况 的处理逻辑作为callback 放入promise1（this/self）的回调数组里，逻辑本身跟第一个if块内几乎一致
     */
    return promise2 = new Promise(function (resolve,reject) {
      self.onResolvedCallback.push(function (value) {
        try{
          var x = onResolved(value)
          resolvePromise(promise2,x,resolve,reject)
        }catch (e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function (reason) {
        try{
          var x = onRejected(reason)
          resolvePromise(promise2,x,resolve,reject)
          // if(x instanceof Promise){
          //   x.then(resolve.reject)
          // }
        }catch (e) {
          reject(e)
        }
      })
    })
  }
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null,onRejected)
}

Promise.deferred = Promise.defer = function () {
  var dfd = {}
  dfd.promise = new Promise(function (resolve,reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd
}
























