// new 到底做了什么
// 入参 构造函数 + 携带的参数
// 出参 一个构造函数的实例对象，this指向这个实例对象
function myNew (func,...args){
    // 1.创建一个空对象
    let obj = Object.create({})
    // 2.对象的原型 指向 构造函数的prototype 属性
    obj.__proto__ = func.prototype
    // let obj = Object.create(func.prototype)
    // 3. 绑定this
    const result = func.apply(obj,args)
    // 4. 如果构造函数有返回结果，应该是构造函数的运行结果
    return  typeof result === 'object'&&result !==null?result:obj
}

function Person(name){
    this.name = name
}

const person = myNew(Person,'jack')

console.log(person)