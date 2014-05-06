define("app/test/dist/b-debug", [ "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css" ], function(require, exports, module) {
    // body...
    require("http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css");
    module.exports = {
        foo: function() {
            console.log(" %c=======> hello this is b <======", "font-size:18px;color:red;");
        }
    };
});
define("app/test/dist/test-debug", [ "./b-debug", "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css", "hjs-debug" ], function(require, exports, module) {
    // require("http://css.wn.com:8080/grunt/seajs_modules/hjs/src/hjs-ui.css");  
    var b = require("./b-debug");
    var HJS = require("hjs-debug");
    console.dir(HJS);
    console.dir(b);
    var win = new HJS.widgets.window();
    win.getSimpleContent("Tile", "This is content");
    HJS.addEvent("click", "hjs_show_win", function() {
        win.open();
    });
    b.foo();
});
