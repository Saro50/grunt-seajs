#前端构建工具说明#

##主要使用工具##

[seajs][0]: 一个前端模块化开发工具。同时提供配套构建插件

[Gruntjs][1]: 前端任务运行器.提供各类插件用于前端开发，例如`JSLint`代码检验，优化,`concat`合并文件插件,`uglify`压缩工具,与`CMD`规范(一种js模块化开发的规范提议)配合的`grunt-cmd-concat`,这里主要是用于配合`seajs`,将多个文件合并压缩

[0]:http://seajs.org/docs/ "seajs参考文档"
[1]:http://gruntjs.cn/ "Grunt参考文档"

##使用环境##

以上工具，构建环境需要[nodeJs][2]。

[2]:http://nodejs.org/ "nodeJs参考文档"

#目录结构说明#

- .build 临时文件目录,构建过程中生成的临时目录，最终会被删除
- app 测试应用目录,
- dev 开发目录，此目录为生产环境中使用
    - app 各页面js文件,示例如下，假设有lend与account:
        - lend 借款相关界面
            - dist 目标文件与account相同
                + index-debug.js 生成的调试文件
                + index.js 构建好的文件
                + commom-debug.js
                + commom.js
            - src 原文件
                + index.js
                + commom.js
        - account 账户相关界面
            - dist 
                + commom-debug.js
                + commom.js 
            - src
                + commom.js
                + userCenter.js
    - hjs 公共组件js文件，下同，seajs,jquery
    - jquery 有些库已经构建好了，所以没有包含src与dist目录，只是直接包含对应文件比如jquery与seajs。
    - seajs
- node_modules 开发环境依赖插件,如没有构建环境则无需理睬
- seajs_modules 部署应用目录,此目录中的文件应与线上环境是一致
    - app
        - lend
            + index-debug.js
            + index.js
            + commom-debug.js
            + commom.js            
        - account
            + commom-debug.js
            + commom.js
    - hjs 公共组件文件，非常简单的组件，没有区分版本，其下直接到已经构建过的文件
        - hjs.js
    - jquery
        + jquery
            * 1.10.1
                - jquery.js
                - jquery-debug.js 调试使用的文件
                - package.json 发布的描述文件,用于seajs的spm平台，不用关注
    - [seajs][0] 
        + seajs
            * 2.1.0
            * 2.1.1
            * 2.2.0 这里直接使用的最新版本
- theme 样式目录
    - Gruntfile.js 构建文件
    - package.json 依赖说明文件
    - rootConfig.js 测试路径配置文件

#以hjs为实例的简单说明#

>目录说明

- dev `开发目录此目录保留的为原始文件`
    + hjs
        * 1.0 `版本号`
            - lib `less 样式库`
            - hjs.js
            - hjs-ui.less `less样式原文件`
            - hjs-ui.css `编译后的样式文件`
- seajs_modules `已构建文件，发布位置.`
    + hjs
        * 1.0
            - hjs-debug.js
            - hjs.js  `这里已将样式文件打包进了js文件`

>`Gruntfile`介绍

Grunt会需要依次运行这么几个任务

##`transport`:##
模块分析转换，将CMD模块的id以及路径提取出来，hjs并没有多个js文件合并，以两个假设文件来说明

    //test.js文件
    define(function(require, exports, module) {
        //这里假设引入了同一文件夹下的b.js文件.并调用了它导出的方法
        var b = require("./b");
        b.foo();
    });

    //b.js文件
    define(function(require, exports, module) {
        require("app/test/dist/style.css");//这里假设引入了一个样式
        module.exports = { //上面a.js文件所调用的方法
            foo : function() {
                console.log(" %c=======> hello this is b <======","font-size:18px;color:red;");
            }
        };
    }); 

当经过`transport`这个步骤以后,会转译出这么几个文件(这里可以自己指定output的文件位置，这些临时文件被我放到一个.build目录下),在临时文件目录下可以看到如下几个文件

- test.js
- test-debug.js
- b.js
- b-debug.js 

`debug`文件与其它文件的区别只是，不会被压缩。下面是被提取模块名字后的两个文件

    //test.js文件
    //转换后看到define的参数被补全了,都定义了其模块名字，和依赖,
    //并且根据配置文件package.json中的spm属性替换了样式的路径

        define("app/test/dist/test", [ "./b", "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css", "hjs", "jquery/jquery/1.10.1/jquery" ], function(require, exports, module) {
            var b = require("./b");
            b.foo();
    });

    //b.js文件
    define("app/test/dist/b", [ "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css" ], function(require, exports, module) {
       
        require("http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css");
        module.exports = {
            foo: function() {
                console.log(" %c=======> hello this is b <======", "font-size:18px;color:red;");
            }
        };
    });

    //package.json 配置文件中影响提取模块名的属性
    "spm": {
          "alias": {
              "jquery" : "jquery/jquery/1.10.1/jquery",
              "app/test/dist/style.css" : "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css"
            }
        }

`.build`目录出现并且有这么几个文件了，表示这个步骤的任务已经完成.接下来是

##`concat`:##
合并任务,合并任务很简单,将debug文件合并到一起，非debug文件合并到一起。然后输出到部署的位置,我这里是seajs_modules目录

##`uglify`:##
这里将非debug文件构建输出到对应位置。




