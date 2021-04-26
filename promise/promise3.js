function Promise(executor){
  var self = this;
  self.cbs = []
  function resolve(value){
    self.data = value;
    self.cbs.forEach((cb)=>cb(value))
  }
  executor(resolve)
}
Promise.prototype.then = function (onResolved){
  var self = this
  return new Promise((resolve)=>{
    this.cbs.push(()=>{
      const res = onResolved(self.data);
      // 例子中的情况 用户自己返回了一个user promise
      if(res instanceof Promise){
        // user promise的情况
        // 用户会自己决定何时resolve promise2
        // 只有promise2被resolve以后
        // then下面的链式调用函数才会继续执行
        res.then(resolve)
      }else {
        resolve(res)
      }
    })
  })
}
const fn = (resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
};

const promise1 = new Promise(fn);

promise1.then((res)=>{
  console.log(res)
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(2)
    },500)
  })
}).then((res)=>{
  console.log(res)
})

