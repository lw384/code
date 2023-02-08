// instanceof 仅仅可以判断引用类型 
// 循环判断原型链

function myInstanceof (L,R){
    // 边界判断：被判断的L 不是对象返回
    if(typeof L !=='object'){
        return false
    }
    while(true){
        // 到顶端了
        if(L === null){
            return false
        }
        if(R.prototype === L.__proto__){
            return true
        }
        L = L.__proto__
    }
}

function Person(name){
    this.name = name 
}

const p = new Person('jack')

console.log(myInstanceof(p,Person))
console.log(myInstanceof(5,Number))