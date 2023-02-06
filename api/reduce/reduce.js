// reduce内部
// 1、获取初始值，如果没有初始值，取数组第一个元素，如果数组为空，报错！
// 2、有初始值，callback(初始值，arr[0]) 否则 callback(arr[0],arr[1])  如果数组只有一个元素直接返回

// mdn polyfill
Object.defineProperty(Array.prototype, 'myReduce', {
    value: function (callback) {
        // 对于入参类型的限制 
        // （arr.reduce(),隐式this的绑定，this本身指向arr)
        if (this === null) {
            throw new TypeError('reduce called on null or undefined!');
        }
        // callback必须是函数
        if (typeof callback !== 'function') {
            throw new TypeError(callback + 'is not a function!');
        }
        // o是reduce进行的对象
        let o = Object(this)
        //>>>0: 将任意js值转换为数字,且不会出现NaN
        let len = o.length >>> 0;

        let k = 0; // reduce开始的位置 index
        let value;

        // 设置initalvalue
        if (arguments.length >= 2) {
            value = arguments[1]
        } else {
            while (k < len && !(k in o)) {
                k++;
            }
            // while (k<len&&!(k in o)) in操作符中k表示的是index,k实际上是想找到数组中开始有值的起始位置。 
            // 因为存在着这种情况： 
            // a. let a=[];  a[3]=1; 那么这个数组就为 [ <3 empty items>, 1],
            //    然而在这种情况下 对应的empty item的索引采用 in 操作符判断是为false的(对应索引是否能取到value)。
            //    比如这个例子中 0 in o，1 in o，2 in o都为false，因此跳过这些为false的items我们就能找到起始位置3：1
            // b.if (k>=len) 当然数组可能为全空。比如说Array(4):  [ <4 empty items>] , k表示起始位置, 
            // 当然也是在数组中的索引, 如果这个值在上一轮while循环后大于等于len, 那么说明这个数组为空!  并且这个else分支为没有initialValue的情况,因此抛出错误
            if( k>=len){
                throw new TypeError('Reduce of empty array with no initial value');
            }
            // c.value=o[k++]; 能走到这一步说明数组在没有initialValue的情况下是存在值的, k也是数组中的第一个值的索引, 因此我们将该值赋给value(相当于accumulator); 然后k++进行下面的while循环
            value = o[k++]
        }

        // 累加结果
        while(k<len){
            if(k in o){
                value = callback(value,o[k],k,o)
            }
            k++
        }
        return value
    }
})

// 精简的实现方式
Array.prototype.reduce = Array.prototype.reduce|| function(callback,initalValue){
    var array = this
    var base = typeof initalValue === 'undefined'?array[0]:initalValue
    var startPoint =  typeof initalValue === 'undefined'?1:0
    array.slice(startPoint).forEach((element,index) => {
        // 这里要加上被删除的起点的索引
        base = callback(base,element,startPoint + index,array)
    });
    return base
}