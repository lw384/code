// promise构造函数接受一个执行函数，执行函数执行完同步或者异步操作后，调用两个参数resolve reject
var promise = new Promise(function(resolve,reject){
  /*
  * 成功：resolve
  * 失败：reject
  * */
});

// 构造函数框架
function Promise(executor) {
  var self = this;
  self.status = 'pending';  // promise 当前的状态
  self.data = undefined; // promise 的值
  self.onResolvedCallback = []; // promise resolve 时的回调函数集
  self.onRejectedCallback = []; // promise reject 时的回调函数集

  function resolve(value){
    if(self.status === 'pending'){
      self.status = 'resolved';
      self.data = value;
      for(var i = 0;i<self.onResolvedCallback.length;i++){
        self.onResolvedCallback[i](value)
      }
    }
  }
  function reject(reason){
    if(self.status === 'pending'){
      self.status = 'rejected';
      self.data = reason;
      for(var i = 0;i<self.onRejectedCallback.length;i++){
        self.onRejectedCallback[i](reason)
      }
    }
  }

  try { // 执行executor中可能出错，出错后catch 的值reject 这个promise
    executor(resolve,reject)
  }catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function(onResolved,onRejected){
  var self =this
  var promise2
  // 规范中写明，then 的参数不是函数则省略
  onResolved = typeof onResolved === 'function' ? onResolved : function(v){};
  onRejected = typeof onRejected === 'function' ? onRejected : function (r) {};
  if (self.status === 'resolved'){
    return promise2 = new Promise(function (resolve,reject) {
      try {
        var x = onResolved(self.data)
        if (x instanceof Promise){
          x.then(resolve,reject)
        }
        resolve(x)
      }catch (e) {
        reject(e)
      }
    })
  }
  if (self.status === 'rejected'){
    return promise2 = new Promise(function (resolve,reject) {
      try {
        var x = onRejected(self.data)
        if (x instanceof Promise){
          x.then(resolve,reject)
        }
        reject(x)
      }catch (e) {
        reject(e)
      }
    })
  }
  if (self.status === 'pending'){
    return promise2 = new Promise(function (resolve,reject) {
      self.onResolvedCallback.push(function (value) {
        try{
          var x = onResolved(self.data)
          if(x instanceof Promise){
            x.then(resolve,reject)
          }
        }catch (e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function (reason) {
        try{
          var x = onRejected(self.data)
          if(x instanceof Promise){
            x.then(resolve.reject)
          }
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






















