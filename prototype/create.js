// // create
// const obj = {}
// //prototype
// obj.setProperty(Object.prototype)
// // init
// obj.a = 1;
// obj.b = 2;

// function User(firstName,lastName) {
//   this.firstName=firstName;
//   this.lastName=lastName
// }
// User.prototype = Object.create(Object.prototype)
// user = new User('白','举纲');

/*实现显式继承*/
const inherit = (SuperConstructor,properties)=>{
  let {constructor} = properties;
  let SubConstructor  = function (args) {
    SuperConstructor.call(this, ...args);
    constructor.call(this,...args)
    console.log(args)
  }
  SubConstructor.prototype = {
    constructor:SubConstructor,
    ...properties
  }

  Object.setPrototypeOf(SubConstructor.prototype,SuperConstructor.prototype)
  return SubConstructor
};

const Human = inherit(Object,{
  constructor({age}){
    this.age =age;
  },
  showAge(){
    console.log('age',this.age)
  }
})
const User = inherit(Human,{
  constructor({firstname,lastName}){
    this.firstName=firstName;
    this.lastName=lastName
  },
  showName(){
    console.log('name',this.firstName+' '+this.lastName)
  }
})

const user = new User({
  age:20,
  firstName:'lo',
  lastName:'dd'
})