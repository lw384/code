// pipe(f,g,h) 柯里化函数
// pipe return 一个新的函数
// 新函数会完成（...args)=>h(g(f(...args)))
const pipe = (...functions) => input =>functions.reduce(
    (acc,fn) => fn(acc),
    input
)