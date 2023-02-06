// compose 
// 入参是函数数组，出参是一个函数且可以接收参数

// 递归+闭包 面向过程
const compose = (...args) =>{
    let length = args.length
    let count = length -1
    let result
    // 通过闭包存储结果和函数数组长度，递归进行结果的累加
    return function f1(...args1){
        result = args[count].apply(this,args1)
        // 递归结束的条件
        if(count <= 0){
            // count需要变更为初始值，是闭包引用的变量，一直不会被回收，所以需要手动
            count = length -1
            return result
        }
        // 递归继续
        return f1.call(null,result)
    }
}

// 使用reduce
// 前后两个函数怎么调用,g(f(args))
const reduceFunc = (f,g)=>{
    (...args)=>{
        g.call(this,f.apply(this,args))
    }
}

const composeFunc = (...args)=>{
    // args需要逆向:[fn4 fn3 fn2 fn1]
    args.reverse().reduce(reduceFunc,args.shift())
}

// 既然是流程控制类的，考虑一下 promise
const composePromise = (...args)=>{
    let init = args.pop()
    return (...arg)=>{
        args.reverse().reduce((sequence,func)=>{
            sequence.then(result=>{func.call(null,result)})
        },Promise.resolve(init.apply(null,arg)))
    }
}