function Promise(executor){
  var self = this;
  self.cbs = []
  function resolve(value){
    self.data = value;
    self.cbs.forEach((cb)=>cb(value))
  }
  executor(resolve)
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
})

