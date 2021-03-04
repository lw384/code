function user (name,age,career,work){
  this.name = name;
  this.age = age;
  this.career = career;
  this.work = work;
}

function Factory(name, age ,career){
  let work = []
  switch(career){
    case '产品':
      work = ['撕逼']
      break;
    case  '程序员':
      work = ['coding']
      break;
  }
  return new user(name,age,career,work);
}

