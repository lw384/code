// promise(resolve,reject).then()
// promise 本身是一个构造函数
// 入参声明为 executor 也是一个函数 该函数有两个方法 resolve reject
// 合适的时候 调用resolve 这个值可以在 then的 onfullfilled 中拿到

function Promise(executor){
    this.status = 'pending'
    this.value = ''
    this.reason = ''

    // 暂存 开发者 的回调
    this.onfullfilledFunc = Function.prototype
    this.onrejectedFunc = Function.prototype

    // settimeout 模拟异步执行
    const resolve = (value)=>{
        setTimeout(()=>{
            if(this.status === 'pending'){
                this.value = value
                this.status = 'fulfilled'
    
                this.onfullfilledFunc.forEach(func => {
                    func(this.value)
                });
            }
        })
        
       
    }

    const reject = (reason)=>{
        setTimeout(()=>{
            if(this.status === 'pending'){
                this.reason = reason
                this.status = 'rejected'
    
                this.onrejectedFunc.forEach(func => {
                    func(this.reason)
                });
            }
        })
    }

    // 构造中出错会报错
    try{
        executor(resolve,reject)
    }catch(e){
        reject(e)
    }
    

}

Promise.prototype.then = function(onfullfilled,onrejected){
    
    onfullfilled = typeof onfullfilled === 'function'?onfullfilled:data=>data
    onrejected = typeof onrejected === 'function'?onrejected:error=>{throw error}

    // 如果要解决链式调用，需要onfullfilled onrejected 都是返回一个新的 promise
    if(this.status === 'fulfilled'){
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                try{
                    resolve(onfullfilled(this.value))
                }catch(e){
                    reject(e)
                }
            });
        })

    }
    if(this.status === 'rejected'){
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                try{
                    resolve(onrejected(this.reason))
                }catch(e){
                    reject(e)
                }
            });
        })
       
    }

    if(this.status === 'pending'){
        // 应对 多个并列.then 所以使用数组

        // pending 状态时如何处理 promise 链式调用 较难理解
        return new Promise((resolve,reject)=>{
            this.onfullfilledFunc.push(()=>{
                let result = onfullfilled(this.value)
                resolve(result)
            })
            this.onrejectedFunc.push(()=>{
                let result = onrejected(this.reason)
                resolve(result)
            })
        })
    }
  
   
}