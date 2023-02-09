// 总共20个请求，如何实现一次调用五个，错误则排队重新请求，二次错误则报错，中途报错不影响后续请求
// 并发请求 错误重传
const url = ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7', 'url8']

const fetchUrl = (url) => {
    const timeCost = Math.random() * 1000
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(url, 'success', timeCost)
            resolve(url)
        }, 1000)
    })
}


const loadByLimit = (url, fetchUrl, limit) => {
    const urlCopy = [].concat(url)
    let promiseArray
    if (url.length <= limit) {
        promiseArray = url.map((id => fetchUrl(id)))
        return Promise.all(promiseArray)
    }

    promiseArray = urlCopy.splice(0, limit).map((id, index) => {
        return fetchUrl(id)
    })

    return urlCopy.reduce((prePromise, id) => {
        return prePromise.then((res) => {
            return Promise.race(promiseArray)
        }).catch((err) => {
            err => console.log(err)
        }).then((resolveId) => {
            let resolvedPosition = promiseArray.findIndex(id=> resolveId == id)
            promiseArray.splice(resolvedPosition, 1)
            promiseArray.push(fetchUrl(id))
        });
    }, Promise.resolve())
}

loadByLimit(url, fetchUrl, 5)

/**
 * 
 * @param {Array} urls 
 * @param {Function} load 请求
 * @param {Number} limit 最小值
 */
function limitload(urls, handle, limit) {
    // console.log(urls)
    let myulrs = urls.slice()
    let promises = myulrs.splice(0, limit).map((url, index) => {
        return handle(url).then(() => {
            return index;
        })
    });

    let p = Promise.race(promises);

    // myulrs 已经被修改了，从剩下还没入站的里头 取一个放进去
    for (let i = 0; i < myulrs.length; i++) {
        // 去循环看
        p = p.then(index => {
            console.log(index)
            promises[index] = handle(myulrs[i]).then(() => {
                return index;
            })
            return Promise.race(promises);
        })
    }
}
 
 
 
 
let res = [];
function load(i) {
    res.push(i)
    return new Promise(function (resolve) {
        setTimeout(() => {
            resolve(i);
        }, random(1, 100))
    })
    // return Promise.resolve(i++)
}
 
 
// function random(lower, upper) {
//     return Math.floor(Math.random() * (upper - lower)) + lower;
// }
// limitload([1, 2, 3, 4, 5, 6, 7, 8, 9], load, 2)
// setTimeout(() => {
//     console.log('res', res)
// }, 1000)

setTimeout(()=>{ console.log('100')},100)
setTimeout(()=>{ console.log('0')},0)
