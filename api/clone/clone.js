// 浅拷贝
// 基本类型：直接返回这个值就可以
// 引用类型：对引用类型开辟新的存储，并且拷贝一层对象属性。

function shallowClone (source){
    if(typeof source !=='object'||!source){
        return source
    }

    let newObject = source instanceof Array?[]:{}

    for(let key in source){
        if(source.hasOwnProperty(key)){  
            newObject[key]=source[key]
        }
    }

    return newObject
}

let a = {name:'jack'}
console.log(shallowClone(a))

// 递归基本实现
function deepClone (source){
   //判断source是不是对象
   if (source instanceof Object == false) return source;

   let target = source instanceof Array?[]:{}

   for(let key in source){
    if(source.hasOwnProperty(key)){
        if(typeof source[key] === 'object'){
            target[key] = deepClone(source[key])
        }else{
            target[key] = source[key]
        }
    }
  
   }
   return target
}
console.log(deepClone({b: {c: {d: 1}}}));  // {b: {c: {d: 1}}})
console.log(deepClone({b: {c: {d: new Date(),e:Symbol('ee')}}}));  //{ b: { c: { d: {}, e: Symbol(ee) } } }

// 可优化点
// 不能对symbo进行拷贝
// 对普通对象能进行拷贝，对于date RegExp等不能  
// 可能会有循环引用 的问题产生导致无限递归

function deepClone2 (obj, hash = new WeakMap()) {
    // 日期对象直接返回一个新的日期对象
    if (obj instanceof Date){
        return new Date(obj);
    } 
    //正则对象直接返回一个新的正则对象     
    if (obj instanceof RegExp){
        return new RegExp(obj);     
    }
    //如果循环引用,就用 weakMap 来解决
    if (hash.has(obj)){
        return hash.get(obj);
    }
    // 获取对象所有自身属性的描述(枚举属性之类的)
    let allDesc = Object.getOwnPropertyDescriptors(obj);
    // 遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
    
    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) { 
      if(typeof obj[key] === 'object' && obj[key] !== null){
          cloneObj[key] = deepClone2(obj[key], hash);
      } else {
          cloneObj[key] = obj[key];
      }
    }
    return cloneObj
  }

  let obj = {
    num: 1,
    str: 'str',
    boolean: true,
    und: undefined,
    nul: null,
    obj: { name: '对象', id: 1 },
    arr: [0, 1, 2],
    func: function () { console.log('函数') },
    date: new Date(1),
    reg: new RegExp('/正则/ig'),
    [Symbol('1')]: 1,
  };
  Object.defineProperty(obj, 'innumerable', {
    enumerable: false, value: '不可枚举属性' 
  });
  obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
  obj.loop = obj    // 将loop设置成循环引用的属性
  let cloneObj = deepClone2(obj)
  
  console.log('obj', obj)
  console.log('cloneObj', cloneObj)