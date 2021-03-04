class MobileFactory{
  createOS(){
    throw new Error("抽象工厂方法不允许直接调用，需要重写！")
  }
  createHardWare(){
    throw new Error("抽象工厂方法不允许直接调用，需要重写！")
  }
}

class FakeStarFactory extends MobileFactory{
  createOS() {
    return new AndroidOS()
  }
  createHardWare(){
    return new QualcommHardWare()
  }
}

class OS {
  controlHardWare(){
    throw new Error("抽象工厂方法不允许直接调用，需要重写！")
  }
}

class AndroidOS extends OS{
  controlHardWare() {
    console.log('安卓硬件')
  }
}

class AppleOS extends OS {
  controlHardWare() {
    console.log('我会用🍎的方式去操作硬件')
  }
}

// 定义手机硬件这类产品的抽象产品类
class HardWare {
  // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
  operateByOrder() {
    throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
  }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
  operateByOrder() {
    console.log('我会用高通的方式去运转')
  }
}

class MiWare extends HardWare {
  operateByOrder() {
    console.log('我会用小米的方式去运转')
  }
}

const myPhone = new FakeStarFactory();
const myOS = myPhone.createOS();
const myHardWare = myPhone.createHardWare();
myOS.controlHardWare()
myHardWare.operateByOrder()
