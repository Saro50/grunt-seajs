define(function(require, exports, module) {
	// require("http://css.wn.com:8080/grunt/seajs_modules/hjs/src/hjs-ui.css");  
	var b = require("./b");
	var HJS = require("hjs");
	
	var win = new HJS.widgets.window();
	win.getSimpleContent("Tile","This is content");
	HJS.addEvent("click","hjs_show_win",function() {	
		win.open();
	});
		win.open();
	b.foo();
}); 