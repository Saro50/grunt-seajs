define("app/test/dist/b",["http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css"],function(require,exports,module){require("http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css"),module.exports={foo:function(){console.log(" %c=======> hello this is b <======","font-size:18px;color:red;")}}}),define("app/test/dist/style-debug.css",[],function(){seajs.importStyle(".className{text-align:center}")}),define("app/test/dist/style.css",[],function(){seajs.importStyle(".className{text-align:center}")}),define("app/test/dist/test",["./b","http://css.wn.com:8080/grunt/seajs_modules/app/test/dist/style.css","hjs","jquery/jquery/1.10.1/jquery"],function(require){var a=require("./b"),b=require("hjs"),c=require("jquery/jquery/1.10.1/jquery"),d=new b.widgets.window;console.log("IE: ",document.documentElement.offsetHeight),d.getSimpleContent("跳转到网上银行充值",c("#win_template").html()),b.addEvent("click","hjs_show_win",function(){d.open()}),window.onload=function(){setTimeout(function(){d.open()},500)},a.foo()});