define("app/test/dist/b",["http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css"],function(require,exports,module){require("http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css"),module.exports={foo:function(){console.log(" %c=======> hello this is b <======","font-size:18px;color:red;")}}}),define("app/test/dist/test",["./b","http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css","hjs"],function(require){var a=require("./b"),b=require("hjs");console.dir(b),console.dir(a);var c=new b.widgets.window;c.getSimpleContent("Tile","This is content"),b.addEvent("click","hjs_show_win",function(){c.open()}),a.foo()});