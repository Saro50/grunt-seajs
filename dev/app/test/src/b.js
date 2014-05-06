define(function(require, exports, module) {
	// body...
	require("app/test/dist/style.css");
	module.exports = {
		foo : function() {
			console.log(" %c=======> hello this is b <======","font-size:18px;color:red;");
		}
	};
});