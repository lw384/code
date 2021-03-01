// let i = 10
// let req = () => {
//   i--
//   requestAnimationFrame(() => {
//     document.body.style.background = "red"
//     requestAnimationFrame(() => {
//       document.body.style.background = "blue"
//       if (i > 0) {
//         req()
//       }
//     })
//   })
// }
//
// req()


// console.log('start')
// setTimeout(() => {
//   console.log('timer1')
//   Promise.resolve().then(function() {
//     console.log('promise1')
//   })
// }, 0)
// setTimeout(() => {
//   console.log('timer2')
//   Promise.resolve().then(function() {
//     console.log('promise2')
//   })
// }, 0)
// Promise.resolve().then(function() {
//   console.log('promise3')
// })
// console.log('end')

// console.log('1');
// async function async1() {
//   console.log('2');
//   await async2();
//   console.log('3');
// }
// async function async2() {
//   console.log('4');
// }
//
// setTimeout(function() {
//   console.log('5');
//   new Promise(function(resolve) {
//     console.log('6');
//     resolve();
//   }).then(function() {
//     console.log('7')
//   })
// })
// async1();
//
// new Promise(function(resolve) {
//   console.log('8');
//   resolve();
// }).then(function() {
//   console.log('9');
// });
// console.log('10');

const promise = Promise.resolve(
    (() => {
      console.log('a');
      return Promise.resolve(
          (() => {
            console.log('b');
            return Promise.resolve(
                (() => {
                  console.log('c');
                  return new Promise(resolve => {
                    setTimeout(() => resolve('biu'), 3000);
                  });
                })()
            )
          })()
      );
    })()
);
promise.then(console.log)

