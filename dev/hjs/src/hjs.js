/**
 * @date 2013-10-21
 * 
 */
var HJS = {};
(function(window,undefined){
    var events = {},
        inits = {},
        _ = {},
        ACTION = 'data-action',
        $ = window.$,
        doc = window.document ;

        HJS._ = _ ;
        
        HJS.Util = _ ;

    _.getAttribute = function( el ,name ){
        return el.getAttribute(name);
    };

    _.type = function( val ){
        if(val === null){
            return "null";
        }
     var toString = Object.prototype.toString;
       return toString.call(val).split(" ")[1].replace("]","");
    };


   _.getAgent = (function(){
    var nvg= window.navigator,
      browser_id =["Chrome","MSIE","Firefox","Opera","Safari"] ,
      vendors = ["Google"],
      browserName = "",
      browserVersion = "",
      search = function(orginStr,matcher){
        var i = matcher.length,
          result = -1;
        while( i > 0 ){
          if((result = orginStr.indexOf(matcher[--i]))!=-1){
            break;
          }
        }
        return {
          index:result,
          position:i
        };
      },
      get_version = function(name){
        var agent = nvg.userAgent,
          begin = agent.indexOf(name),
          restAgent = agent.substring(begin);
          version = /(\d+([.]\d+)*)/;
          if(version.test(restAgent)){
            return RegExp.$1;
          }

          return null;
      };
      var vendor = search(nvg.vendor?nvg.vendor:"",vendors);
      if(vendor.index!=-1){
          browserName = browser_id[vendor.position];
          browserVersion = get_version(browserName);
      }else{
        var agent = search(nvg.userAgent,browser_id);
          browserName = browser_id[agent.position];
          browserVersion = get_version(browserName);
      }
    return function(){
      return {
        name:browserName,
        version:browserVersion
      };
    };
  })();

    /**
     * [aop description]
     * @param  {[type]} orgFn    [description]
     * @param  {[type]} beforeFn [description]
     * @param  {[type]} afterFn  [description]
     * @return {[fn]}          [description]
     */
    _.aop = function( orgFn  , opts  ){
      return function(){
        var slice = Array.prototype.slice;
        opts.before&&opts.before();

        orgFn.apply(opts.context ? opts.context : null , slice.call(arguments,0));

        opts.after&&opts.after();
      } ;
    };

    _.define = function( space , name , val ){
            var p ;
            if(!space[name]){
                space[name] = {};
            }
            for( p in val ){
                if( val.hasOwnProperty( p ) ){
                    space[name][p] = val[p];    
                }
            }
        };

    _.each = function(arr,fn){
            var i=0;
            for( ; i<arr.length ; ++i ){
                fn.apply(arr[i],[ arr[i] , i ]);
            }
        };

    /**
     * [templateParser description]
     * @param  {[string]} template [description]
     * @param  {[object || array ]} data     [description]
     * @param  {[string]} reg      [description]
     * @return {[string]}  content   [description]
     */
    _.templateParser = function(template,data,r){
        var reg = r||"#";
        var content = "";

        function renderFromObject(t,d){
            var p ,regexp,content = t;
            for(p in d){
                regexp =new RegExp(reg+p+reg);
                if(d.hasOwnProperty(p)){    
                    while(content.match(regexp)){
                        content = content.replace(regexp,d[p]);
                    }
                }
            }
            return content;
        }
        if (typeof data !== "object"){
            try{
              
            }catch(e){
                throw {
                    message:"wrong data"
                };
            }
        }
        if(!(data instanceof Array) ){
            data = [data];
        }

        var i = 0,
            len = data.length ;
        for(;i < len ; ++i ){
            content += renderFromObject(template,data[i]);
        }  
        return content;
    };
/**
 *  @render localStorage for lt IE8
 *   
 */
    if(!window.localStorage){
        doc.onreadystatechange  = function(){
            if( doc.readyState === "complete" ) {
            _.define( window , "localStorage" ,(function(){
                var domain = window.location.host ,
                    behaviorUrl = '#default#userData',
                    dataSource = doc.createElement("DIV");
                    doc.body.appendChild(dataSource);
                    dataSource.style.display = "none";
                    dataSource.style.behavior = "url(" + behaviorUrl + ")";
                    dataSource.addBehavior( behaviorUrl );
                    window.localStorage = {
                            setItem : function( name , value ){
                                dataSource.load( domain );
                                dataSource.setAttribute( name , value );
                                dataSource.save( domain );
                            },
                            getItem : function( name ){
                                dataSource.load( domain );
                                return dataSource.getAttribute( name );
                            },
                            removeItem : function( key ){
                                dataSource.load( domain );
                                dataSource.removeAttribute( key );
                                dataSource.save( domain );
                            }
                    };
            })());
            doc.onreadystatechange = null;
        }
        };
    }
    _.addEvent = function(el,type,fn ,pup){
                    if(el.addEventListener){
                        return el.addEventListener(type , fn ,pup );
                    }else{
                        return el.attachEvent("on"+type , fn);
                    }
                };
    /**
     * [serialize jQuery needed]
     * @param  {[type]} form [description]
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    _.serialize = function( form , opts ){
         return $.map($(form).serialize().split("&") , function( el  ){
            var tmp = el.split("=");
            return (tmp[0] in opts)?tmp[0] + "=" + opts[tmp[0]](tmp[1]) : tmp.join("=");
         }).join("&");
    };

    /**
     * [date_getDistance description]
     * @return {[type]} [description]
     */
    _.date_getDistance = function( ms ){
      var d = [1e3 *  36e2 * 24 , 1e3 * 36e2 , 1e3 * 60 , 1e3],
        result = [],
        i = 0;
        for(; i < d.length ; ++i ){
          result.push( Math.floor(ms/d[i]) );
          ms = ms%d[i];
        }
        return result;
    };
/**
 * [addEvent Proxy global event ]
 * @param {[string]}  type [event type 'click , mousemove , ...']
 * @param {[string]}  tag  [ trigger tag ]
 * @param {Function} fn   [event callback]
 */
    HJS.addEvent =  function( type , tag , fn ){
        if( !events[type] ){
            events[type] = {};
            events[type][tag] = fn;
            _.addEvent( doc.body , type ,function(e){
                var cur = e.target || e.srcElement,
                    action = cur.nodeType === 1 ? _.getAttribute( cur , ACTION ) : false ;
                    if(!action){return;}
                    else{
                        if( action in events[type] ){
                            if( _.type( events[type][action] ) === "Function" ){
                                events[type][action].apply(cur,[e]);
                            }
                        }
                    }
            });

        }else{
            events[type][tag] = fn;
        }
    };

/**
 * [removeEvent description]
 * @param  {[string]} type 
 * @param  {[string]} tag  
 */
    HJS.removeEvent = function( type , tag ){
        events[type][tag] = null;
    };

/**
 * [register description]
 * 注册页面交互js
 * @param  {[String]}   flag [唯一的页面标识]
 * @param  {Function} fn   [页面交互的初始化函数]
 */
    HJS.register = function( flag , fn ){
        if( !inits[flag] ){
            inits[flag] = fn;
        }else{
            throw {
                message:flag + " has been registered !"
            };
        }
    };
/**
 * [init description]
 * 页面初始化
 * @param  {[String]} flag [唯一的页面标识]
 */
    HJS.init = function( flag ){
        inits[flag]();
    };

/**
 * HJS.widget
 */
    HJS.widgets = {};
    
    /**
     * [Upload description]
     * @param {[HTML element]} el   [description]
     * @param {[object]} params  [description]
     * @param {[object]} opts [optional params]
     * required  "jquery , jquery.uploadify.min.js"
     * 
     */
    HJS.widgets.Upload = function( el ,  params , opts){
        // if(!(this instanceof HJS.widgets.Upload)){
        //     return new HJS.widgets.Upload(  el , params , opts );
        // }
        var defaultOpts = opts || {
                previewList:false
            };

        var listWrapper = doc.createElement("DIV");
        
        var slibing = el.nextSibling,
            tpl = defaultOpts.template ? defaultOpts.template : "<div class='cancel'><a data-action='delete' ></a></div>"+
                "<ul class='uploadify-list clear'><li><img width='80' height='80' src = '#data#' /></li><li><div><label>图片描述:</label></div><div><textarea style='resize:none;margin: 2px; height: 57px; width: 214px' ></textarea></div></li></ul>";
                
        var  parent = el.parentNode;
            parent.insertBefore( listWrapper , slibing);

// _.templateParser
        var lim = defaultOpts.previewListLimit ,
            cName = defaultOpts.previewListClass;
            if(cName){
                listWrapper.className = cName;
            }
        var addItems = defaultOpts.previewList ? function( file, data ,response , limit ){
            var wrap = doc.createElement("DIV");
                wrap.className = 'uploadify-queue-item';
                if(typeof data !== "object"){
                data = $.parseJSON(data);
                }
                wrap.innerHTML= _.templateParser(tpl ,  data );
                listWrapper.appendChild(wrap);
                if(limit){
                    var items = $(listWrapper).find(".uploadify-queue-item"),
                        i = 0,
                        j = items.length - limit ;
                        for( ; i < j ; ++ i ){
                           listWrapper.removeChild(items[i]); 
                        }
                }
                btnSyn();
            } : function(){};

        if(defaultOpts.previewList.data){
            (function(){
            var d = defaultOpts.previewList.data, i = 0 ,wrap,
                len = d.length;

                for(;i < len ; ++i ){
                    wrap = doc.createElement("DIV");
                    wrap.className = 'uploadify-queue-item';
                    wrap.innerHTML= _.templateParser(tpl , d[i]);
                    listWrapper.appendChild(wrap);
                }
                btnSyn();
            })();
        }

        var beforeDelete = opts.beforeDelete || function(){ return true;},
            afterDelete = opts.afterDelete || function(){};

        function btnSyn(){
            var wraps = listWrapper.children, p ,
                $liftBtn,
                $sinkBtn;
               for(var i = 0 ; i < wraps.length ; ++ i ){
                     p = wraps[i];
                    $liftBtn = $(p).find("[data-action='lift']");
                    $sinkBtn = $(p).find("[data-action='sink']");
                    if( p.previousSibling === null ){
                        $liftBtn.hide();
                    }else{
                        $liftBtn.show() ;
                    }
                    if( p.nextSibling === null ){
                        $sinkBtn.hide();
                    }else{
                         $sinkBtn.show();
                    }
                }
          
        }   

        $(listWrapper).click(function(e){
                var cur = e.target || e.srcElement,
                    p = cur.parentNode,
                    action = cur.getAttribute("data-action");
                    if(!action){
                        return;
                    }
                   for(; p.className !== 'uploadify-queue-item'; ) {
                        p = p.parentNode;
                    }

                var f = p.parentNode;
                    switch(action){
                        case "delete":
                        if( beforeDelete(p) ){
                            p.innerHTML = "";
                            p.style.display = 'none';
                            p = null;
                            afterDelete(p);
                            btnSyn();
                        }
                            break;
                        case "lift":
                        f.insertBefore( p , p.previousSibling);
                        btnSyn( p );
                        break;
                        case "sink":
                        f.insertBefore( p , p.nextSibling.nextSibling);
                        btnSyn( p );
                        break;
                        default:
                        break;
                    }
            });

        var onUploadSuccess = function(fn){
            return function(file, data, response){
                    fn(file, data, response);
                    addItems(file, data, response , lim );
            };
        };
        
        if(params.onUploadSuccess){
            params.onUploadSuccess = onUploadSuccess( params.onUploadSuccess );
        }
        $(el).uploadify(params);
    };

    HJS.widgets.window = function( opts){
        if(!(this instanceof HJS.widgets.window )){
            return new HJS.widgets.window( opts );
        }
       opts = opts ? opts : {};
        this._init( opts );

        return this;
    };
    HJS.widgets.window.prototype = (function(){
        var hasCover = false,
            DEFAULT = {
                        W_CLASSNAME : "c-window",
                        C_CLASSNAME : "c-cover"
                    };
        return {
                _cover : {
                    el:doc.createElement("DIV"),
                    hide:function(){
                        this.el.style.display='none';
                    },
                    show:function(){
                        this.el.style.display='block';
                    },
                    off : function(){
                        doc.body.removeChild( this.el );
                    },
                    on : function(){
                        doc.body.appendChild( this.el );
                    },
                    _init:function(){
                        this.el.className = DEFAULT.C_CLASSNAME;
                        doc.body.appendChild( this.el );
                        this.hide();
                    }
                },
                hide : function(){
                    this.el.style.display = "none";
                    this._cover.hide();
                },
                show : function(){
                    this.el.style.display = 'block';
                    var innerHeight = window.innerHeight || doc.body.offsetHeight ;
                    var innerWidth = window.innerWidth || doc.body.offsetWidth;
                    this.position( (innerWidth - this.el.offsetWidth)/2 , (innerHeight - this.el.offsetHeight)/2 );
                    this._cover.show();
                },
                open : function( content ){
                    if(content){
                        this.getContent(content);
                    }
                    this.show();
                },
                addEvent : function( name ,  fn){
                    this.events[name] = fn;
                },
                position : function( x , y ){
                    this.el.style.top = y + "px";
                    this.el.style.left = x + 'px';
                },
                SIMPLETEMPLATE : "<div class='c-w-h'><strong>#title#</strong> <span class='c-w-close' data-action='close'></span></div><div class='c-w-c'><div class='c-w-section'>#content#</div></div>", 
                _init : function( opts  ){
                    var that = this,
                        content = opts.content ? opts.content : "";

                    this.el = doc.createElement("DIV");
                    this.events = {};
                    if(!hasCover){
                        this._cover._init();
                        hasCover = true;
                    }
                    this.el.className = DEFAULT.W_CLASSNAME;
                    doc.body.appendChild(this.el);
                    this.getContent( content );
                    this.position( (doc.body.offsetWidth - this.el.offsetWidth)/2 , (doc.body.offsetHeight - this.el.offsetHeight)/2 );
                    this.hide();
                    this.addEvent( "close" , function(){
                        this.hide();
                    });

                    this.el.onclick = function( e ){
                        if(!e){
                            e = window.event;
                        }
                      var cur = e.target || e.srcElement,
                        action = cur.getAttribute("data-action");
                        if(that.events[action]){
                            that.events[action].apply(that , [e]);
                        }
                    };
                },
                getContent : function( content ){
                    if( _.type(content) === "String" ){
                        this.el.innerHTML = content;
                    }else{
                        this.el.appendChild(content);
                    }
                },
                getSimpleContent : function( title , content ){
                    this.getContent(_.templateParser(this.SIMPLETEMPLATE , {
                        title : title ,
                        content : content 
                    }));
                },
                error:function(content, title){
                    this.getSimpleContent(title || '错误信息' ,  "<span class='c-w-wrong'>" + content + "</span><div style='text-align: center;'><a data-action='close' class='c-red-btn'>确定</a></div>" );
                    this.show();
                },
                tip:function(content, title){
                    this.getSimpleContent(title || '提示信息', "<span class='c-dp'>" + content + "</span><div style='text-align: center;'><a data-action='close' class='c-red-btn'>确定</a></div>" );
                    this.show();
                }
            };
    })();


    /*
    Validate for form

        @Autor: WuNing
        @date: 2013-3-21 
        @main method:
            setHandle:{
                handle:{
                    clickPager:fn,
                    setPager:fn,
                    pre:fn,
                    next:fn
                }
            }
            destroy:

        @config style by CONST value
*/
_.getAgent = (function(){
        var nvg= window.navigator,
            browser_id =["Chrome","MSIE","Firefox","Opera","Safari"] ,
            vendors = ["Google"],
            browserName = "",
            browserVersion = "",
            search = function(orginStr,matcher){
                var i = matcher.length,
                    result = -1;
                while( i > 0 ){
                    if((result = orginStr.indexOf(matcher[--i]))!==-1){
                        break;
                    }
                }
                return {
                    index:result,
                    position:i
                };
            },
            get_version = function(name){
                var agent = nvg.userAgent,
                    begin = agent.indexOf(name),
                    restAgent = agent.substring(begin),
                    version = /(\d+([.]\d+)*)/;
                    if(version.test(restAgent)){
                        return RegExp.$1;
                    }

                    return null;
            };
            var vendor = search(nvg.vendor?nvg.vendor:"",vendors);
            if(vendor.index!==-1){
                    browserName = browser_id[vendor.position];
                    browserVersion = get_version(browserName);
            }else{
                var agent = search(nvg.userAgent,browser_id);
                    browserName = browser_id[agent.position];
                    browserVersion = get_version(browserName);
            }
        return function(){
            return {
                name : browserName ,
                nameAndVersion : browserName + browserVersion,
                version : browserVersion
            };
        };
    })();
    HJS.widgets._validate = function(){
            var id = 0,
                isIE = _.getAgent().name ==="MSIE" ? true : false,
                invalid_handle = function(el){
                    if(isIE){
                        el.checkValidity = function(){
                            var pattern = this.attributes["pattern"],
                                /*
                                    @modify by wuning 2013/3/26 
                                    FOR damn IE
                                    lt IE7: this.attributes["required"] always eixsted;
                                    gt IE7: when required specified , this.attributes["required"] existed;
                                */
                                required = this.attributes["required"]?this.attributes["required"].specified:false,
                                value =$.trim(this.value);          
                                if(value === ""){
                                    if(required){
                                        if(typeof this.oninvalid === "function"){
                                            this.oninvalid();
                                        }
                                        return false;
                                    }else{
                                        return true;
                                    }
                                }else{
                                    if(pattern&&pattern.specified){
                                    var reg = new RegExp("^" + pattern.value + "$");
                                        if(reg.test(value)){
                                            return true;
                                        }else{
                                            if(typeof this.oninvalid === "function"){
                                                this.oninvalid();
                                            }
                                        return false;
                                        }
                                    }else{
                                        return true;
                                    }
                                }
                        };
                    }
                };
            return function(options){
                var that = this,
                    el = options.el,
                    blur = options.blur,
                    change = options.change,
                    focus = options.focus,
                    wraper = options.wraper,
                    invalid = options.invalid;
       
                this.invalid = invalid;
                this.change = change;
                this.focus = focus;
                this._id = id++;
                this.el = el;
                this.wraper = wraper;
                /*
                    @modify by wuning 2013/5/7
                    render blur listener
                */
                this.blur = blur;
                this.name = el.name;
                this.id = el.id;
                
                this.update = function(){
                    if(that.name in wraper.rules){
                        that.rules = wraper.rules[that.name];
                    }
                    return that;
                };
                this.update();

                this.check = function(){
                    var rules = that.rules||null , valid;
                    if(rules){
                        valid = rules.apply(that.el,[that.el.checkValidity.apply(that.el,[null]),that]);
                        if(!valid){
                            this.el.oninvalid();
                        }
                    }else{
                        valid = that.el.checkValidity.apply(that.el,[null]);
                    }
                 
                    return valid;
                };
                this.el.onchange = function( e ){
                    if(that.change){
                        that.change.apply(this,[that , e]);
                        }
                };
                this.el.oninvalid = function(e){
                    e = e || {};
                    if( this.getAttribute("required")!== null &&this.value === "" ){
                      e.dld_status = 'emptyValue';
                    }else{
                      e.dld_status = "invalidValue"
                    }
                    if(that.invalid){
                        that.invalid.apply(this,[that,e]);
                    }

                };
                this.el._dldValidate = this;
                /*
                    @modify by wuning 2013/5/7
                    render blur listener
                */
                this.el.onblur = function( e ){
                    that.blur && that.blur.apply(this,[that,e]);
                };
                /*
                    @modify by wuning 2013/5/9
                    register focus listener
                */
                this.el.onfocus = function(e){
                    that.focus && that.focus.apply(this,[that,e]);
                };
                if(!isIE){
                    /*  
                        @modify by wuning 2013/3/27
                        required can not validate when there will only blank
                    */
                    if($(el).attr("required")&&($(el).attr("pattern")!="")){
                        // $(el).attr("pattern","[^\\s]*");
                    }
                }
                invalid_handle(el);
            };
        }();


        HJS.widgets.validateForm = function(){
            var id = 0;
            return function(form , opts ){
                var that = this,
                    submit_handle = function(e){
                        var checkResult = that.check(); 
                        var result = that.handle["onsubmit"]?that.handle["onsubmit"].apply(that,[checkResult,e]):true;
                        return result;
                        
                    };
                if(!opts){
                    opts = {};
                }
                this._id = id++;
                this.handle = {};
                this.rules = {};
                var rules = opts.rules || {},
                    handle = opts.handle || {};
                that.validations = [];
                this.el = form;
                // novalidate='true'
                var elType = {
                    "SELECT":true,
                    "INPUT":true,
                    "TEXTARE":true
                };
                this._init = function(){
                    _.each(form.elements,function(){
                        if(this.tagName in elType){
                            that.validations.push(new  HJS.widgets._validate({
                                el:this,
                                wraper:that,
                                invalid:that.handle["invalid"],
                                change:that.handle["change"],
                                blur:that.handle["blur"],
                                focus:that.handle["focus"],
                                rules:that.rules
                                }));
                        }
                    });
                    return this;
                };
                form.noValidate=true;
                this.el.onsubmit = submit_handle;
                this.setHandle(handle);
                this.setRules(rules);
                this._init();
            };
        }();

        HJS.widgets.validateForm.prototype = {
            check:function(){
                var invalid = false;
                _.each(this.validations,function(){
                    if( !this.check() ){
                        invalid = true;
                    }
                });
                if(this.handle["onCheckAll"]){
                    if( !this.handle["onCheckAll"]() ) {
                        invalid = true;
                    }
                }
                return invalid ? false : true;
            },
            setHandle : function(handle){
                var handle = handle ||{};
                this.handle["invalid"] = handle["invalid"];
                this.handle['onsubmit'] = handle["onsubmit"];
                this.handle["change"] = handle["change"];
                this.handle["onCheckAll"] = handle["onCheckAll"];
                /*
                    @modify by wuning 2013/5/7
                    render blur listener
                */
                this.handle['blur'] = handle['blur'];
                /*
                    @modify by wuning 2013/5/9
                    register focus and check listener
                */

                this.handle['focus'] = handle['focus'];
                return this;
            },
            setRules : function(rules){
                this.rules = rules;
                return this;
            },
            submit:function(){
                    this.el.submit();
                }
        };


  
  /**
   * [Player description]
   * @param {[type]} time [description]
   * @param {[type]} ani  [description]
   * @param {[type]} opts [description]
   */
   _.Player = function( time , ani ){
          var timer ,auto = false;     

              this.stop = function(){
                if( auto){
                  clearInterval( timer );
                }else{
                  clearTimeout( timer );
                }
              };

              this.start = function( auto ){
                if( auto ){
                  auto = true;
                  timer = setInterval(ani , time );
                }else{
                  timer = setTimeout( ani , time );
                }
              };

      };



  HJS.widgets.Slider = function( el , time , type , opts ){
          var TIME = time || 10000 ,o = opts ? opts : {},
              curNum = 2 , auto = o.auto || true ,  
              pages =  $(el).find("[data-page]"),
              block = false ,
              pNums =(function(){
                 var p = $(el).find('[data-role="pager"]')[0],
                      dNums,
                      i = 0 ,l = pages.length , content = "";
                      for( ; i < l ; ++i ){
                        content += "<li><a class=''  data-action='fade' data-num = '" + (i + 1) + "' >" + (i + 1) + "</a></li>";
                      }
                    p.innerHTML = content;
                    dNums = $(p).find('[data-num]');
                    dNums[0].className = 'on'; 
                  return function( num ){
                    for( i = 0 ;i < l ; ++ i ){
                      dNums[i].className = "";
                    }
                    dNums[ num - 1 ].className = 'on';
                  };
              })(),
              typeFactory = function( type ) {
                   var T = {
                        fade :{
                          cover : null ,
                          init : function(){
                            var len = pages.length , i = 0;
                              this.els = [];
                              this.MAX = len;
                              for( i ; i < len ; ++ i ){
                                pages[i].style.position = "absolute" ;
                                pages[i].style.zIndex = len - i + 1;
                                pages[i].style.display = "none";
                              }
                              pages[0].style.display = "";
                              this.cover = pages[0];
                          },
                          resetIndex : function( num ){
                              var i = num  , j = 0 , len = pages.length;
                              for( ; i < len ; ++ i ){
                                pages[i].style.zIndex = len - (j++) + 1; 
                              }
                              for( i = 0 ; i < num ; ++ i ){
                                pages[i].style.zIndex = len - (j++) + 1;
                              }
                          },
                          animate : function( pNum ){
                            if(this.cover === pages[pNum-1]){
                              return;
                            }
                            block = true;
                            var cover_index = parseInt( this.cover.style.zIndex ,10 ),
                                that = this;
                            pages[ pNum - 1 ].style.display = "";
                            pages[ pNum - 1 ].style.zIndex = cover_index - 1; 

                            $( this.cover ).fadeOut(1000 ,function(){
                              that.cover = pages[ pNum - 1 ];
                              that.resetIndex( pNum-1 );
                               block = false;
                            });
                          }
                        }
                      };
                      return T[type];
              },
              play;
              var categoryObj = typeFactory(type);
              categoryObj.init(el);
              play = new _.Player( TIME ,function(){
                  categoryObj.animate( curNum  );
                  pNums( curNum );
                  if( curNum === pages.length ){
                     curNum = 1;
                    }else{
                      curNum ++ ;
                    }
                  });
            play.start(auto);

            $(el).click(function(e){
                var event = e || window.event,
                    cur = event.srcElement || event.target,
                    action = cur.getAttribute('data-action');
                    switch(action){
                      case "fade":
                        var pageNum = parseInt(cur.getAttribute("data-num") , 10 );
                        if(!block){
                          categoryObj.animate( pageNum  );
                          curNum = pageNum;
                          pNums( pageNum );
                        }
                        break;
                    }
            });
      };  

    _.getDefault = function( src ,  dest ){
            var p ;
            for( p in src ){
                if( src.hasOwnProperty(p) ) {
                    dest[p] = src[p];
                }
            }
            return dest;
    };

    /**
     * [Tab description]
     * @param {[type]} el   [description]
     * @param {[type]} opts [description]
     */
    HJS.widgets.Tab = function(el , opts){
        if( el.tagName !== "UL" ){
            throw {
                message : "Must UL element"
            };
        }
        var lis = el.getElementsByTagName("LI"),
            l = lis.length,that = this,
            defaultOpts = _.getDefault(opts , {
                className : "selected"
            }),
            i = 0;
            this.opts = defaultOpts;
            this.contents = defaultOpts.contents || []; 
            this.lis = lis;
            this.cName = defaultOpts.className;
            for( ; i < l ; ++ i ){
               lis[i].setAttribute("data-tab" , i ); 
            }

            _.addEvent(el , "click" , function(event){
                var e = event || window.event,
                    cur = e.target || e.srcElement;
                    if(cur.tagName === 'UL'){
                        return;
                    }
                    while(cur.tagName !== "LI" ){
                        cur = cur.parentNode;
                    }
                    var tab = cur.getAttribute('data-tab');
                    that.select( tab );
            });
            if(defaultOpts.init){
                defaultOpts.init.call(this);
            }
    };
    HJS.widgets.Tab.prototype = {
        select : function( num ){
            var lis = this.lis,contents = this.contents,
                l = lis.length,
                i = 0;

                for( ; i < l; ++i ){
                    lis[i].className = "";
                    if(contents[i]){
                    contents[i].style.display = "none";
                  }
                }
                lis[num].className = this.cName;
                if(contents[num]){
                contents[num].style.display = "";
               }
                if( this.opts.onSelect && this.opts.onSelect[num] ) {
                    this.opts.onSelect[num].call(lis[num] , this);
                }

        }
    };

    HJS.widgets.PlaceHolder =function(argument) {
        // body...
    }
})(window,undefined);
if ( typeof define === "function" ) {
    define("hjs/src/hjs"  , [] , function (require, exports, module) {
        require.async("hjs/src/hjs-ui.css");
        var $ = require("jquery");
        return HJS; 
    });
}