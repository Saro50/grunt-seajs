define(function(require, exports, module){
	var $ = require("jquery"),
		doc = document;
	// console.log("%c herer is guide","font-size:22px;color:red");
	require("../hjs/src/hjs-ui.css");
	var cover = doc.createElement("DIV") ,
		$items = $("[data-step]");
	var ex_container = doc.createElement("DIV"),
		mesage_container = doc.createElement("DIV");
		mesage_container.innerHTML = "<span class='arrow-left'></span><div>这是步骤一</div>";
		cover.className = "c-cover";
		mesage_container.className = "c-guide";
		doc.body.appendChild(cover);
		doc.body.appendChild(mesage_container);
	
	var limiter_px = window.innerWidth || document.documentElement.offsetWidth;
	var view_contoller = {
		cover : cover ,
		ex : ex_container ,
		collection : [] ,
		msg_con : mesage_container ,
		it : 0 ,
		init : function(){
			var that = this ;
			$.each( $items ,function(argument) {
				that.collection[this.getAttribute("data-step")] = this;	
			});
			that.ex.style.position = "absolute";
			that.ex.style.zIndex = "999";
			doc.body.appendChild( this.ex );
		},
		message : function( el , pointer ){
			var msg = el.getAttribute("data-message") ,
				left =  pointer.left +  8 + el.offsetWidth , 
				arrow = this.msg_con.getElementsByTagName("SPAN")[0] ,
				content_wrapper = this.msg_con.getElementsByTagName("DIV")[0];
				content_wrapper.innerHTML = msg ;
				if( left > (limiter_px - 100) ){
					left = left - this.msg_con.offsetWidth - el.offsetWidth - 14;
					arrow.className = "arrow-right";
				}else{
					arrow.className = "arrow-left"
				}
				this.msg_con.style.left = left+ "px" ;
				this.msg_con.style.top = pointer.top + "px" ;
		},
		setInfo : function( el ){
			var it = this.it,
				collection = this.collection ,
				ex_container = this.ex ,
				pointer = collection[it] ? $(collection[it]).offset() : null;
			if(pointer){
				ex_container.innerHTML = $(collection[it]).html();
				ex_container.className = collection[it].className;
				ex_container.style.left = pointer.left + "px";
				ex_container.style.top = pointer.top + "px";
				ex_container.style.width = collection[it].offsetWidth + "px";
				ex_container.style.height = collection[it].offsetHeight + "px";
				var top_from = (pointer.top - 300) > 0 ? (pointer.top - 300) : pointer.top;

				window.scrollTo( 0 , top_from );
				this.message( collection[it] , pointer);
				++this.it;
			}else{
				this.finished();
			}
		},
		finished : function(){
			this.cover.style.display = "none";
			this.ex.style.display = "none";
			this.msg_con.style.display = "none";
		}
	};


	view_contoller.init();
	view_contoller.setInfo();

	ex_container.onclick = function(){
		view_contoller.setInfo();
	};

	// console.dir(pointer);
});