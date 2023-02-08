// bind 函数
// 返回新的函数，该函数已经绑定了指定的this
// bind 类似把借用的函数直接换了个主子，
// var name = 'Jack';
// var Yve = {
//     name: 'Yvette'
// };
// function person() {
//     console.log(this.name);
// }


// Function.prototype.bind = Function.prototype.bind||function(context){// 自己实现的bind}

// bind 基础功能1.0:改变this指向
Function.prototype.myBind1 = function(context){
     // 首先要获取调用bind的函数，也就是绑定函数，用this可以获取
     var self = this; // 用self绑定this，因为下面函数中的this指向已经改变（存放当前函数的this）
     return function () {
        // 这个函数内部的this已经指向 window了所以需要存外部作用域的this
         // 用apply来改变this指向
         self.apply(context);
     }
}

// person(); // Jack
// var bindYve = person.myBind1(Yve);
// bindYve(); // Yvette

// bind 2.0 支持柯里化 可以在bind时传入部分参数 在执行bind的返回结果时 再传入剩下的参数
Function.prototype.myBind2 = function(context){
    // 首先要获取调用bind的函数，也就是绑定函数，用this可以获取
    var self = this; // 用self绑定this，因为下面函数中的this指向已经改变（存放当前函数的this）
    var args = [...arguments].slice(1); // 用slice方法取第二个到最后一个参数（存放获取除了this指向对象以外的参数）
    return function () {
        // 这里的arguments是指bind返回的函数传入的参数
        var restArgs = [...arguments];
        // 用apply来改变this指向，拼接bind方法传入的参数和bind方法返回的函数传入的参数，统一在最后通过apply执行。
        return self.apply(context, args.concat(restArgs));
    }
}

// function person2(age, job, gender) {
//     console.log(this.name, age, job, gender);
// }
// person2(22, 'engineer', 'female');
// // Jack 22 engineer female
// var bindYve2 = person2.bind(Yve, 22, 'engineer');
// bindYve2('female');
// Yvette 22 engineer female

// bind 3.0 
// bind 返回的函数作为构造函数。提供的 this 值会被忽略，但传入的参数仍然生效。
// 作为构造函数调用时，this 指向实例，原先通过 bind 绑定的 this 失效。
// 很显然前面实现的 bind 始终会通过 self.apply(context) 将 this 指向 context，不符合这一特点。
// 所以，在返回函数作为构造函数调用时，就不用修改 this 指向了，直接 self.apply(this)即可。因为作为构造函数调用时，this 就是指向实例，所以这里不需要做其他操作。
// 那如何知道返回函数是被作为构造函数调用的呢？可以用 instanceof 来判断返回函数的原型是否在实例的原型链上。

Function.prototype.myBind3 = function(context){
    // 首先要获取调用bind的函数，也就是绑定函数，用this可以获取
    var self = this; // 用self绑定this，因为下面函数中的this指向已经改变（存放当前函数的this）
    var args = [...arguments].slice(1); // 用slice方法取第二个到最后一个参数（存放获取除了this指向对象以外的参数）
    var bound =  function () {
        // 这里的arguments是指bind返回的函数传入的参数
        var restArgs = [...arguments];
        // 判断返回函数是否时作为构造函数使用
        return  self.apply(this instanceof bound ? this:context, args.concat(restArgs));
    }
    return bound
}
// var name = 'Jack';
// var Yve = {
//     name: 'Yvette'
// };
// function person(age, job, gender) {
//     console.log(this.name, age, job, gender);
// }
// var bindYve = person.myBind3(Yve, 22, 'engineer');
// var obj = new bindYve('female');
// undefined 22 'engineer' 'female'

// bind 4.0
// 3.0版本没能实现 对原型链的继承

Function.prototype.myBind5 = function(context){
    // 首先要获取调用bind的函数，也就是绑定函数，用this可以获取
    var self = this; // 用self绑定this，因为下面函数中的this指向已经改变（存放当前函数的this）
    var args = [...arguments].slice(1); // 用slice方法取第二个到最后一个参数（存放获取除了this指向对象以外的参数）
    var bound =  function () {
        // 这里的arguments是指bind返回的函数传入的参数
        var restArgs = [...arguments];
        // 判断返回函数是否时作为构造函数使用
        return  self.apply(this instanceof bound ? this:context, args.concat(restArgs));
    }
    // 修改返回函数的原型，使得指向绑定函数的原型，这样通过new bound()出的实例，自然可以继承 绑定函数的原型上的属性
    // 用一个空函数 fn 作为中间变量
    var fn = function() {};
    // 使中间变量 fn 的 prototype 指向绑定函数的 prototype
    fn.prototype = this.prototype;
    // 再使返回函数的 prototype 指向 fn 的实例，通过中间变量 fn 来维护原型关系
    bound.prototype = new fn();
    return bound
}
var name = 'Jack';
var Yve = {
    name: 'Yvette'
};
function person(age, job, gender) {
    this.work = '福报'; // 实例属性
    console.log(this.name, age, job, gender);
}
person.prototype.clockIn = function () {
    console.log(996);
}
var bindYve = person.myBind5(Yve, 22, 'engineer');
var obj = new bindYve('female');
obj.work; // 福报
obj.clockIn(); // 996
