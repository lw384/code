/**
 * 问题一：
 * 实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。
 */

/**
 * 静态方法
 */
class Storage{
  static getInstance(){
    if(!Storage.instance){
      Storage.instance = new Storage()
    }
    return Storage.instance
  }
  setItem(key,value){
    return window.localStorage.setItem(key,value)
  }
  getItem(key){
    return window.localStorage.getItem(key)
  }
}

const storage1 = Storage.getInstance();
const storage2 = Storage.getInstance();

storage1.setItem('my','name');
storage1.getItem('my');
storage2.getItem('my')

console.log(storage1 === storage2)

/**
 * 闭包方法
 */
const Storage = (function () {
  let instance = null;
  return function () {
    if(!instance){
      instance = new StorageBase()
    }
    return instance
  }
})()

function StorageBase() {}
StorageBase.prototype.setItem = function (key,value) {
  return localStorage.setItem(key,value)
}
StorageBase.prototype.getItem = function(key){
  return localStorage.getItem(key)
}

const storage1 = Storage.getInstance();
const storage2 = Storage.getInstance();

storage1.setItem('my','name');
storage1.getItem('my');
storage2.getItem('my')

console.log(storage1 === storage2)