// arr.reduce(callback[,initalValue])
// callback(previousValue,currentValue,currentIndex,array)

const runPromiseInSequence = (array,value)=>array.reduce(
    // 上一次结果 then之后，调用下一次
    (promiseChain,currentFunction)=>promiseChain.then(currentFunction),
    // 需要一个初始触发的
    Promise.resolve(value)
)

const fn1 = ()=> new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log('p1 running')
        resolve(1)
    },1000)
})

const fn2 = ()=> new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log('p2 running')
        resolve(2)
    },1000)
})

const array = [fn1,fn2]

runPromiseInSequence(array,'init')

// TODO:总共20个请求，如何实现一次调用五个，错误则排队重新请求，二次错误则报错，中途报错不影响后续请求