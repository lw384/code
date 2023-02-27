// const sayHello = require('./hello')
// import sayHello from './helloes'
import('./helloes').then(sayHello=>{
    console.log(sayHello('lucas'))
})

