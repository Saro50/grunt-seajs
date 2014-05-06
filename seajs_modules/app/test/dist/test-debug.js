define("app/test/dist/b-debug", [ "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css" ], function(require, exports, module) {
    // body...
    require("http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css");
    module.exports = {
        foo: function() {
            console.log(" %c=======> hello this is b <======", "font-size:18px;color:red;");
        }
    };
});
define("app/test/dist/test-debug", [ "./b-debug", "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css", "hjs-debug", "jquery/jquery/1.10.1/jquery-debug" ], function(require, exports, module) {
    // require("http://css.wn.com:8080/grunt/seajs_modules/hjs/src/hjs-ui.css");  
    var b = require("./b-debug");
    var HJS = require("hjs-debug");
    var $ = require("jquery/jquery/1.10.1/jquery-debug");
    var win = new HJS.widgets.window();
    console.log("IE: ", document.documentElement.offsetHeight);
    win.getSimpleContent("跳转到网上银行充值", $("#win_template").html());
    HJS.addEvent("click", "hjs_show_win", function() {
        win.open();
    });
    window.onload = function() {
        setTimeout(function() {
            win.open();
        }, 500);
    };
    b.foo();
});
