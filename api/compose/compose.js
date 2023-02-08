// compose 
// 入参是函数数组，出参是一个函数且可以接收参数

// 递归+闭包版本
// 面向过程
// return 出的闭包是运行在 window环境下 call(null)指向全局window
const compose = (args) =>{
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
        count --
        // 递归继续
        return f1.call(null,result)
    }
}
const q1 = (arg)=>{
    let result = arg+1
    return result
}
const q2 = (arg)=>{
    let result = arg+2
    return result
}
const q3 = (arg)=>{
    let result = arg+3
    return result
}
let array = [q1,q2,q3]


// reduce版本
// 前后两个函数怎么调用,g(f(args))
const reduceFunc = (f,g)=>(...args)=>g.call(this,f.apply(this,args))


const composeFunc = (funcs)=>{
    return (...args)=>{
       return funcs.reverse().reduce((f,g)=> {
             return typeof f === 'function'?g(f(...args)):g(f)
            })
}
}



// promise版本 存在问题
//  .then 有问题
// 既然是流程控制类的，考虑一下 promise
const composePromise = (funcs)=>{
    let init = funcs.pop()
    return (...arg)=>{
        funcs.reverse().reduce((sequence,func)=>{
            sequence.then(result=>{new Promise(func.call(null,result))})
        },Promise.resolve(init(arg)))
    }
}
let composeTest = composePromise(array)
console.log(composeTest(2))
// lodash版本:推荐
const composeLodash = function(funcs){
    let length = funcs.length
    let index = length

    // 参数检查
    while(index--){
        if(typeof funcs[index] !=='function'){
            throw new TypeError('Expected a function')
        }
    }
    // 闭包
    return function(...args){
        index = 0
        // 传入数组为空, 错误的话, 直接返回初始参数
        let result = length? funcs.reverse()[index].apply(this,args):args[0]
        while(++index<length){
            result = funcs[index].call(this,result)
        }
        return result
    }
}

// Redux版本：推荐
function composeRedux (funcs){
    return (...arg)=>{
        if(funcs.length === 0){
            return arg
        }
        if(funcs.length ===1){
            funcs[0](...arg)
        }
        
        return funcs.reverse().reduce((x,y)=>{return typeof x === 'function' ? y(x(...arg)) : y(x)})
    }
   
}

const f1 = (n) => {
    console.log(1);
    return n + 1;
  }
  const f2 = (n) => {
    console.log(2);
    return n + 2;
  }
  const f3 = (n) => {
    console.log(3);
    return n + 3;
  }
  
  const fnList = [f3, f2, f1]
  const res1 = f3(f2(f1(4)));
  const res2 = composeRedux(fnList)(4);
  
