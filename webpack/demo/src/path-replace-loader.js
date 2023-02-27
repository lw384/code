// 将require中的base path 替换为动态指定的 path
// 使用方式
// module.exports = {
//     module:{
//         rules:[
//             {
//                 test:/\.js/,
//                 loader:'path-replace-loader',
//                 exclude:/(node_modules)/,
//                 options:{
//                     path:''
//                     replacePath:''
//                 }
//             }
//         ]
//     }
// }

const fs = require('fs')
const loaderUtils = require('loader-utils')

module.exports = function(source){
    this.cacheable&&this.cacheable()
    const callback = this.async()
    const options = loaderUtils.getOptions(this)

    if(this.replacePath.indexOf(options.path)>-1){
        const newPath = this.replacePath.replace(options.path,options.replacePath)

        fs.readFile(newPath,(err,data)=>{
            if(err){
                if(err.code === 'ENOENT'){
                    return callback(null,source)
                }
                return callback(err)
            }

            this.addDependency(newPath)
            callback(null,data)
        })
    }else{
        callback(null,source)
    }


}
module.exports.raw = true
