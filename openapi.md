/**
 * tencent open API
 * @基本流程
 *
 *  1.用户从平台进入应用，平台自动添加查询参数
 *      @openid 用户标识
 *      @openkey 会话标识
 *      @pf 来源说明
 *      @pfkey
 *      @invkey 邀请验证key
 *      @iopenid 邀请人用户标识
 *      @itime 邀请时间
 *      @souce 自定义参数
 *      @app_custom 自定义参数
 *
 *  2.获取会话以及基本信息后。调用接口完成功能
 *      需引入，基础库
 *       <script type="text/javascript" charset="utf-8" src="http://fusion.qq.com/fusion_loader?appid=24341&platform=qzone"></script> 
 *             
 *      @登陆信息：
 *          * 解析url查询参数，返回对应信息
 *              
 *              @Object getSessionInfo()
 *                   #openid
 *                   #openkey
 *                   #pf
 *                   #invkey
 *                   #iopenid
 *                   #itime
 *                   #souce
 *                   #app_custom  
 *                      
 *              
 *      @重登陆逻辑：
 *          * 腾讯后台登陆态校验接口
 *              - v3/user/is_login
 *          * 腾讯前台提示重新登陆窗，需引入js
 *              调用方法 fusion2.control.enableAntiAddiction()
 *                      fusion2.dialog.relogin()
 *          * 假如应用保有自己的登陆态，此接口暂不管
 *          
 *              @Void relogin()
 *              
 *      @退出：
 *          * 销毁登陆态
 *          * 跳转至退出链接
 *          
 *              @void loginout()
 *      @防沉迷：
 *          * 引入上文JS
 *              调用方法 fusion2.control.enableAntiAddiction()
 *
 *              @void enableAntiAddiction( function callback(rate)  )//传入防沉迷回调
 * 
 *      @付费接口：（道具寄售支付模式）
 *          * 接口请求
 *              #所需公共参数
 *                  @openid 透传
 *                  @openkey 透传
 *                  @appid （后台）需填
 *                  @sig （后台）需填
 *                  @pf 透传
 *              前端发起请求给APP服务，
 *              
 *              APP服务后台请求腾讯支付: https://[域名]/v3/pay/buy_goods 
 *
 *              支付完成，通知APP服务后台，客户端响应
 *
 * 
 *          * 前端提示弹窗接口
 *              需引入相关js
 *              fusion2.dialog.buy()
 *
 *              @void pay( Object options )
 *                    @param {[host]} [varname] [description]
 *          
 *      @底部信息
 *         * 返回应用相关信息
 *
 *              @Object getAppInfo()
 *                  
 *              
 */
(function( global ){
    var CONFIG ＝ {
        host : "xxx.qq.com" ,
        baseurl : 'finlay.qq.com'
    };
    var href = global.navigator.href ;

    /**
     * valid regexp
     * ^([0-9A-F]{32})$
     */

})(window);
