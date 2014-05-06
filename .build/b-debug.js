define("app/test/dist/b-debug", [ "http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css" ], function(require, exports, module) {
    // body...
    require("http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style-debug.css");
    module.exports = {
        foo: function() {
            console.log(" %c=======> hello this is b <======", "font-size:18px;color:red;");
        }
    };
});