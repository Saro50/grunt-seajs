define(function(require, exports, module) {
	// require("http://css.wn.com:8080/grunt/seajs_modules/hjs/src/hjs-ui.css");  
	var b = require("./b");
	var HJS = require("hjs");
	var $ = require("jquery");
	var win = new HJS.widgets.window();
 console.log("IE: ",document.documentElement.offsetHeight);
	win.getSimpleContent("跳转到网上银行充值",$("#win_template").html());
	HJS.addEvent("click","hjs_show_win",function() {	
		win.open();
	});
	window.onload = function(){
		setTimeout(function(){
			win.open();
		},500);
	};
	b.foo();
});