const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export function Promise(executor) {
  var self = this
  self.status = PENDING
  self.value = undefined
  self.reason = undefined
  self.onFulfilled = []
  self.onRejected = []

  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED
      self.value = value
      self.onFulfilled.forEach(fn => fn(value))
    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED
      self.reason = reason
      self.onRejected.forEach(fn => fn(reason))
    }
  }

  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }

}

Promise.prototype.then = function (onFulfilled, onRejected) {
  var self = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {
    throw reason
  }
  // 参考订阅者模式，将回调函数寄存在一个数组中，支持then的异步处理
  let promise2 = new Promise((resolve, reject) => {
    if (self.status === FULFILLED) {
      setTimeout(()=>{
        try {
          let x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
    if (self.status === REJECTED) {
      setTimeout(()=>{
        try{
          let x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        }catch (error){
          reject(error)
        }
      })
    }
    if (self.status === PENDING) {
      self.onFulfilled.push(() => {
        setTimeout(()=>{
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
      self.onRejected.push(() => {
        setTimeout(()=>{
          try{
            let x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          }catch (error){
            reject(error)
          }
        })
      })
    }
  })
  return promise2
}

function resolvePromise(promise2,x,resolve,reject) {
  // 实现链式调用
  if(promise2 === x){
    reject(new TypeError('Chaining cycle'))
  }
  if(x !== null&&(typeof x === 'object'||typeof x === 'function')){
    // 函数  或 对象
    try{
      let then = x.then;
      if(typeof then === 'function'){
        then.call(x,(y)=>{
          reject(y)
        },(r)=>{
          reject(r)
        })
      }else {
        resolve(x)
      }
    }catch (e){
      reject(e)
    }
  }else {
    // 普通值
    resolve(x)
  }
}


