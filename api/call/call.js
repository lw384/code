// call
// fun.call(thisArg, param1, param2, ...)
// 帮助某一对象 借用其他对象的方法
// 可以接受任意多个参数，但是要求，第一个参数必须是待被指向的对象（A），剩下的参数，都传入借过来使用的函数中
const mbs = {
    name: '',
    say(prefix, age) {
      console.log(`${prefix},my name is ${this.name},i am ${age} year old`)
    }
  }
  
  const A = {
    name:'mike'
  }
  
// 不能使用箭头函数声明，this的指向会存在问题 Function.prototype.myCall = (context)=>{}❌
// 梳理一下this的指向：想在target对象上使用say方法，say.call() 隐式绑定 this->say(FUUNCTION)
// call中，想把this->say 改变为 target，那么 我们要使用 obj.这种隐式的this绑定，使得 call内部 this的指向改变
// 如果 myCall 是一个箭头函数（复习this指向，箭头函数是由外部的作用域决定的）
// say.myCall 可以简化认为 调用一个 obj内部的箭头函数，此时this的指向是window,存在问题❌

// call极简版本1.0
  Function.prototype.myCall = function(context){
    // 边界处理：con3text可以是空
    context = context || window
    // 借用  核心三行代码
    context.fn = this;
    context.fn();
    delete context.fn;

  }

// 处理参数2.0 es6
  Function.prototype.myCall2 = function(context,...args){
    // 边界处理：con3text可以是空
    context = context || window
    // 借用的核心三行代码
    context.fn = this;
    context.fn(...args);
    delete context.fn
  }
  // ...扩展运算符是es6  降级处理
  Function.prototype.myCall3 = function(context){
    // 边界处理：con3text可以是空
    context = context || window
    var args = []
    for(var i=1;i<arguments.length-1;i++){
        args.push('arguments['+i+']')
    }
    // 借用的核心三行代码
    context.fn = this;
    eval('context.fn(' + args +')');
    delete context.fn
  }

  // call 存在返回值 3.0
  Function.prototype.myCall3 = function(context){
    // 边界处理：con3text可以是空
    context = context || window
    var args = []
    for(var i=1;i<arguments.length-1;i++){
        args.push('arguments['+i+']')
    }
    // 借用的核心三行代码,防止函数重名还可以使用 symbol
    const targetFnKey = Symbol()
    context['targetFnKey']= this;
    var result = eval('context.targetFnKey(' + args +')');
    delete context.targetFnKey
    return result
  }

  mbs.say.myCall3(A,'hello',3) 