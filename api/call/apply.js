// apply 与 call 思路一致 只是参数的传递不同

Function.prototype.myApply = function(context,argsArray){
    // 边界条件：对入参的合法性进行校验
    if(typeof context === 'undefined'||context === null){
        context = window
    }
    if(typeof argsArray === 'undefined'||argsArray === null){
        argsArray = []
    }
    context = new Object(context)
    // 核心三步
    const targetFnKey = Symbol()
    context['targetFnKey'] = this
    const result = context.targetFnKey(...argsArray)
    delete context.targetFnKey
    return result
}

const mbs = {
    name: '',
    say(prefix, age) {
      console.log(`${prefix},my name is ${this.name},i am ${age} year old`)
    }
  }
  
  const A = {
    name:'mike'
  }
  mbs.say.myApply(A,['hello',3]) 