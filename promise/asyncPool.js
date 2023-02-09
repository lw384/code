/**
 * 
 * @param {*} poolLimit 并发数量
 * @param {*} array 请求数组
 * @param {*} iteratorFn promise迭代函数
 * @returns 
 */
function asyncPool(poolLimit, array, iteratorFn) {
    let i = 0;
    const ret = []; // 返回结果
    const executing = []; // 当前执行的任务

    // 形成promise链
    const enqueue = function() {
        // 边界情况：已经遍历到最后一个请求了
      if (i === array.length) {
        return Promise.resolve();

      }
      // 逐步利用 i 遍历array 发出请求
      const item = array[i++]; //当前请求的url
      const p = Promise.resolve().then(() => iteratorFn(item, array));
      ret.push(p); // 结果入栈

      /**  控制并发数量*/
      let r = Promise.resolve();

      // 并发数量多于请求 无需并发
      if (poolLimit <= array.length) {
        // 之前迭代返回的promise形成新的promise
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        // 正在执行的数组长度大于并发数量了，用race做删减
        if (executing.length >= poolLimit) {
          r = Promise.race(executing);
        }
      }
  
      return r.then(() => enqueue());
    };
    return enqueue().then(() => Promise.all(ret));
  }