/**
 * 问题一：
 * 实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。
 */

/**
 * my answer
 */
class Storage{
  constructor(){
    if (!Storage.instance){
      Storage.instance = new Storage()
    }
    return Storage.instance
  }
  setItem(key,value){
    window.localStorage.setItem(key,value)
  }
  getItem(key){
    window.localStorage.getItem(key)
  }
}

const storage = new Storage();
storage.setItem('my','setItem');
storage.getItem('my');
//  constructor(){
//              ^
//
// RangeError: Maximum call stack size exceeded
