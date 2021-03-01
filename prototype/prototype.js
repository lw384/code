function Person(){
  this.type = 'object in constructor'
}
person = new Person();

function judgeRelationship(){
  let res = person instanceof Person;
  console.log('person 是 Person 的实例吗？',res);
  let res1 = person.__proto__ === Person.prototype;
  console.log('实例通过隐式原型能访问到原型吗？',res1);
  let res2 = person.__proto__.constructor === Person
  console.log('实例访问构造函数？',res2)
}
// judgeRelationship();

function chain(){
Person.prototype.type = 'object in Person';
person.type = 'object in person';
let res = Reflect.ownKeys(person);
console.log('实例是否有type属性',res);
let res2 = person.type;
console.log('实例继承',res2)
}
// chain();

/*构建student*/
function Student (props){
  // 改变this的指向
  Person.call(this,props);
  this.grade = props.grade||1;
}
/*调用了Person 函数不代表继承了Person*/
student = new Student(20);
console.log(student.type)

/*重写getprototype*/
Object.defineProperty(Object.prototype,'__proto__',{
  get() {
    console.log('get')
  }
});
({}).__proto__;


