/**
 * 插件打标吐槽弹窗
 */
var m_dialog_href = window.location.href;
var m_dialog_topHref = top.location.href;
var m_dialog_isCc = false;//正式 false 测试 true

//是否正式 如果正式则请求网上的js 否则调试本地
if (m_dialog_isCc) {
    //如果请求的页面与浏览器页面相同则执行(防止包含iframe重复请求js)
    if (m_dialog_href && m_dialog_href == m_dialog_topHref) {
        //传入对应的url 获取对应的js
        //截取字符串前面一段
        m_dialog_href = m_dialog_href.split('?')[0];
        chrome.extension.sendMessage({type: 1, href: m_dialog_topHref}, (data) => {
        });
    }
}
//服务器代码
else {
    if (m_dialog_href && m_dialog_href == m_dialog_topHref) {
        let dialogbaseUrl = baseServerUrl; //网络请求地址
        let dialogUrl = {
            red_dot: dialogbaseUrl + 'extension/plug/buyer/red_dot.php',
            reputation: dialogbaseUrl + 'extension/plug/buyer/reputation.php',
            buyer_drops: dialogbaseUrl + 'extension/plug/buyer/drops.php',//降权记录
            wangwang_info: dialogbaseUrl + 'extension/plug/buyer/wangwang_info.php',
            complaints: dialogbaseUrl + 'extension/plug/buyer/complaints.php',
            advert: dialogbaseUrl + 'extension/advert/index/advert.php',
            complaint: dialogbaseUrl + 'extension/plug/buyer/complaint.php',
            login: dialogbaseUrl + 'extension/plug/index/login.php',
            isSBupload: dialogbaseUrl + 'extension/upload.php',
            sign: dialogbaseUrl + 'extension/plug/buyer/sign.php',
            sign_info: dialogbaseUrl + 'extension/plug/buyer/sign_info.php',
            user_info: dialogbaseUrl + 'extension/plug/index/info.php',
            tbk_info: dialogbaseUrl + 'extension/plug/buyer/tbk_info.php',
            tbk_img: dialogbaseUrl + 'extension/plug/buyer/tbk_img.php',
            share: dialogbaseUrl + 'extension/plug/buyer/share.php',
            upload: dialogbaseUrl + 'extension/upload.php',
            active_qrcode: dialogbaseUrl + 'extension/plug/buyer/active_qrcode.php',
            advert_ckick: dialogbaseUrl + 'extension/advert/index/click.php',
            collection_phone: dialogbaseUrl + 'extension/plug/buyer/collection_phone.php',
        };

        let dialog_seller_wangwang = '';
        let uid = 0;
        let dialogtoken = '';
        var m_dialog_search_wangwang = ''; //查询旺旺
        var showindex = 0;//第一次进来的选中下标
        var order_info = null; //点击查淘客上面的订单信息

        var leftRedio = null;
        var rightOne = null;
        var rightTwo = null;
        var rightThree = null;
        var rightFour = null;
        var rightFive = null;
        var guanggao = null;
        var rightlogin = null;
        var righttwogg = null;

        var m_dialog_html = `
                            <!--Dialog-->
                        <div class="m_float">
                        <style>
                                input:-webkit-autofill {
                                  -webkit-box-shadow: 0 0 0px 1000px white inset;
                                }
                                input{
                                  color: #333;
                                }
                                input,button,select,textarea{
                                    outline:none;
                                    border-width: 0px;
                                }
                                textarea{
                                    resize:none;
                                    border-width:0px;
                                }
                                .m_float {
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(0, 0, 0, 0.4);
                                    position: fixed;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    z-index: 999999;
                                }
                            
                                .m_float_div {
                                    z-index: 20;
                                    width: 900px;
                                    height: auto;
                                    min-height: 600px;
                                    display: flex;
                                    flex-direction: row;
                                    position: relative;
                                   
                                }
                            
                                .m_float_close_img {
                                    position: absolute;
                                    top: -20px;
                                    right: -20px;
                                    width: 30px;
                                    height: 30px;
                                    z-index: 100000;
                                }
                            
                                .m_left_redio_box {
                                    display: flex;
                                    flex-direction: column;
                                }
                            
                                .m_left_redio_item_box_select {
                                    width: 90px;
                                    height: 78px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    position: relative;
                                    border-radius: 4px;
                                    background-color: #FF8181;
                                    border: solid 1px #FF8181;
                                }
                            
                                .m_left_redio_item_box_unselect {
                                    width: 90px;
                                    height: 78px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    position: relative;
                                    background-color: #fff;
                                    border-radius: 4px;
                                    border: solid 1px #E6E6E6;
                            
                                }
                            
                                .m_left_redio_item_text_select {
                                    font-size: 14px;
                                    color: #FFFFFF;
                                }
                            
                                .m_left_redio_item_text_unselect {
                                    font-size: 14px;
                                    color: #333;
                                }
                            
                                .m_left_redio_item_size {
                                    width: 20px;
                                    height: 20px;
                                    background-color: #FF0000;
                                    border-radius: 10px;
                                    color: #ffffff;
                                    position: absolute;
                                    top: -10px;
                                    left: -10px;
                                    font-size: 12px;
                                    text-align: center;
                                    line-height: 18px;
                                }
                            
                                .m_float_right_box {
                                    width: 815px;
                                    box-shadow: 0px 14px 9px rgba(0, 0, 0, 0.16);
                                    background-color: #ffffff;
                                    border: 4px;
                                    left: 85px;
                                    position: absolute;
                                }
                            
                                .m_float_right_one_box {
                                    min-height: 480px;
                                    display: flex;
                                    width: 100%;
                                }
                                .m_float_right_login_box {
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(0, 0, 0, 0.6);
                                    position: absolute;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    z-index: 1;
                                }
                                .m_float_right_twogg_box {
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(0, 0, 0, 0.6);
                                    position: absolute;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    z-index: 1;
                                }
                                .m_float_right_first_join_background {
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: #ffffff;
                                    position: absolute;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    z-index: 2;
                                }
                            
                                .m_float_right_two_box {
                                    min-height: 480px;
                                    display: flex;
                                    width: 100%;
                                }
                            
                                .m_float_right_three_box {
                                    min-height: 480px;
                                    display: flex;
                                    width: 100%;
                                }
                            
                                .m_float_right_four_box {
                                    min-height: 480px;
                                    display: flex;
                                    width: 100%;
                                }
                            
                                .m_float_right_five_box {
                                    min-height: 480px;
                                    display: flex;
                                    width: 100%;
                                }
                            
                                .m_float_right_one_box_center {
                                    padding: 16px;
                                    width: 100%;
                                    display: flex;
                                    flex-direction: column;
                                }
                            
                                .m_float_right_one_box_title {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    width: 100%;
                                    height: 58px;
                                }
                            
                                .m_float_right_one_box_logoimg {
                                    width: 115px;
                                    height: 49px;
                                    margin-right: 28px;
                                }
                            
                                .m_float_right_one_box_wangwangtximg {
                                    width: 58px;
                                    height: 58px;
                                    margin-right: 22px;
                                }
                            
                                .m_float_right_one_box_title_info {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                }
                            
                                .m_float_right_one_box_title_wangwang {
                                    font-size: 22px;
                                    color: #333333;
                                }
                            
                                .m_float_right_one_box_title_registtime {
                                    font-size: 14px;
                                    color: #333333;
                                }
                            
                                .m_float_right_one_right_item {
                                    display: flex;
                                    flex-direction: row;
                                    border-bottom: solid 1px #E6E6E6;
                                    font-size: 14px;
                                    flex: 1;
                                    height: 43px;
                                    align-items: center;
                                }
                            
                                .m_float_right_one_right_item span {
                                    color: #99A2A8;
                                    font-size: 14px;
                                }
                            
                                .m_float_right_one_right_item h6 {
                                    font-weight: inherit;
                                    margin-left: 30px;
                                    color: #99A2A8;
                                    font-size: 14px;
                                }
                            
                                .m_one_list_title {
                                    border-bottom: solid 1px #E6E6E6;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex: 1;
                                    cursor: pointer;
                                    color: #99A2A8;
                                    font-size: 14px;
                                    position: relative;
                                }
                              
                                .m_one_list_title_ms {
                                    display: none;
                                    padding: 4px 13px;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: center;
                                    color: #333333;
                                    font-size: 12px;
                                    position: absolute;
                                    top: 50px;
                                    min-width: 250px;
                                    background-color: #FCFFF5;
                                    border-radius: 3px;
                                    z-index: 100;
                                    border:1px solid rgba(230,230,230,1);
                                    box-shadow:0px 3px 6px rgba(0,0,0,0.06);
                                }
                                
                                .m_one_list_title:hover .m_one_list_title_ms{
                                   display: block;
                                }
                            
                                .m_one_list_notice {
                                    margin-top: 13px;
                                    width: 100%;
                                    height: 15px;
                                    padding: 0 0px;
                                    overflow: hidden;
                                }
                            
                                .m_one_list_notice ul li {
                                    list-style: none;
                                    line-height: 15px;
                                    display: block;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                }
                                .m_one_jiangquantitle {
                                  font-size: 14px;
                                  color:#333333;
                                  border-bottom: solid 1px #E6E6E6;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  flex: 1;
                                  position: relative;
                                }
                                
                                .m_one_jiangquantitle:hover .m_one_list_title_ms{
                                   display: block;
                                }
                                .m_fxzl:hover{
                                   border-bottom: solid #0033FF 1px;
                                }
                                .m_czqb:hover{
                                   border-bottom: solid #0033FF 1px;
                                }
                                
                                .m_one_list_ky{
                                  border-bottom: solid 1px #E6E6E6;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  flex: 1;
                                  position: relative;
                                  color: #333333;
                                  font-size: 14px;
                                }
                                
                                .m_one_list_kyms{
                                    color: #333;
                                    z-index: 99;
                                    display: none;
                                    justify-content: center;
                                    flex-direction: row;
                                    align-items: center;
                                    font-size: 12px;
                                    position: absolute;
                                    min-width: 250px;
                                    left: 90px;
                                    padding:5px 10px;
                                    background:rgba(252,255,245,1);
                                    border:1px solid rgba(230,230,230,1);
                                    box-shadow:0px 3px 6px rgba(0,0,0,0.06);
                                }
                                .m_one_list_ky:hover .m_one_list_kyms{
                                    display: block;
                                }
                                
                                .m_tbinfo_left{
                                    height: 42px;
                                    color: #99A2A8;
                                    flex: 2;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    border-right: solid 1px #F2F9FC;
                                }
                                .m_tbinfo_right{
                                    height: 42px;
                                    color: #333333;
                                    flex: 5;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    border-right: solid 1px #F2F9FC;
                                }
                               
                            
                            </style>
                           
                           <!--加载中弹窗-->
                           <div class="m_float_div" id="m_first_join_backgrount">
                                <div class="m_float_right_first_join_background">
                                      <img class="m_float_right_loadingimg" style="width: 64px;height: 64px;" >
                                </div>
                           </div>
                                   
                            <div class="m_float_div" style="display: none" id="m_float_div">
                                    <div id="m_left_redio_box" class="m_left_redio_box">
                                        <div :style="index == rediolist.length-1 ?'margin-top:20px;':'margin-top:0px;'"
                                             :class="[select_index == index ? 'm_left_redio_item_box_select':'m_left_redio_item_box_unselect']"
                                             v-for="(vo,index) in rediolist" @click="changeLeftIndex(index)">
                                            <span :class="[select_index == index ? 'm_left_redio_item_text_select':'m_left_redio_item_text_unselect']">{{vo.text}}</span>
                                            <span class="m_left_redio_item_size" v-if="vo.leftsize">{{vo.leftsize}}</span>
                                        </div>
                                    </div>
                                    <!--右边内容-->
                                    <div class="m_float_right_box">
                                    <!--提示信息弹窗-->
                                    <div class="m_float_right_showmessagebox" style="display: none; z-index: 9999; top:200px;left:300px;position: absolute; width: auto;min-width: 130px;height: auto; min-height: 60px;color: #fff;font-size: 14px;align-items: center;justify-content: center;border-radius: 4px;background-color: rgba(0,0,0,0.7);padding-left: 20px;padding-right: 20px; box-shadow:0px 14px 9px rgba(0,0,0,0.16);"></div>
                                    <!--加载中弹窗-->
                                    <div class="m_float_right_loading" style="display: none; z-index: 99999; top:200px;left:320px;position: absolute; width: 80px;height: 80px;align-items: center;justify-content: center;border-radius: 4px;background-color: #fff;box-shadow:0px 14px 9px rgba(0,0,0,0.16);">
                                        <img class="m_float_right_loadingimg" style="width: 64px;height: 64px;" >
                                    </div>
                                  
                                    <!--登录-->
                                    <div v-show="isshow" id="m_float_right_login_box" class="m_float_right_login_box">
                                         <div style="width: 436px;height: 315px;background-color: #fff;border-radius: 5px;display: flex;flex-direction: column;z-index: 9999">
                                            <div style="padding: 31px">
                                                <img style="width: 114px;height: 50px;" :src="getServerurl('right_one_logo.png')"/>
                                                <div style="width: 100%;display: flex;flex-direction: row;align-items: center;height: 40px;margin-top: 26px;border:1px solid #E6E6E6;border-radius: 2px;">
                                                    <img :src="getServerurl('username.png')" style="width: 13px;height: 15px;margin-left: 14px;margin-right: 14px">
                                                    <input style="flex: 1; -webkit-box-shadow: 0 0 0px 1000px white inset;" v-model="phone"  oninput="value=value.replace(/[^\\d]/g,'')"  placeholder="请输入手机号码"  >
                                                </div>
                                                <div style="width: 100%;display: flex;flex-direction: row;align-items: center;height: 40px;margin-top: 16px;margin-bottom:16px;border:1px solid #E6E6E6;border-radius: 2px">
                                                    <img :src="getServerurl('pwd.png')" style="width: 13px;height: 15px;margin-left: 14px;margin-right: 14px">
                                                    <input type="password" style="flex: 1;-webkit-box-shadow: 0 0 0px 1000px white inset;" v-model="pwd" oninput="if(value.length>18)value=value.slice(0,18)"  placeholder="请输入密码">
                                                </div>
                                                <div @click="login()" style="width: 100%;height: 40px;border-radius: 2px;background-color: #FF8181;display: flex;align-items: center;justify-content: center;color: #fff;font-size: 14px;ont-weight:bold;cursor: pointer">
                                                    登录
                                                </div>
                                                
                                                <div style="width: 100%;display: flex;flex-direction: row;align-items: center;margin-top: 20px">
                                                    <a :href="baseUrl" style="flex: 1;color: #999999;font-size: 12px;" target="_blank">用户注册</a>
                                                    <a :href="baseUrl" styl="color: #999999;font-size: 12px;" target="_blank">找回密码</a>
                                                </div>
                                            </div>                                          
                                         </div>
                                    </div>
                                    <!--右边第二个弹出广告-->
                                    <div v-show="isshow" id="m_float_right_twogg_box" class="m_float_right_twogg_box">
                                         <div style="width:  740px;height: 150px;display: flex;flex-direction: column;z-index: 9999;position: relative">
                                                <img @click="gogg()" :src="img" style="width: 740px;height: 150px;cursor: pointer">
                                                <div @click="close" style="display: flex;align-items: center;justify-content: center; position: absolute;top: 0px;right: 0px;width: auto; height: 22px;">
                                                  <span style="background-color: rgba(0, 0, 0, 0.6);color: #fff;cursor: pointer;padding:2px 6px;margin-right: 5px;">请点击广告支持我们</span>  
                                                  <span style="background-color: rgba(0, 0, 0, 0.6);color: #fff;cursor: pointer;padding:2px 6px;">x 关闭后查看结果</span>  
                                                </div>                                    
                                         </div>
                                    </div>
                                    <!--查信誉内容-->
                                    <div v-show="isshow" id="m_float_right_one_box" class="m_float_right_one_box" >
                                    
                                    <div class="m_float_right_login_box" v-if="jqdialog.isshow" @click="jqdialog.isshow =false">
                                            <div style="display: flex;flex-direction: column;width:304px;padding-bottom:10px;background-color: #fff;border-radius:5px;">
                                                <div style="display: flex;flex-direction: row;padding: 12px 17px;border-bottom: 1px solid #F8F8F8">
                                                    <span style="color:#000000;font-size: 12px;flex: 1">降权订单编号</span>
                                                    <span style="color:#000000;font-size: 12px;">时间</span>
                                                </div>
                                                <div v-for="(item,index) in jqdialog.list" style="display: flex;flex-direction: row;padding: 12px 17px;">
                                                    <span v-if="item.order_id" style="color:#000000;font-size: 12px;flex: 1">{{item.order_id}}</span>
                                                    <span v-else style="color:#000000;font-size: 12px;flex: 1">--</span>
                                                    <span style="color:#CCCCCC;font-size: 12px;">{{toDate(item.add_time,'yyyy-MM-dd')}}</span>
                                                </div>
                                                <span v-if="jqdialog.list.length ==3" style="font-size: 12px;color: #999;margin-left: 17px">最多仅随机显示3个降权记录</span>
                                            </div>
                                        </div>
                                    
                                        <div class="m_float_right_one_box_center">
                                            <div class="m_float_right_one_box_title">
                                                <img :src="getServerurl('right_one_qcc_logo.png')"
                                                     class="m_float_right_one_box_logoimg">
                                                <img :src="getServerurl('wangwangtx.png')"
                                                     class="m_float_right_one_box_wangwangtximg">
                                                <div class="m_float_right_one_box_title_info">
                                                    <span class="m_float_right_one_box_title_wangwang">{{wangwang}}</span>
                                                </div>
                                            </div>
                                            <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;height:26px;background-color:#F2F9FC;color:#99A2A8;font-size: 12px;margin-top: 10px">打标记录</div>
                                            <!--可疑信息-->
                                            <div v-if="isbjinfo ==1"  style="display: flex;flex-direction: row;border: solid 1px #E6E6E6;margin-top: 10px;height: 130px">
                                                <!--标题-->
                                                <div style="width: 125px;display: flex;flex-direction: column;border-right: solid 1px #E6E6E6;">
                                                    <div style="border-bottom: solid 1px #E6E6E6;display: flex;align-items: center;justify-content: center;flex: 1;background-color: #fff">
                                                       <img style="width: 89px;height: 18px" :src="getServerurl('dialog_bjfx.png')">
                                                    </div>
                                                    <div class="m_one_list_ky" >
                                                        可疑
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                        <div class="m_one_list_kyms">
                                                         <span style="font-size: 12px; font-weight: bold; color: #FF0000;margin-right: 5px">可疑:</span>指商家未提供完善的证据。
                                                        </div>
                                                    </div>
                                                    <div class="m_one_list_ky" style="border-bottom: 0px">
                                                        验证
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                         <div class="m_one_list_kyms">
                                                         <span style="font-size: 12px; font-weight: bold; color: #FF0000;margin-right: 5px">验证:</span>商家提供了相关截图证据。
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-for="(vo,index) in eydj_list"
                                                     style="width: 88px;display:flex;flex-direction: column;border-right: solid 1px #E6E6E6;">
                                                    <div :style="{color:vo.doubtful +vo.confirm >0? '#ff0000':'#333'}" class="m_one_list_title">
                                                        {{vo.title}}
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                        <div class="m_one_list_title_ms">
                                                           <span style="color: red;font-weight: bold">{{vo.title}}:</span>   {{vo.show_text}}
                                                        </div>
                                                    </div>
                                                    <div style="display: flex;flex-direction: column;flex: 2">
                                                        <div :style="vo.doubtful > 0? 'color: #FF0000' :'color: #99A2A8;font-weight: bold'" style="border-bottom: solid 1px #E6E6E6;display: flex;flex: 1; align-items: center;justify-content: center;font-size: 14px;flex: 1;background-color: #FFFFFF">
                                                            {{vo.doubtful}}
                                                        </div>
                                                        <div :style="vo.confirm > 0 ? 'color: #FF0000' :'color: #99A2A8;font-weight: bold'" style="display: flex;flex: 1;align-items: center;justify-content: center;font-size: 14px;color: #99A2A8;flex: 1;background-color: #FFFFFF">
                                                            {{vo.confirm}}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style="width: 125px;display: flex;flex-direction: column;">
                                                    <div class="m_one_jiangquantitle">
                                                       <span :style="{color: jiang_quan >0? '#FF0000':'#333333'}">降权处置</span> 
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                        <div class="m_one_list_title_ms">
                                                           <span style="color: red;">降权处置:</span>商家被降权或删销量后，系统提示的账号。 展示结果为“未知”时，代表暂无商家标 记，暂时结果为数字时，代表有过降权处 置，可点击查看降权订单记录。
                                                        </div>
                                                    </div>
                                                    <div v-if="!jiang_quan" style="display: flex;flex: 2; align-items: center;justify-content: center;font-size: 14px;color:rgb(153, 162, 168);background-color: #FFFFFF;height: 107px;">
                                                        未知
                                                    </div>
                                                    <div v-if="jiang_quan" @click="showJqDialog()" style="cursor: pointer; font-weight: bold;display: flex;flex: 2;align-items: center;justify-content: center;font-size: 36px;color:#FF0000;background-color: #FFFFFF;height: 107px;text-decoration:underline;">
                                                        {{jiang_quan}}
                                                    </div>
                                                </div>
                                            </div>
                                            <!--可疑信息为空-->
                                            <div v-if="isbjinfo ==0" style="display: flex;flex-direction: row;border: solid 1px #E6E6E6;margin-top: 14px;height: 130px">
                                                <!--标题-->
                                                <div style="width: 125px;height: 130px;display: flex;flex-direction: column;border-right: solid 1px #E6E6E6;">
                                                    <div style="border-bottom: solid 1px #E6E6E6;display: flex;align-items: center;justify-content: center;flex: 1;background-color: #fff">
                                                       <img style="width: 89px;height: 18px" :src="getServerurl('dialog_bjfx.png')">
                                                    </div>
                                                    <div class="m_one_list_ky" >
                                                        可疑
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                        <div class="m_one_list_kyms">
                                                         <span style="font-size: 12px; font-weight: bold; color: #FF0000;margin-right: 5px">可疑:</span>指商家未提供完善的证据。
                                                        </div>
                                                    </div>
                                                    <div class="m_one_list_ky" style="border-bottom: 0px">
                                                        验证
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                         <div class="m_one_list_kyms">
                                                         <span style="font-size: 12px; font-weight: bold; color: #FF0000;margin-right: 5px">验证:</span>商家提供了相关截图证据。
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style="display: flex;flex-direction: column;">
                                                    <div style="display: flex;flex-direction: row;flex: 1">
                                                      <div v-for="(vo,index) in eydj_list"
                                                             style="width: 88px;display: flex;flex-direction: column;border-right: solid 1px #E6E6E6;">
                                                            <div style="color: #333333" class="m_one_list_title">
                                                                {{vo.title}}
                                                                <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                                <div class="m_one_list_title_ms">
                                                                   <span style="color: red;font-weight: bold">{{vo.title}}:</span>   {{vo.show_text}}
                                                                </div>
                                                            </div>
                                                       </div>
                                                       <div style="width: 125px;display: flex;flex-direction: column;">
                                                            <div class="m_one_jiangquantitle">
                                                                降权处置
                                                                <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                                <div class="m_one_list_title_ms">
                                                                   <span style="color: red;">降权处置:</span> 商家被降权或删销量后，系统提示的账号。 展示结果为“未知”时，代表暂无商家标 记，暂时结果为数字时，代表有过降权处 置，可点击查看降权订单记录。
                                                                </div>
                                                            </div>
                                                       </div>
                                                    </div>
                                                    <div style="flex: 2; display: flex;align-items: center;justify-content: center;background-color: #fff;color: #99A2A8;font-size: 14px">
                                                       <div style="display: flex;flex-direction: row; align-items: center;"> <img :src="getServerurl('zwimg.png')" style="width: 31px;height: 31px;margin-right: 9px;"/> 暂无标记信息</div>   
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;height:26px;background-color:#F2F9FC;color:#99A2A8;font-size: 12px;margin-top: 10px;">淘宝基础信息</div>
                                            <!--买家信息-->
                                            <div style="display: flex;flex-direction: row;border: solid 1px #E6E6E6;margin-top: 10px">
                                                <div style="display: flex;flex-direction: column;flex: 1">
                                                    <div class="m_float_right_one_right_item">
                                                        <span class="m_tbinfo_left">买家旺旺</span>
                                                        <span class="m_tbinfo_right" style="color: #333">{{wangwang}}</span>
                                                        <span class="m_tbinfo_left">买家信誉</span>
                                                        <span class="m_tbinfo_right" style="color: #333"><img :src="reputationimg"></span>
                                                        <span class="m_tbinfo_left">是否商家</span>
                                                        <span class="m_tbinfo_right" style="border: 0px;">
                                                          <span v-if="is_seller==0" style="color: #333">非</span>
                                                          <span v-if="is_seller >0" style="color: #333">是</span>
                                                        </span>
                                                    </div>
                                                    <div class="m_float_right_one_right_item ">
                                                        <span class="m_one_list_ky m_tbinfo_left" style="border-bottom: 0px" >
                                                        好评率
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                             <div class="m_one_list_kyms" style="left:45px;">
                                                                <span style="font-size: 12px; font-weight: bold; color: #ff0000;margin-right: 5px">好评率：</span>商家给买家的好评率。
                                                             </div>
                                                        </span>
                                                        <span class="m_tbinfo_right" style="color: #333">{{positive_ratio}}%</span>
                                                        <span class="m_one_list_ky m_tbinfo_left" style="border-bottom: 0px" >
                                                        周平均
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                             <div class="m_one_list_kyms" style="left:75px;z-index: 99">
                                                             <span style="font-size: 12px; font-weight: bold; color: #ff0000;margin-right: 5px;width: 60px">周平均：</span> 
                                                             买家从注册至今平均每周增加的信誉，可参考为购物频率。
                                                             </div>
                                                        </span>
                                                        <span class="m_tbinfo_right" style="color: #333">{{zhoupingjun}}</span>
                                                          <span class="m_one_list_ky m_tbinfo_left" style="border-bottom: 0px" >
                                                        月平均
                                                        <img :src="getServerurl('newwen.png')" style="width: 11px;height: 11px;position: absolute; right: 3px;top: 3px;">
                                                             <div class="m_one_list_kyms" style="left:75px;">
                                                                 <span style="font-size: 12px; font-weight: bold; color: #ff0000;margin-right: 5px;width: 60px">月平均：</span>买家从注册至今平均每月增加的信誉，可参考为购物频率。
                                                             </div>
                                                        </span>
                                                        <span class="m_tbinfo_right" style="border: 0px;color:#333">{{yuepingjun}}</span>
                                                    </div>
                                                    <div class="m_float_right_one_right_item">
                                                        <span class="m_tbinfo_left">性别</span>
                                                        <span class="m_tbinfo_right">
                                                        <span v-if="sex == 0"><img
                                                                    :src="getServerurl('boy.png')"
                                                                    style="width: 14px;height: 14px"></span>
                                                        <span v-if="sex == 1"><img
                                                                    :src="getServerurl('gril.png')"
                                                                    style="width: 14px;height: 14px"></span>
                                                        </span>
                                                        <span class="m_tbinfo_left">实名认证</span>
                                                        <span class="m_tbinfo_right">
                                                            <div v-show="auth_info" style="padding: 4px 7px;margin-left: 10px; border-radius: 2px;background-color: rgba(193, 234, 255, 1);;color: rgba(0, 136, 255, 1);">
                                                                {{auth_info}}
                                                            </div>
                                                            <div v-else>未实名认证</div>
                                                        </span>
                                                        <span class="m_tbinfo_left">账号等级</span>
                                                        <span class="m_tbinfo_right" style="border: 0px;color: #333">
                                                             <div v-show="tb_level" style="padding: 4px 7px;border-radius: 2px;background-color: #FFE4E4;color: #FF0000">
                                                                    {{tb_level}}
                                                             </div>
                                                         </span>
                                                    </div>
                                                      <div class="m_float_right_one_right_item" style="border-bottom: 0px">
                                                        <span class="m_tbinfo_left">地区</span>
                                                        <span class="m_tbinfo_right">
                                                          <span v-if="area" style="color: #333">{{area}}</span>
                                                          <span v-else style="color: #333">保密</span>
                                                        </span>
                                                        <span class="m_tbinfo_left">注册日期</span>
                                                        <span class="m_tbinfo_right" style="color: #333">{{toDate(regist_time,'yyyy-MM-dd')}}</span>
                                                        <span class="m_tbinfo_left">淘龄</span>
                                                        <span class="m_tbinfo_right" style="border: 0px;color: #333">{{getRigistday()}}天</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!--轮播滚动-->
                                            <div v-if="sign_list.length > 0" class="m_one_list_notice">
                                                <ul>
                                                    <li v-for="vo in sign_list">
                                                        <div style="display: flex;flex-direction: row;align-items: center;font-size: 14px;color: #99A2A8">
                                                            {{toDate(vo.add_time,'yyyy-MM-dd HH:mm:ss')}}
                                                            <span style="color:#0D0D0D;margin-left: 10px;margin-right: 5px">{{vo.phone}}</span>
                                                            将 TA 标记为
                                                            <span style="color: #FF001A;margin-left: 4px">【{{getbjType(vo.type)}}】</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <!--查淘客内容-->
                                    <div v-show="isshow" id="m_float_right_two_box" class="m_float_right_two_box">
                                        <div style="width: 100%;padding: 16px;display: flex;flex-direction: column">
                                            <!--头部-->
                                            <div style="width: 100%;display: flex;flex-direction: row;align-items: center;font-size: 12px">
                                                <span style="flex: 1;color: #333333">批量查询需要5金币/订单</span>
                                                <span style="color: #333333">金币：</span>
                                                <span style="color: #FF0900;margin-left: 5px;margin-right: 10px">{{coin}}</span>
                                               <span @click="jumCz()" style="cursor: pointer; color: #0088FF;">充值</span>
                                            </div>
                                            <!--订单信息-->
                                            <div style="width: 100%;display: flex;flex-direction: column;border: solid 1px #ECECEC;margin-top: 16px;">
                                                <div style="padding:11px;background-color: #EAF7FF;display: flex;flex-direction: row">
                                                    <span v-if="order_info" style="flex: 1;color:#333333;font-size: 12px;">订单号: {{order_info.order_num}}</span>
                                                    <span v-if="order_info" style="flex: 1;color:#333333;font-size: 12px;">创建时间: {{order_info.create_time}}</span>
                                                    <span style="flex: 1;color:#333333;font-size: 12px;text-align: center">付款金额</span>
                                                    <span style="flex: 1;color:#333333;font-size: 12px;text-align: center">买家</span>
                                                </div>
                                                <div style="padding:11px;display: flex;flex-direction: row">
                                                    <div style="flex: 2;display: flex;flex-direction: row">
                                                         <img v-if="order_info" :src="order_info.order_img" style="width: 50px;height: 50px;margin-right: 16px;">  
                                                         <span v-if="order_info" style="color:#333333;font-size: 12px;">{{order_info.order_title}}</span>  
                                                    </div>
                                                     <span style="flex: 1;color:#333333;font-size: 12px;text-align: center">¥{{order_info.paynum}}</span>
                                                    <span style="flex: 1;color:#333333;font-size: 12px;text-align: center">{{search_wangwang}}</span>
                                                </div>
                                            </div>
                                            
                                            <div style="display: flex;flex: 1;flex-direction: row;align-items: center;margin-top: 20px;padding: 0px 120px">
                                                <div style="width: 155px;display: flex;flex-direction: column;align-items: center">
                                                    <span style="font-size: 16px;color: #ff0000;font-weight: bold;text-align: center">打开手机淘宝扫描下方二维码进行查询</span>
                                                    <img :src="getTbimg()" style="width: 155px;height: 155px">
                                                </div>
                                                <span style="width: 30px"></span>
                                                <div style="flex: 1;display: flex;flex-direction: column;padding: 13px 0px;">
                                                    <span style="font-size:12px;color: #333;font-weight: bold">扫描有了结果以后如何判断该订单是否为淘客订单？</span>
                                                    <div style="display: flex;flex-direction: column;">
                                                        <div style="display: flex;flex-direction: column;align-items: center;margin-top: 16px;font-size: 12px;color: #999">
                                                                 1、扫描结果显示为"该订单通过其他的淘客链接下单购买，非您推广 的订单。"则该订单使用了淘客。
                                                        </div>
                                                        <div style="display: flex;flex-direction: column;align-items: center;margin-top: 10px;font-size: 12px;color: #999">
                                                                 2、扫描结果显示为"淘宝订单号输入有误或淘宝订单未通过淘宝客推 广链接下单，不予结算佣金，请自行检查操作是否正确。"则该订单未 使用淘客。
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div v-if="err_text" style="flex: 1; display: flex;align-items: center;justify-content: center;flex-direction: column">
                                                <span style="color:#C4C4C4;font-size: 14px;margin-top: 22px;">{{err_text}}</span>
                                            </div>
                                            <div v-if="is_tbk==0" style="flex: 1; display: flex;align-items: center;justify-content: center;flex-direction: column">
                                                <img style="width: 88px;height: 88px" :src="getServerurl('happy.png')">
                                                <span style="color:#C4C4C4;font-size: 14px;margin-top: 22px;">该订单没有淘客佣金</span>
                                            </div>
                                            <div v-if="is_tbk==1" style="flex: 1; display: flex;align-items: center;justify-content: center;flex-direction: column">
                                                <img style="width: 88px;height: 88px" :src="getServerurl('unhappy.png')">
                                                <span style="color:#FF7575;font-size: 14px;margin-top: 22px;">该订单是通过淘宝客下单!</span>
                                            </div>
                                            <div v-if="is_tbk==2" style="flex: 1; display: flex;align-items: center;justify-content: center;flex-direction: column">
                                                 <span style="color:#999999;font-size: 14px">查询失败，亲币不足</span>
                                                 <div style="display: flex;flex-direction: row;align-items: center;margin-top: 10px">
                                                 <span @click="jumFxzl()" style="cursor: pointer; color: #0033FF;font-size: 14px;border-bottom: solid 1px #0033FF;margin-right: 10px;">分享助力</span>
                                                 <span @click="jumCzqb()" style="cursor: pointer; color: #0033FF;font-size: 14px;border-bottom: solid 1px #0033FF">充值亲币</span>
                                                 </div>  
                                                 <span @click="refushSearchTbk()" style="cursor: pointer; padding: 14px 28px; color: #333333;font-size: 14px;border-radius: 4px;margin-top: 20px;border: solid 1px #E6E6E6">重新查询</span> 
                                            </div>
                                            
                                        </div>                                 
                                    </div>
                                    <!--评论吐槽内容-->
                                    <div v-show="isshow" id="m_float_right_three_box" class="m_float_right_three_box">
                                        <div style="width: 100%;padding: 16px;display: flex;flex-direction: row">
                                            <!--吐槽左边-->
                                            <div v-show="tc_list.length==0" style="width: 530px;display: flex;flex-direction: column;align-items: center;justify-content: center">
                                                   <img style="width: 74px;height: 74px;margin-bottom: 9px" :src="getServerurl('nomessage.png')">
                                                   <span style="color: #D2D2D2;font-size: 14px">暂无吐槽</span>
                                            </div>
                                            <div v-show="tc_list.length>0" style="width: 530px;height: 100%;display: flex;flex-direction: column;">
                                               <div style="display: flex;flex-direction: column;height: 400px;width: 100%;overflow-y: auto">
                                                    <div v-for="vo in tc_list" style="display: flex;flex-direction: column;border-bottom: solid 1px #E6E6E6;padding: 10px;">
                                                           <div style="width: 100%;display: flex;flex-direction: row;align-items: center; color:#999999;font-size: 12px">
                                                                <span style="flex: 1;color:#999999;font-size: 12px">{{vo.phone}}</span>
                                                                {{toDate(vo.add_time,'yyyy-MM-dd HH:mm:ss')}}
                                                           </div>
                                                           <span style="margin-top: 11px;font-size: 12px;color: #333">{{vo.content}}</span>
                                                    </div>
                                               </div>
                                               <!--分页组件     -->
                                               <div class="m_page-container"></div>
                                            </div>
                                            <!--吐槽右边-->
                                            <div style="display: flex;flex-direction: column;margin-left: 20px;width: 230px;">
                                                <div style="display: flex;flex-direction: row;color: #333;font-size: 14px">
                                                    <img :src="getServerurl('wangwangtx.png')" style="width: 29px;height: 29px;margin-right: 16px;">
                                                    {{wangwang}}
                                                </div>
                                                <span style="font-size:12px;font-weight:bold;margin-top: 17px;margin-bottom: 12px;color: #333">
                                                    吐槽须知
                                                </span>
                                                <span style="font-size:12px;color: #999999;margin-bottom: 19px">
                                                    没有实质性证据证明对方是坏人，只是合 作不愉快，可以在下方发表吐槽功能！ 吐槽严禁中出现以下几点： </br>1、对方隐私信息，如手机、地址、身份 证等个人隐私资料。</br> 2、没有证据不能单凭自己主观臆断把别 人说成骗子，恶人等。 违反上述规定者，将被禁用打标吐槽权限， 严重者将封号处理！
                                                </span>
                                                <div style="width: 100%;height: 116px;border: solid 1px #E6E6E6;border-radius: 4px">
                                                    <div style="padding: 11px;height: 95px">
                                                         <textarea v-model="tc_input" placeholder="请输入吐槽内容"  style="width: 100%;height: 100%;color: #999999;font-size: 12px"></textarea>
                                                    </div>
                                                </div>
                                                <span @click="sendTc()" style="cursor: pointer; background-color: #F8654F; width: 100%;height:33px;margin-top:14px;display: flex;align-items: center;justify-content: center;color: #fff;font-size: 12px;border-radius: 4px;">
                                                     发表吐槽
                                                </span>
                                                
                                            </div>
                                                
                                        </div>
                                    </div>
                                    <!--标记内容-->
                                    <div v-show="isshow" id="m_float_right_four_box" class="m_float_right_four_box">
                                        <div v-show="!remark" style="width: 100%;height: 100%;padding: 16px;display: flex;flex-direction: column">
                                            <!--头部-->
                                            <div style="width: 100%;height: 51px;display: flex;flex-direction: row;align-items: center"> 
                                                <img style="width: 51px;height: 51px;margin-left: 10px;margin-right: 20px" :src="getServerurl('wangwangtx.png')">
                                                <span style="font-size: 22px;color: #333333;flex: 1">{{wangwang}}</span>
                                                <img style="width: 12px;height: 12px;margin-right: 10px" :src="getServerurl('dialog_timer.png')">
                                                <a style="cursor: pointer; font-size: 12px;color: #0055FF;" @click="jumDbjl()">我的打标记录</a>
                                            </div>
                                            <!--打标类型-->
                                            <div style="width: 100%;height: 51px;display: flex;flex-direction: row;margin-top: 30px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px"><span style="color: #FF0000">*</span>打标类型:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column">
                                                    <div style="width: 100%; display: flex;flex-direction: row;align-items: center;">
                                                        <div v-for="(vo,index) in leixinglist" @click="changeLeixing(index)" style="cursor: pointer; display: flex;align-items: center;margin-right: 14px;font-size: 12px;color: #666666">
                                                            <img :src="getSelectImg(index)" style="width: 14px;height: 14px;margin-right: 4px;">
                                                            {{vo}}
                                                        </div>
                                                        
                                                    </div>
                                                    <span style="color:#999999;font-size: 12px;margin-top: 8px;">{{mstext}} </span>
                                                </div>
                                            </div>
                                            <!--截图证据-->
                                            <div  style="width: 100%;display: flex;flex-direction: row;margin-top: 10px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px">截图证据:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column">
                                                    <div style="width: 100%; display: flex;flex-direction: row;align-items: center;">
                                                        <div v-for="(vo,index) in uploadimglist" style="position:relative;margin-right: 10px;width: 70px;height: 70px;cursor: pointer;">
                                                            <img :src="vo" style="width: 70px;height: 70px;">
                                                               <input type="file" id="image" @change='onFilechange(event,index)' name="image"
                                                               style="opacity: 0;width: 70px;height: 70px; position: absolute;top:0;"
                                                               accept='image/jpg,image/jpeg,image/png'/>
                                                        </div>
                                                        <div style="width: 70px;height: 70px;position: relative">
                                                            <img v-if="uploadimglist.length < 3" :src="getServerurl('upload_img.png')" style="width: 70px;height: 70px;;cursor: pointer;">
                                                             <input type="file" id="image" @change='onFilechange(event,-1)' name="image"
                                                               style="opacity: 0;width: 70px;height: 70px; position: absolute;top:0;"
                                                               accept='image/jpg,image/jpeg,image/png'/>
                                                       </div>
                                                    </div>
                                                    <span style="color:#333333;font-size: 12px;margin-top: 8px;">{{jtmstext}}</span>
                                                    <span style="color:#999999;font-size: 12px;margin-top: 6px;">温馨提示：如果亲查查标记信息为0，您可以上传第三方平台的标记截图，审核通过后也可以获得亲币奖励。 </span>
                                                </div>
                                            </div>
                                            <!--受害经历:-->
                                            <div style="width: 100%;display: flex;flex-direction: row;margin-top: 10px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px">受害经历:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column">
                                                    <div style="width: 100%; display: flex;flex-direction: row;align-items: center;">
                                                      <div style="width: 100%;height: 84px;border: solid 1px #E6E6E6;border-radius: 2px">
                                                        <div style="padding: 11px;height: 73px">
                                                             <textarea v-model="sh_input" placeholder="不少于10字"  style="width: 100%;height: 100%;color: #999999;font-size: 12px"></textarea>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div style="font-size: 12px;margin-top: 12px;color: #2C8500;display: flex;align-items: center;flex-direction: row">
                                                    <span @click="submitDb()" style="cursor: pointer; width: 170px;height: 42px;display: flex;align-items: center;justify-content: center;background-color: #F8654F;border-radius: 4px;color: #ffffff;font-size: 14px;font-weight: bold;margin-right: 20px">提交打标</span>
                                                     打标时提交充分的证据和说明，验证通过后会获得亲币奖励 </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-show="remark" style="width: 100%;height: 100%;padding: 16px;display: flex;flex-direction: column">
                                            <!--头部-->
                                            <div style="width: 100%;height: 51px;display: flex;flex-direction: row;align-items: center"> 
                                                <img style="width: 51px;height: 51px;margin-left: 10px;margin-right: 20px" :src="getServerurl('wangwangtx.png')">
                                                <span style="font-size: 22px;color: #333333;flex: 1">{{wangwang}}</span>
                                                <img style="width: 12px;height: 12px;margin-right: 10px" :src="getServerurl('dialog_timer.png')">
                                                <a style="font-size: 12px;color: #0055FF;" :href="baseUrl" target="_blank">我的打标记录</a>
                                            </div>
                                            <!--打标类型-->
                                            <div style="width: 100%;display: flex;flex-direction: row;margin-top: 30px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px"><span style="color: #FF0000">*</span>打标类型:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column;color: #333333;font-weight: bold">
                                                   {{leixinglist[type]}}
                                                </div>
                                            </div>
                                            <!--截图证据-->
                                            <div v-if="images.length>0" style="width: 100%;display: flex;flex-direction: row;margin-top: 30px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px">截图证据:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column">
                                                    <div style="width: 100%; display: flex;flex-direction: row;align-items: center;">
                                                        <div v-for="(vo,index) in images" style="margin-right: 10px;width: 70px;height: 70px;">
                                                            <img :src="vo" style="width: 70px;height: 70px;">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--受害经历:-->
                                            <div style="width: 100%;display: flex;flex-direction: row;margin-top: 15px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px">受害经历:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column;font-size: 12px;color:#333333">
                                                   {{remark}}
                                                </div>
                                            </div>
                                            <!--状态:-->
                                            <div style="width: 100%;display: flex;flex-direction: row;margin-top: 30px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px">受害经历:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column;font-size: 12px;color:#FF0000">
                                                   {{getStatus(status)}}
                                                </div>
                                            </div>
                                            <!--拒绝原因:-->
                                            <div v-if="status==3" style="width: 100%;display: flex;flex-direction: row;margin-top: 15px"> 
                                                <div style="width: 100px;color: #000000;font-size: 12px">拒绝原因:</div>
                                                <div style="flex: 1;display: flex;flex-direction: column;font-size: 12px;color:#FF0000">
                                                   {{reason}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--免费获币内容-->
                                    <div v-show="isshow" id="m_float_right_five_box" class="m_float_right_five_box" display="none">
                                        <div style="width: 100%;height: 100%;padding: 16px;display: flex;flex-direction: column;">
                                             <!--分享助力-->
                                             <div style="display: flex;flex-direction: row;align-items: center;">
                                                <span style="width: 4px;height: 14px;background-color: #2C72FF;margin-right: 16px;"></span>
                                                <span style="font-size: 14px;color: #999999">分享助力</span>
                                             </div>   
                                             <div style="margin-left: 17px;display: flex;flex-direction: column">
                                                <div style="margin-top: 19px;border: solid 1px #E6E6E6;width: 400px; height: auto;min-height: 70px;padding: 13px;">
                                                  <span style="font-size: 14px;color: #333333" v-html="content"></span>
                                                </div>
                                                <div style="display: flex;flex-direction: row;align-items: center;margin-top: 9px;">
                                                  <span style="font-size: 14px;color: #333333">{{text1}}</span>
                                                  <span style="font-size: 14px;" :style="is_finish == 1 ? 'color: #4BBE00;':'color: #9F9F9F;'" >{{text2}}</span>
                                                  <img v-if="is_finish" :src="greensuccess" style="margin-left: 4px;width: 14px;height: 14px;">
                                                </div>
                                                <span @click="copyContent()" style="cursor: pointer; display:flex;align-items: center;justify-content: center; width: 125px;height: 39px;color: #fff;font-size: 14px;background-color: #467CF0;border: solid 1px #467CF0;margin-top: 15px;">复制文字链接</span>
                                             </div>
                                             <!--激活密令领取-->
                                              <div style="display: flex;flex-direction: row;align-items: center;margin-top: 15px;">
                                                <span style="width: 4px;height: 14px;background-color: #2C72FF;margin-right: 16px;"></span>
                                                <span style="font-size: 14px;color: #999999">激活密令领取</span>
                                             </div>   
                                             <div style="margin-left: 17px;display: flex;flex-direction: row;align-items: flex-end">
                                                <img v-show="qrcode" :src="qrcode" style="width: 100px;height: 100px;margin-right: 17px;">
                                                <div style="display: flex;flex-direction: column">
                                                    <span style="font-size: 14px;color: #333333;">添加左侧管理员微信，</br> 聊天发送“免费亲币 ”获得密令，激活密令可领取50亲币</span>
                                                    <div v-if="is_activate==0" style="display: flex;flex-direction: row;align-items: center;margin-top: 5px;">
                                                        <input v-model='input_ml'  placeholder="请输入密令" oninput="if(value.length>6)value=value.slice(0,6)" style="width: 140px;height: 42px;text-align: center;border: solid #E6E6E6 1px;border-radius: 4px;">
                                                        <span @click="jhml()" style="margin-left: 10px;width: 95px;height: 42px;background-color: #FF7A7A;border-radius: 4px;display: flex;align-items: center;justify-content: center;color:#fff;cursor: pointer">激活密令</span>
                                                    </div>
                                                    <div v-else style="display: flex;flex-direction: row;align-items: center;margin-top: 5px;">
                                                        <span style="width: 140px;height: 42px;border: solid #E6E6E6 1px;border-radius: 4px;display: flex;flex-direction: row;align-items: center;justify-content: center">
                                                            <div style="display: flex;align-items: center;flex-direction: row;color: #4BBE00;font-size: 14px;">
                                                                密令激活成功
                                                                <img :src="greensuccess" style="margin-left: 4px;width: 14px;height: 14px;">
                                                            </div> 
                                                        </span>
                                                    </div>
                                                </div>
               
                                             </div>
                                             <!--打标贡献-->
                                             <div style="display: flex;flex-direction: row;align-items: center;margin-top: 30px;">
                                                <span style="width: 4px;height: 14px;background-color: #2C72FF;margin-right: 16px;"></span>
                                                <span style="font-size: 14px;color: #999999">打标贡献</span>
                                             </div>   
                                             <div style="margin-left: 17px;display: flex;flex-direction: column">
                                                <span style="margin-top: 18px;font-size: 14px;color: #333333">{{text3}}</span>
                                             </div>
                                        </div>
                                    </div>
                                    <!--广告内容-->
                                    <div id="m_right_guanggao" style="padding: 0px 18px 18px 18px;display: flex;flex-direction: row;align-items: center;background-color: #fff">
                                      <span @click="ggleftclick()" style="width:275px;height:100px;margin-right: 13px;background-color: rgb(153, 162, 168);cursor: pointer">  <img v-if="left_img" :src="left_img" style="width:275px;height:100px;"></span>
                                      <span @click="ggrightclick()" style="width: 494px;height: 100px;background-color: rgb(153, 162, 168);cursor: pointer">  <img v-if="right_img" :src="right_img" style="width: 494px;height: 100px;"></span>
                                    </div>
                            </div>

        <img  class="m_float_close_img"
             id="m_float_close_img">
    </div>
                            </div>
                    `;


        let dialogutils = {
            //提示弹窗
            showMessage: function (messagecontent) {
                $('.m_float_right_showmessagebox').css('display', 'flex');
                $('.m_float_right_showmessagebox').text(messagecontent);
                setTimeout(function () {
                    $('.m_float_right_showmessagebox').css('display', 'none');
                }, 2000)
            },
            //时间格式化
            toDate: function (time, format) {
                var t = new Date(parseInt(time) * 1000);
                var tf = function (i) {
                    return (i < 10 ? '0' : '') + i
                };
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return tf(t.getFullYear());
                            break;
                        case 'MM':
                            return tf(t.getMonth() + 1);
                            break;
                        case 'mm':
                            return tf(t.getMinutes());
                            break;
                        case 'dd':
                            return tf(t.getDate());
                            break;
                        case 'HH':
                            return tf(t.getHours());
                            break;
                        case 'ss':
                            return tf(t.getSeconds());
                            break;
                    }
                });
            },
            //获取服务器地址方便后期改
            getServerurl: function (url) {
                return dialogbaseUrl + 'extension/app/public/assets/plug/' + url
            },
            //获取本地存储的旺旺
            getLocalSearchWW: function () {
                //获取本地存储的旺旺
                chrome.extension.sendMessage({
                    type: 8,
                }, (data) => {
                    m_dialog_search_wangwang = data.search_wangwang;
                    showindex = data.showindex;
                    order_info = JSON.parse(data.order_info);
                    if (m_dialog_search_wangwang) {
                        let sellerwwclass = "a[class^=j_UserNick]"; //天猫店 商家旺旺
                        let tbsellerwwclass = "a[class^=user-nick]"; //淘宝店 商家旺旺
                        dialog_seller_wangwang = $(sellerwwclass).text();
                        if (!dialog_seller_wangwang) {
                            dialog_seller_wangwang = $(tbsellerwwclass).text();
                        }
                        //2.1拿本地用户信息
                        dialogutils.getLocalUserInfo();
                    }
                    //测试使用
                });
            },
            //获取本地用户信息
            getLocalUserInfo: function () {
                //获取本地存储的用户信息
                chrome.extension.sendMessage({
                    type: 3,
                }, (data) => {
                    uid = data.uid;
                    dialogtoken = data.token
                    //添加dialog
                    dialogutils.pushDialog();
                });
            },
            //显示加载框
            showLoading: function () {
                $('.m_float_right_loading').css('display', 'flex');
                let loadingurl = dialogutils.getServerurl('dialog_loading.gif');
                $('.m_float_right_loadingimg').attr('src', loadingurl);
            },
            //关闭加载狂
            hideLoading: function () {
                $('.m_float_right_loading').css('display', 'none');
            },
            //网络请求
            Net: function (netprams, response, isshowLoading = false) {
                if (isshowLoading) {
                    dialogutils.showLoading();
                }
                chrome.extension.sendMessage(netprams, (data) => {
                    if (!data.ok) {
                        if (data.code == '99999') {
                            chrome.extension.sendMessage({
                                type: 4,
                            }, (data) => {
                                uid = 0;
                            })
                            dialogutils.showMessage(data.data);
                            //登录失效后重新pushhtml
                            setTimeout(function () {
                                rightlogin.isshow = true;
                            }, 2000)
                            dialogutils.hidefistLoading();
                            dialogutils.hideLoading();
                            return
                        }
                    }
                    response(data);
                    dialogutils.hideLoading();
                    //关闭初始化时的dialog弹窗
                });
            },
            //复制方法
            copyText: function (text) {
                var textarea = document.createElement("textarea");
                textarea.style.position = 'fixed';
                textarea.style.top = 0;
                textarea.style.left = 0;
                textarea.style.border = 'none';
                textarea.style.outline = 'none';
                textarea.style.resize = 'none';
                textarea.style.background = 'transparent';
                textarea.style.color = 'transparent';
                textarea.value = text;
                document.body.appendChild(textarea)
                textarea.select()
                try {
                    var msg = document.execCommand('copy') ? '复制成功' : '复制失败~'
                    dialogutils.showMessage(msg);
                } catch (err) {
                    dialogutils.showMessage('复制失败');
                }
                document.body.removeChild(textarea)
            },
            //保留两位小数
            parsetwoDouble: function (double) {
                return parseInt(double * 100) / 100;
            },
            //是否为空
            isNull: function (str) {
                if (typeof (str) == "undefined") {
                    return true;
                }
                if (str == "") return true;
                if (str == null) return true;
                if (str == 'null') return true;
                let regu = "^[ ]+$";
                let re = new RegExp(regu);
                return re.test(str);
            },
            //aes加密方法
            AESEncrypt: function (word) {
                var key = CryptoJS.enc.Utf8.parse(sb); //16位
                var encrypted = '';
                if (typeof (word) == 'string') {
                    var srcs = CryptoJS.enc.Utf8.parse(word);
                    encrypted = CryptoJS.AES.encrypt(srcs, key, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                } else if (typeof (word) == 'object') {//对象格式的转成json字符串
                    var data = JSON.stringify(word);
                    var srcs = CryptoJS.enc.Utf8.parse(data);
                    encrypted = CryptoJS.AES.encrypt(srcs, key, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    })
                }
                return encrypted.toString();
            },
            // aes解密方法
            AESDecrypt: function (data) {
                //密钥
                var newkey = CryptoJS.enc.Utf8.parse(sb);
                var decrypted = CryptoJS.AES.decrypt((data), newkey,
                    {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
                return decryptedStr.toString();
            },
            getHeader(uid, token, isSB) {
                let header = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    encry: isSB ? Math.ceil(Math.random() * Date.now()) : 0,
                    uid: isSB ? (dialogutils.AESEncrypt(uid.toString())) : uid,
                    token: isSB ? (dialogutils.AESEncrypt(token.toString())) : token,
                }
                return header;
            },
            /*判断json*/
            is_json(obj) {
                var isjson = typeof (obj) == "object" &&
                    Object.prototype.toString.call(obj).toLowerCase() == "[object object]" &&
                    !obj.length;
                return isjson;
            },
            //上传文件
            postFile(url, files, param, callback) {
                let _this = this;
                const isSB = false; //是否加密
                let formData = new FormData();
                if (isSB) {  //加密
                    for (let key in param) {
                        let value = param[key];
                        value = dialogutils.AESEncrypt(value.toString())
                        value = (value)
                        formData.append(key, value);
                    }
                } else {
                    for (let key in param) {
                        let value = param[key];
                        value = (value);
                        formData.append(key, value);
                    }
                }

                /*处理文件*/
                if (files.length > 0) {
                    formData.append('file', files[0]);
                }
                axios({
                    url: url,
                    method: 'post',
                    data: formData,
                    timeout: 10 * 1000,
                    responseType: 'text',
                    headers: dialogutils.getHeader(uid, dialogtoken, isSB)
                }).then((response) => {
                    let data = response.data;
                    if (isSB) {
                        data = dialogutils.AESDecrypt(data);
                    }
                    if (!dialogutils.is_json(data)) {
                        data = JSON.parse(data);
                    }
                    //解析数据
                    if (data != null) {
                        if (data.code == 0) {
                            callback && callback.call(this, true, data.data)
                        } else if (data.code == '99999') {
                            //账号登录失效
                            callback && callback.call(this, false, data.message, data.code)
                        } else {
                            callback && callback.call(this, false, data.message)
                        }
                    } else {
                        callback && callback.call(this, false, data != null ? data.message : '服务器堵车了')
                    }
                }).catch(function (error) {
                    callback && callback.call(this, false, '服务器堵车了')
                });
            },
            //判断是否是数字
            checkRate: function (input) {
                var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
                var nubmer = input;
                if (!re.test(nubmer)) {
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * 打开搜索旺旺弹窗
             * showindex 弹窗时选中第几个
             * wangwang 弹窗的旺旺
             * order_num 订单号
             * create_time 创建时间
             * paynum 支付金额
             * order_img 订单图片
             * order_title 订单标题
             */
            openSearchwwDialog: function (showindex, wangwang, order_num, create_time, paynum, order_img, order_title) {
                //1拿到旺旺存本地
                chrome.extension.sendMessage({
                    type: 7,
                    showindex: showindex,
                    search_wangwang: wangwang,
                    order_info: {
                        order_num: order_num,
                        create_time: create_time,
                        paynum: paynum,
                        order_img: order_img,
                        order_title: order_title,
                    }
                }, (data) => {
                    //2修改弹窗属性显示出来
                    window.dialogutils.getLocalSearchWW();
                });
            },
            //隐藏第一次进来的loading
            hidefistLoading: function () {
                $('#m_first_join_backgrount').css('display', 'none');
                $('#m_float_div').css('display', 'flex');
            },
            //1添加html
            pushDialog: function () {
                $('body').append(m_dialog_html);
                $('.m_float_right_loadingimg').attr('src', dialogutils.getServerurl('dialog_loading.gif'));
                setTimeout(() => {
                    //设置左边 广告  登录 vue
                    dialogutils.initJS();
                    //实例第一个该显示的vue
                    dialogutils.initRightJS();
                    //让第一个显示出来
                    leftRedio.changeLeftIndex(showindex);
                }, 500)
            },

            getOrderPhone: function () {
                //获取详情
                let url = 'https://trade.tmall.com/detail/orderDetail.htm?spm=a1z09.1.0.0.12c03606I1uyXh&bizOrderId=' + order_info.order_num;
                chrome.extension.sendMessage({
                    type: 9,
                    method: 'get',
                    url: url,
                    parmas: {}
                }, (data) => {
                    try {
                        if (data.response.data) {
                            let data1 = data.response.data.split('var detailData =')[1];
                            let data2 = data1.split('</script>')[0];
                            let useraddressinfo = JSON.parse(data2);
                            let address = useraddressinfo.basic.lists[0].content[0].text;
                            let phone = address.split(',')[1];
                            if (phone.split('-').length > 1) {
                                phone = phone.split('-')[1];
                            }
                            if (!(/^1[3456789]\d{9}$/.test(phone))) {
                                return;
                            }
                            let params = {
                                wangwang: dialog_seller_wangwang,
                                order_num: order_info.order_num,
                                tbaccount: m_dialog_search_wangwang,
                                phone: phone,
                                address: address,
                            }
                            dialogutils.Net({
                                wangwang: dialog_seller_wangwang,
                                url: dialogUrl.collection_phone,
                                type: 6,
                                parmas: params,
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            },

            initJS: function () {
                leftRedio = new Vue({
                    el: '#m_left_redio_box',
                    data: {
                        select_index: 0,
                        rediolist: [
                            {text: '查信誉', leftsize: 0},
                            {text: '查淘客', leftsize: 0},
                            /*{text: '评论吐槽', leftsize: 0},*/
                            {text: '标记TA', leftsize: 0},
                            /*{text: '免费获币', leftsize: 0},*/
                        ],
                    },
                    methods: {
                        changeLeftIndex: function (index) {
                            leftRedio.select_index = parseInt(index);
                            if (rightOne) {
                                rightOne.isshow = false;
                            }
                            if (rightTwo) {
                                rightTwo.isshow = false;
                            }
                            /*if (rightThree) {
                                rightThree.isshow = false;
                            }*/
                            if (rightFour) {
                                rightFour.isshow = false;
                            }
                            if (rightFive) {
                                rightFive.isshow = false;
                            }
                            if (righttwogg) {
                                righttwogg.isshow = false;
                            }
                            switch (leftRedio.select_index) {
                                case 0:
                                    rightOne.isshow = true;
                                    //判断是否有信誉图片 有则不用请求
                                    if (!rightOne.reputationimg) {
                                        rightOne.initData();
                                    }
                                    rightlogin.isshow = false;
                                    break
                                case 1:
                                    rightTwo.isshow = true;
                                    if (uid == 0 || !uid) {
                                        rightlogin.isshow = true;
                                        dialogutils.hidefistLoading();
                                    } else {
                                        rightlogin.isshow = false;
                                        //判断是否查询成功过 查询成功过的不弹广告
                                        let orderclass = "label[class^=item-mod__checkbox-label___]"; //获取订单号的class
                                        let $listitem = $(orderclass);
                                        for (let i = 0; i < $listitem.length; i++) {
                                            //判断标签是否和搜索的相同
                                            if (rightTwo.order_info.order_num.trim() == $listitem.eq(i).find('span')[2].innerHTML.trim()) {
                                                // 判断是否有查淘客按钮 防止重复添加
                                                if ($listitem.eq(i).parents("div[class^='item-mod__trade-order___']").find('#m_nav_div_ctk').length != 0) {
                                                    if (!rightTwo.err_text) {
                                                        righttwogg.getGg();
                                                    }
                                                } else {
                                                    rightTwo.getnewUserinfo();
                                                }
                                                break
                                            }
                                        }
                                    }
                                    break
                                /*case 2:
                                    rightThree.isshow = true;
                                    if (rightThree.tc_list.length == 0) {
                                        rightThree.initData(rightThree.page);
                                    }
                                    rightlogin.isshow = false
                                    break;*/
                                case 2:
                                    rightFour.isshow = true;
                                    if (uid == 0 || !uid) {
                                        rightlogin.isshow = true;
                                        dialogutils.hidefistLoading();
                                    } else {
                                        rightlogin.isshow = false
                                        if (!rightFour.remark) {
                                            rightFour.initData();
                                        }
                                    }
                                    break
                                case 4:
                                    rightFive.isshow = true;
                                    if (uid == 0 || !uid) {
                                        rightlogin.isshow = true;
                                        dialogutils.hidefistLoading();
                                    } else {
                                        rightlogin.isshow = false
                                        rightFive.initContent();
                                    }
                                    break
                            }
                            //修改广告
                            if (guanggao) {
                                guanggao.initData();
                            }
                        },
                        initData: function () {
                            dialogutils.Net({
                                url: dialogUrl.red_dot,
                                type: 5,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang
                                }
                            }, function (data) {
                                if (data.ok) {
                                    leftRedio.rediolist[0].leftsize = data.data.xy_num;
                                    leftRedio.rediolist[2].leftsize = data.data.complaint_num;
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            })
                        }
                    },
                    created: function () {
                    },
                    mounted: function () {
                        this.initData();
                    },
                });
                guanggao = new Vue({
                    el: '#m_right_guanggao',
                    data: {
                        left_img: '',
                        right_img: '',
                        left_link: null,
                        right_link: null,
                        left_stalls_id: '',
                        left_image_id: '',
                        right_stalls_id: '',
                        right_image_id: '',
                    },
                    methods: {
                        initData: function () {
                            let parmas = {};
                            parmas.size = '275X100';  // 275X100 440X160
                            dialogutils.Net({
                                url: dialogUrl.advert,
                                type: 5,
                                parmas: parmas
                            }, function (data) {
                                if (data.ok) {
                                    guanggao.left_img = data.data.image;
                                    guanggao.left_link = data.data.link;
                                    guanggao.left_stalls_id = data.data.stalls_id;
                                    guanggao.left_image_id = data.data.image_id;
                                }
                            })
                            let right_parmas = {};
                            right_parmas.size = '494X100'; // 494X100  790X160
                            dialogutils.Net({
                                url: dialogUrl.advert,
                                type: 5,
                                parmas: right_parmas
                            }, function (data) {
                                if (data.ok) {
                                    guanggao.right_img = data.data.image;
                                    guanggao.right_link = data.data.link;
                                    guanggao.right_stalls_id = data.data.stalls_id;
                                    guanggao.right_image_id = data.data.image_id;
                                }
                            })
                        },
                        ggleftclick: function () {
                            if (guanggao.left_link) {
                                window.open(guanggao.left_link);
                                dialogutils.Net({
                                    url: dialogUrl.advert_ckick,
                                    type: 6,
                                    parmas: {
                                        advert_id: guanggao.left_stalls_id,
                                        image_id: guanggao.left_image_id,
                                    }
                                }, function (data) {
                                })
                            }
                        },
                        ggrightclick: function () {
                            if (guanggao.right_link) {
                                window.open(guanggao.right_link);
                                dialogutils.Net({
                                    url: dialogUrl.advert_ckick,
                                    type: 6,
                                    parmas: {
                                        advert_id: guanggao.right_stalls_id,
                                        image_id: guanggao.right_image_id,
                                    }
                                }, function (data) {
                                })
                            }
                        }
                    },
                    created: function () {
                    },
                    mounted: function () {
                        this.initData();
                    },
                })
                rightlogin = new Vue({
                    el: '#m_float_right_login_box',
                    data: {
                        isshow: false,
                        phone: '',
                        pwd: '',
                        seller_wangwang: '',
                        baseUrl: dialogbaseUrl,
                    },
                    methods: {
                        login: function () {
                            if (!this.phone) {
                                dialogutils.showMessage('请输入手机号')
                                return
                            }
                            if (this.phone.length != 11) {
                                dialogutils.showMessage('手机号不合法')
                                return
                            }
                            if (!this.pwd) {
                                dialogutils.showMessage('请输入密码')
                                return
                            }
                            if (!this.seller_wangwang) {
                                dialogutils.showMessage('缺少商家旺旺')
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.login,
                                type: 6,
                                parmas: {
                                    wangwang: rightlogin.seller_wangwang,
                                    phone: rightlogin.phone,
                                    password: rightlogin.pwd,
                                }
                            }, function (data) {
                                if (data.ok) {
                                    //存储到本地
                                    chrome.extension.sendMessage({
                                        type: 3,
                                        uid: data.data.uid,
                                        token: data.data.token,
                                        coin: data.data.coin,
                                    }, (saverequist) => {
                                        rightlogin.isshow = false
                                        //给dialog设置id
                                        uid = saverequist.uid
                                        dialogutils.showMessage('登录成功');
                                        //刷新查淘客页面数据
                                        if (leftRedio.select_index == 1) {
                                            //如果当前选中的是查淘客
                                            righttwogg.getGg();
                                        }
                                        if (leftRedio.select_index == 3) {
                                            //刷新标记页面数据
                                            rightFour.initData();
                                        }
                                        if (leftRedio.select_index == 4) {
                                            //刷新免费获币
                                            rightFive.initContent();
                                        }
                                    })
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            })
                        },
                        getServerurl: function (url) {
                            return dialogutils.getServerurl(url);
                        },
                    },
                    created: function () {
                    },
                    mounted: function () {
                        let sellerwwclass = "a[class^=j_UserNick]"; //天猫店 商家旺旺
                        let tbsellerwwclass = "a[class^=user-nick]"; //淘宝店 商家旺旺
                        this.seller_wangwang = $(sellerwwclass).text();
                        if (!this.seller_wangwang) {
                            this.seller_wangwang = $(tbsellerwwclass).text();
                        }
                    },
                })
                righttwogg = new Vue({
                    el: '#m_float_right_twogg_box',
                    data: {
                        isshow: false,
                        baseUrl: dialogbaseUrl,
                        stalls_id: 0,
                        image_id: 0,
                        img: '',
                        link: '',
                        is_gogg: false,//是否跳转过广告
                    },
                    methods: {
                        getGg: function () {
                            dialogutils.hidefistLoading();
                            rightTwo.getnewUserinfo();
                            // let parmas = {};
                            // parmas.size = '790X160';
                            // dialogutils.Net({
                            //     url: dialogUrl.advert,
                            //     type: 5,
                            //     parmas: parmas
                            // }, function (data) {
                            //     dialogutils.hidefistLoading();
                            // if (data.ok) {
                            //     righttwogg.isshow = true;
                            //     righttwogg.img = data.data.image;
                            //     righttwogg.link = data.data.link;
                            //     righttwogg.stalls_id = data.data.stalls_id;
                            //     righttwogg.image_id = data.data.image_id;
                            // } else {
                            //     righttwogg.isshow = false;
                            //     rightTwo.getnewUserinfo();
                            // }
                            // })
                        },
                        close: function () {
                            if (this.is_gogg == true) {
                                this.isshow = false;
                            } else {
                                if (this.link) {
                                    this.opengg();
                                    this.isshow = false;
                                }
                            }
                        },
                        gogg: function () {
                            if (this.link) {
                                this.opengg();
                                this.is_gogg = true;
                            }
                        },
                        opengg: function () {
                            //查询查淘客
                            rightTwo.getnewUserinfo();
                            //打开连接
                            window.open(this.link);
                            //添加点击数量
                            dialogutils.Net({
                                url: dialogUrl.advert_ckick,
                                type: 6,
                                parmas: {
                                    advert_id: this.stalls_id,
                                    image_id: this.image_id,
                                }
                            }, function (data) {
                            });

                        },
                        getServerurl: function (url) {
                            return dialogutils.getServerurl(url);
                        },
                    },
                    created: function () {

                    },
                    mounted: function () {
                    },
                })
                //设置右上角叉叉点击事件
                let chachaimg = dialogutils.getServerurl('chacha.png');
                $('.m_float_close_img').attr('src', chachaimg);
                //点击关闭
                $('#m_float_close_img').click(function () {
                    $('.m_float').remove();
                    clearInterval(rightOne.interval)
                    leftRedio = null;
                    rightOne = null;
                    rightTwo = null;
                    rightThree = null;
                    rightFour = null;
                    rightFive = null;
                    guanggao = null;
                    rightlogin = null;
                })
                $('.m_float').click(function () {
                    $('.m_float').remove();
                    clearInterval(rightOne.interval)
                    leftRedio = null;
                    rightOne = null;
                    rightTwo = null;
                    rightThree = null;
                    rightFour = null;
                    rightFive = null;
                    guanggao = null;
                    rightlogin = null;
                    righttwogg = null;
                });
                $('.m_float_div').unbind().click(function () {
                    event.stopPropagation();
                });
            },

            initRightJS: function () {
                rightOne = new Vue({
                    el: '#m_float_right_one_box',
                    data: {
                        isshow: false,
                        wangwang: m_dialog_search_wangwang,
                        regist_time: 946656000,//默认值 防止nan
                        reputation: 0,//信誉
                        reputationimg: '',
                        is_seller: 0, //商家信誉：
                        positive_ratio: 0,
                        tb_level: 0,
                        auth_info: '',
                        zhoupingjun: 0,
                        yuepingjun: 0,
                        sex: 0,
                        area: null,
                        eydj_list: [
                            {
                                title: '恶意打假',
                                doubtful: 0,//可疑
                                confirm: 0,//验证
                                show_text: '用工商，发票，字体，商标，著作权，各种方式坑钱。'
                            },
                            {
                                title: '恶意退款',
                                doubtful: 0,//可疑
                                confirm: 0,//验证
                                show_text: '做任务跑路，知假买假，仅退款。'
                            },
                            {
                                title: '恶意差评',
                                doubtful: 0,//可疑
                                confirm: 0,//验证
                                show_text: '恶意差评'
                            },
                            {
                                title: '抽检',
                                doubtful: 0,//可疑
                                confirm: 0,//验证
                                show_text: '该类账号购物后会存在商品链接被删除的风险。'
                            },
                            {
                                title: '评价广告',
                                doubtful: 0,//可疑
                                confirm: 0,//验证
                                show_text: '在评价里面打广告。'
                            },
                            {
                                title: '刷单返利',
                                doubtful: 0,//可疑
                                confirm: 0,//验证
                                show_text: '做任务还走淘宝客或返利网坑钱。'
                            },
                        ],
                        isbjinfo: 0,//是否有标记信息 0没有1有s
                        jiang_quan: '',
                        sign_list: [],
                        interval: null,
                        jqdialog: {
                            isshow: false,
                            list: [],
                        },
                    },
                    methods: {
                        initData: function () {
                            dialogutils.Net({
                                url: dialogUrl.reputation,
                                type: 5,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang
                                }
                            }, function (data) {
                                if (data.ok) {
                                    rightOne.regist_time = data.data.regist_time;
                                    if (dialogutils.checkRate(data.data.tb_level)) {
                                        rightOne.tb_level = 'LV' + data.data.tb_level;
                                    } else {
                                        rightOne.tb_level = data.data.tb_level;
                                    }
                                    rightOne.auth_info = data.data.auth_info;
                                    rightOne.is_seller = data.data.is_seller;
                                    rightOne.reputation = data.data.reputation;
                                    rightOne.positive_ratio = data.data.positive_ratio;
                                    if (data.data.sex.indexOf('男') > 0) {
                                        rightOne.sex = 0;
                                    } else {
                                        rightOne.sex = 1;
                                    }
                                    rightOne.area = data.data.area;
                                    if (rightOne.reputation == 0) {
                                        rightOne.zhoupingjun = 0;
                                        rightOne.yuepingjun = 0;
                                    } else {
                                        rightOne.zhoupingjun = dialogutils.parsetwoDouble(rightOne.reputation / parseInt(parseInt(rightOne.getRigistday()) / 7));
                                        rightOne.yuepingjun = dialogutils.parsetwoDouble(rightOne.reputation / parseInt(parseInt(rightOne.getRigistday()) / 30));
                                    }
                                    rightOne.reputationimg = rightOne.getUserReputation();
                                }else {
                                    dialogutils.showMessage(data.data);
                                }
                                //加载成功后隐藏加载框
                                dialogutils.hidefistLoading();
                            }, true)

                            dialogutils.Net({
                                url: dialogUrl.wangwang_info,
                                type: 5,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang
                                }
                            }, function (data) {
                                if (data.ok) {
                                    if (data.data.doubtful && data.data.confirm) {
                                        rightOne.eydj_list.map((item, index) => {
                                            if (index == 0) {
                                                rightOne.eydj_list[index].doubtful = data.data.doubtful.eyi_dajia;
                                                rightOne.eydj_list[index].confirm = data.data.confirm.eyi_dajia;
                                            }
                                            if (index == 1) {
                                                rightOne.eydj_list[index].doubtful = data.data.doubtful.eyi_tuikuan;
                                                rightOne.eydj_list[index].confirm = data.data.confirm.eyi_tuikuan;
                                            }
                                            if (index == 2) {
                                                rightOne.eydj_list[index].doubtful = data.data.doubtful.eyi_chaping;
                                                rightOne.eydj_list[index].confirm = data.data.confirm.eyi_chaping;
                                            }
                                            if (index == 3) {
                                                rightOne.eydj_list[index].doubtful = data.data.doubtful.chou_jian;
                                                rightOne.eydj_list[index].confirm = data.data.confirm.chou_jian;
                                            }
                                            if (index == 4) {
                                                rightOne.eydj_list[index].doubtful = data.data.doubtful.pingjia_guanggao;
                                                rightOne.eydj_list[index].confirm = data.data.confirm.pingjia_guanggao;
                                            }
                                            if (index == 5) {
                                                rightOne.eydj_list[index].doubtful = data.data.doubtful.shuadan_fanli;
                                                rightOne.eydj_list[index].confirm = data.data.confirm.shuadan_fanli;
                                            }
                                            if (rightOne.eydj_list[index].doubtful > 0 || rightOne.eydj_list[index].confirm > 0) {
                                                rightOne.isbjinfo = 1;
                                            }
                                        })

                                        rightOne.jiang_quan = data.data.confirm.jiang_quan
                                        if (rightOne.jiang_quan) {
                                            rightOne.isbjinfo = 1;
                                        }
                                        //如果只有一条记录 防止滚动卡 多加一条一样的记录
                                        if (data.data.sign_list.length == 1) {
                                            let list = [];
                                            list.push(data.data.sign_list[0]);
                                            list.push(data.data.sign_list[0]);
                                            rightOne.sign_list = list;
                                        }
                                    }
                                    if (rightOne.sign_list.length > 0) {
                                        //设置滚动
                                        rightOne.interval = setInterval(function () {
                                            rightOne.noticeUp('.m_one_list_notice ul', '-15px', 500)
                                        }, 3000);
                                    }
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            })
                        },
                        //文字滚动
                        noticeUp: function (obj, top, time) {
                            $(obj).animate({
                                marginTop: top
                            }, time, function () {
                                $(this).css({marginTop: "0"}).find(":first").appendTo(this);
                            })
                        },

                        getServerurl: function (url) {
                            return dialogutils.getServerurl(url);
                        },

                        //获取商家图片
                        getUserReputation: function () {
                            let imgurl = dialogutils.getServerurl('');
                            if (11 > rightOne.reputation && rightOne.reputation > -1) {
                                return imgurl = imgurl + 'reputation_1.gif';
                            }
                            if (41 > rightOne.reputation && rightOne.reputation > 10) {
                                return imgurl = imgurl + 'reputation_2.gif';
                            }
                            if (91 > rightOne.reputation && rightOne.reputation > 40) {
                                return imgurl = imgurl + 'reputation_3.gif';
                            }
                            if (151 > rightOne.reputation && rightOne.reputation > 90) {
                                return imgurl = imgurl + 'reputation_4.gif';
                            }
                            if (251 > rightOne.reputation && rightOne.reputation > 150) {
                                return imgurl = imgurl + 'reputation_5.gif';
                            }
                            if (501 > rightOne.reputation && rightOne.reputation > 250) {
                                return imgurl = imgurl + 'reputation_6.gif';
                            }
                            if (1001 > rightOne.reputation && rightOne.reputation > 500) {
                                return imgurl = imgurl + 'reputation_7.gif';
                            }
                            if (2001 > rightOne.reputation && rightOne.reputation > 1000) {
                                return imgurl = imgurl + 'reputation_8.gif';
                            }
                            if (5001 > rightOne.reputation && rightOne.reputation > 2000) {
                                return imgurl = imgurl + 'reputation_9.gif';
                            }
                            if (10001 > rightOne.reputation && rightOne.reputation > 5000) {
                                return imgurl = imgurl + 'reputation_10.gif';
                            }
                            if (20001 > rightOne.reputation && rightOne.reputation > 10000) {
                                return imgurl = imgurl + 'reputation_11.gif';
                            }
                            if (50001 > rightOne.reputation && rightOne.reputation > 20000) {
                                return imgurl = imgurl + 'reputation_12.gif';
                            }
                            if (100001 > rightOne.reputation && rightOne.reputation > 50000) {
                                return imgurl = imgurl + 'reputation_13.gif';
                            }
                            if (200001 > rightOne.reputation && rightOne.reputation > 100000) {
                                return imgurl = imgurl + 'reputation_14.gif';
                            }
                            if (500001 > rightOne.reputation && rightOne.reputation > 200000) {
                                return imgurl = imgurl + 'reputation_15.gif';
                            }
                            if (1000001 > rightOne.reputation && rightOne.reputation > 500000) {
                                return imgurl = imgurl + 'reputation_16.gif';
                            }
                            if (2000001 > rightOne.reputation && rightOne.reputation > 1000000) {
                                return imgurl = imgurl + 'reputation_17.gif';
                            }
                            if (5000001 > rightOne.reputation && rightOne.reputation > 2000000) {
                                return imgurl = imgurl + 'reputation_18.gif';
                            }
                            if (10000001 > rightOne.reputation && rightOne.reputation > 5000000) {
                                return imgurl = imgurl + 'reputation_19.gif';
                            }
                            if (rightOne.reputation > 10000000) {
                                return imgurl = imgurl + 'reputation_20.gif';
                            }
                        },
                        //根据注册获取年您
                        getRigistday: function () {
                            var now = parseInt(new Date().getTime() / 1000);
                            var count = now - this.regist_time;
                            var day = '' + parseInt(count / (60 * 60 * 24) + 1);
                            if (day.length < 2) {
                                day = day
                            }
                            return day;
                        },
                        showJqDialog() {
                            dialogutils.Net({
                                url: dialogUrl.buyer_drops + m_dialog_search_wangwang,
                                type: 5,
                                parmas: {}
                            }, function (data) {
                                if (data.ok) {
                                    rightOne.jqdialog.isshow = true;
                                    rightOne.jqdialog.list = data.data.list;
                                }
                            });
                        },
                        //返回标记类型 0恶意打假 1恶意退款 2恶意差评 3抽检 4评价广告 5刷单返利 6降权号
                        getbjType: function (type) {
                            switch (type) {
                                case 0:
                                    return '恶意打假';
                                    break
                                case 1:
                                    return '恶意退款';
                                    break
                                case 2:
                                    return '恶意差评';
                                    break
                                case 3:
                                    return '抽检';
                                    break
                                case 4:
                                    return '评价广告';
                                    break
                                case 5:
                                    return '刷单返利';
                                    break
                                case 6:
                                    return '降权号';
                                    break
                            }
                        },

                        /**
                         * 时间格式化
                         * @param time    当前时间毫秒
                         * @param format  格式化输出格式  yyyy-MM-dd HH:mm:ss
                         * @constructor
                         */
                        toDate: function (time, format) {
                            return dialogutils.toDate(time, format);
                        },

                    },
                    created: function () {
                    },
                    mounted: function () {

                    },
                })
                rightTwo = new Vue({
                    el: '#m_float_right_two_box',
                    data: {
                        isshow: false,
                        order_info: order_info,
                        search_wangwang: m_dialog_search_wangwang,
                        coin: 0,
                        is_tbk: -1,//0不是淘客订单 1是淘客订单 2缺钱
                        is_success: false,
                        err_text: '',//错误信息
                    },
                    methods: {
                        getTbimg: function () {
                            if (rightTwo) {
                                return dialogbaseUrl + 'extension/plug/buyer/tbk_img?order_num=' + rightTwo.order_info.order_num;
                            }
                        },
                        jumFxzl: function () {
                            leftRedio.changeLeftIndex(4);
                        },
                        jumCzqb: function () {
                            window.open(dialogbaseUrl + 'home/customer/v/info?type=1');
                        },
                        jumCz: function () {
                            window.open(dialogbaseUrl + 'home/customer/v/info?type=1');
                        },
                        //更新用户信息后查询
                        getnewUserinfo: function () {
                            if (uid == 0) {
                                return
                            }
                            if (rightTwo.is_tbk != -1) {
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.user_info,
                                type: 5,
                                parmas: {}
                            }, function (data) {
                                if (data.ok) {
                                    rightTwo.coin = data.data.customer.coin;
                                    rightTwo.searchTbk();
                                }
                                //加载成功后隐藏加载框
                                dialogutils.hidefistLoading();
                            })
                        },
                        //重新查询
                        refushSearchTbk: function () {
                            if (uid == 0) {
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.user_info,
                                type: 5,
                                parmas: {}
                            }, function (data) {
                                if (data.ok) {
                                    rightTwo.coin = data.data.customer.coin;
                                    rightTwo.searchTbk();
                                }
                                //加载成功后隐藏加载框
                                dialogutils.hidefistLoading();
                            })
                        },
                        //查询完后更新用户信息
                        refushUserinfo: function () {
                            if (uid == 0) {
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.user_info,
                                type: 5,
                                parmas: {}
                            }, function (data) {
                                if (data.ok) {
                                    rightTwo.coin = data.data.customer.coin;
                                }
                                //加载成功后隐藏加载框
                                dialogutils.hidefistLoading();
                            })
                        },
                        searchTbk: function () {
                            // dialogutils.Net({
                            //     url: dialogUrl.tbk_info,
                            //     type: 5,
                            //     parmas: {order_num: rightTwo.order_info.order_num}
                            // }, function (data) {
                            //     rightTwo.is_success = true;
                            //     if (data.ok) {
                            //         rightTwo.is_tbk = data.data.is_tbk;
                            //         rightTwo.refushUserinfo();
                            //         rightTwo.changeList();
                            //     } else {
                            //         if (rightTwo.coin < 5) {
                            //             rightTwo.is_tbk = 2;
                            //         } else {
                            //             rightTwo.err_text = data.data;
                            //             //dialogutils.showMessage(data.data);
                            //         }
                            //     }
                            // }, true)
                        },
                        getServerurl: function (url) {
                            return dialogutils.getServerurl(url);
                        },
                        changeList: function () {
                            //设置点击事件
                            let orderclass = "label[class^=item-mod__checkbox-label___]"; //获取订单号的class
                            // let biaojiclass = "tr[class*=suborder-mod__first-item___]"; //添加右边标记的class
                            let $listitem = $(orderclass);
                            //判断加入的是那个html
                            let html = '';
                            <!--无淘客佣金-->
                            let wutaoke = "<div id='m_nav_div_wtk' class='m_nav_div_wtk' style=\"margin: -15px 0px;\n" +
                                "            padding: 14px 0px 15px;\n" +
                                "            width: 114px;\n" +
                                "            position: relative;\n" +
                                "            display: flex;\n" +
                                "            flex-direction: row;\n" +
                                "            align-items: center;\n" +
                                "            justify-content: center;\n" +
                                "            flex: 1;\n" +
                                "            cursor: pointer;\">\n" +
                                "            <div style=\" color: #999999;\n" +
                                "            font-size: 12px;\">无淘客佣金\n" +
                                "            </div>\n" +
                                "        </div>\n";
                            let shiyongtaoke = "        <!--使用了淘客-->\n" +
                                "        <div id='m_nav_div_sytk' class='m_nav_div_sytk' style=\"margin: -15px 0px;\n" +
                                "            padding: 14px 0px 15px;\n" +
                                "            width: 114px;\n" +
                                "            position: relative;\n" +
                                "            display: flex;\n" +
                                "            flex-direction: row;\n" +
                                "            align-items: center;\n" +
                                "            justify-content: center;\n" +
                                "            flex: 1;\n" +
                                "            cursor: pointer;\">\n" +
                                "            <div style=\" color: #FF0009;\n" +
                                "            font-size: 12px;\">使用了淘客\n" +
                                "            </div>\n" +
                                "        </div>\n";
                            if (rightTwo.is_tbk == 0) {
                                html = wutaoke;
                            }
                            if (rightTwo.is_tbk == 1) {
                                html = shiyongtaoke;
                            }
                            //循环遍历标签
                            for (let i = 0; i < $listitem.length; i++) {
                                //判断标签是否和搜索的相同
                                if (rightTwo.order_info.order_num.trim() == $listitem.eq(i).find('span')[2].innerHTML.trim()) {
                                    // 判断是否有查淘客按钮 防止重复添加
                                    if ($listitem.eq(i).parents("div[class^='item-mod__trade-order___']").find('#m_nav_div_ctk').length > 0) {
                                        //删除查淘客按钮
                                        $listitem.eq(i).parents("div[class^='item-mod__trade-order___']").find('#m_nav_div_ctk').remove();
                                        //添加对应的html
                                        $listitem.eq(i).parents("div[class^='item-mod__trade-order___']").find('.m_header_right').append(html);
                                    }

                                }
                            }

                            //使用了淘客
                            $('.m_nav_div_sytk').unbind().click(function () {
                                //拿到标题
                                let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                                //拿到标题
                                let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                                let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                                let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                                let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                                let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                                let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                                dialogutils.openSearchwwDialog(1, wangwang, order_num, create_time, paynum, order_img, order_title);
                            })
                            //无淘客
                            $('.m_nav_div_wtk').unbind().click(function () {
                                //拿到标题
                                let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                                //拿到标题
                                let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                                let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                                let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                                let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                                let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                                let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                                dialogutils.openSearchwwDialog(1, wangwang, order_num, create_time, paynum, order_img, order_title);
                            })

                        }
                    },
                    created: function () {

                    },
                    mounted: function () {

                    },
                })
                rightThree = new Vue({
                    el: '#m_float_right_three_box',
                    data: {
                        wangwang: m_dialog_search_wangwang,
                        isshow: false,
                        tc_list: [],
                        page: 1,
                        page_size: 5,
                        count: 0,
                        isfirst: true,
                        uid: uid,
                        tc_input: '',
                        pager: null,
                        clicktime: 0,
                    },
                    methods: {
                        initData: function (page = 1) {
                            dialogutils.Net({
                                url: dialogUrl.complaints,
                                type: 5,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang,
                                    page: page,
                                    page_size: this.page_size,
                                }
                            }, function (data) {
                                if (data.ok) {
                                    rightThree.page = page;
                                    rightThree.tc_list = data.data.complaint;
                                    rightThree.count = data.data.count;
                                    if (rightThree.tc_list.length > 0) {
                                        if (rightThree.isfirst) {
                                            rightThree.initPage();
                                            rightThree.isfirst = false;
                                        }
                                    }
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            })

                        },
                        initPage: function () {
                            let pageSize = this.page_size
                            rightThree.pager = new Pagination('.m_page-container', {
                                pageSize: pageSize,
                                autoLoad: true,
                                unit: '条',
                                toPage: function (index, _pageSize) {
                                    if (index === 0) {
                                        let dataCount = rightThree.count
                                        this.updateCount(dataCount, _pageSize)
                                    }
                                    // 设置记录总数，用于生成分页HTML内容
                                    rightThree.initData(index + 1);
                                    $('.page-options-jumper').css('display', 'none');
                                    $('.page-options-size-changer').css('display', 'none');
                                    $('.page-options').css('display', 'none');
                                }
                            })
                        },
                        getServerurl: function (url) {
                            return dialogutils.getServerurl(url);
                        },
                        sendTc: function () {
                            if (uid == 0 || !uid) {
                                //没登录吊起登录 重新赋值
                                rightlogin.isshow = true;
                                return
                            }
                            if (!rightThree.tc_input) {
                                dialogutils.showMessage('请输入吐槽内容');
                                return
                            }
                            if (rightThree.tc_input.length > 500) {
                                dialogutils.showMessage('吐槽内容太长啦');
                                return
                            }
                            if (rightThree.clicktime == 0) {
                                rightThree.clicktime = Math.round(new Date());
                            } else {
                                let nowtime = Math.round(new Date());
                                if (nowtime - rightThree.clicktime < 3000) {
                                    dialogutils.showMessage('不要重复点击');
                                    return
                                }
                                rightThree.clicktime = nowtime;
                            }
                            dialogutils.Net({
                                url: dialogUrl.complaint,
                                type: 6,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang,
                                    content: rightThree.tc_input,
                                }
                            }, function (data) {
                                if (data.ok) {
                                    rightThree.initData(1);
                                    leftRedio.initData();
                                    rightThree.tc_input = '';
                                    if (rightThree.pager) {
                                        rightThree.pager.handleToPage(0);
                                    }
                                    dialogutils.getOrderPhone();
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            }, true);
                        },
                        /**
                         * 时间格式化
                         * @param time    当前时间毫秒
                         * @param format  格式化输出格式  yyyy-MM-dd HH:mm:ss
                         * @constructor
                         */
                        toDate: function (time, format) {
                            return dialogutils.toDate(time, format);
                        },
                    },
                    created: function () {
                    },
                    mounted: function () {

                    },
                })
                rightFour = new Vue({
                    el: '#m_float_right_four_box',
                    data: {
                        isshow: false,
                        wangwang: m_dialog_search_wangwang,
                        baseUrl: dialogbaseUrl,
                        leixinglist: ['恶意打假', '恶意退款', '恶意差评', '抽检', '评价广告', '刷单返利', '降权号'],
                        mstextlist: ['用工商，发票，字体，商标，著作权，各种方式坑钱。', '做任务跑路，知假买假，仅退款。', '恶意差评', '该类账号购物后会存在商品链接被删除的风险。', '在评价里面打广告。', '做任务还走淘宝客或返利网坑钱。', '商家被降权或删销量后，系统提示的账号。'],
                        jtmslist: ['请提供聊天截图、退款截图等。', '请提供聊天截图、退款截图等。', '请提供评价截图和聊天截图。', '请提供违规处罚截图和订单截图。', '请提供评价截图和订单截图。', '请提供“查淘客”结果截图和做任务截图。', '请提供违规截图和做任务截图。'],
                        leixingselect: 0,
                        uploadimglist: [],//上传图片地址集合
                        sh_input: '',//受害输入框

                        type: 0,//标记类型 0恶意打假 1恶意退款 2恶意差评 3抽检 4评价广告 5刷单返利 6降权
                        images: [],//截图
                        remark: '',//受害经历
                        status: 0,//0待审核 1验证审核通过 2可疑审核通过 3审核拒绝
                        reason: '',//审核拒绝原因
                        mstext: '用工商，发票，字体，商标，著作权，各种方式坑钱。',//描述文字 切换时使用
                        jtmstext: '请提供聊天截图、退款截图等。',
                        clicktime: 0,
                    },
                    methods: {
                        getServerurl: function (url) {
                            return dialogutils.getServerurl(url);
                        },
                        changeLeixing: function (index) {
                            rightFour.leixingselect = index;
                            if (index < rightFour.mstextlist.length) {
                                rightFour.mstext = rightFour.mstextlist[index];
                            }
                            if (index < rightFour.jtmslist.length) {
                                rightFour.jtmstext = rightFour.jtmslist[index];
                            }
                        },
                        getSelectImg: function (index) {
                            if (index == this.leixingselect) {
                                return dialogutils.getServerurl('dialog_select.png');
                            } else {
                                return dialogutils.getServerurl('dialog_unselect.png');
                            }
                        },

                        onFilechange: function (event, index) {
                            var self = this;
                            var files = event.currentTarget.files[0];
                            //读取图片数据
                            var reader = new FileReader();
                            reader.onload = function (e) {
                            };
                            reader.readAsDataURL(files);
                            var url = self.getFileUrl(files);
                            if (!url) {
                                dialogutils.showMessage('选择图片失败');
                                return;
                            }
                            var img = {
                                path: url,
                                file: files
                            }
                            //选中图片后直接上传
                            rightFour.uploadFile(index, files);
                        },
                        getFileUrl: function (file) {
                            var url;
                            if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
                                url = window.URL.createObjectURL(file);
                            } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
                                url = window.URL.createObjectURL(file);
                            }
                            return url;
                        },

                        uploadFile: function (index, uploadfile) {
                            dialogutils.showLoading()
                            let files = [];
                            files.push(uploadfile);
                            dialogutils.postFile(dialogUrl.upload, files, {}, (ok, data) => {
                                dialogutils.hideLoading()
                                if (ok) {
                                    if (index > -1) {
                                        //修改图片集合
                                        rightFour.uploadimglist.splice(index, 1, data.url);
                                    } else {
                                        //添加图片集合
                                        rightFour.uploadimglist.push(data.url)
                                    }
                                } else {
                                    dialogutils.showMessage(JSON.stringify(data));
                                }
                            });
                        },
                        submitDb: function () {
                            if (rightFour.type == 6 && rightFour.uploadimglist.length == 0) {
                                dialogutils.showMessage('降权号至少选择一张图片');
                                return
                            }
                            if (rightFour.sh_input.length < 10) {
                                dialogutils.showMessage('受害经历最少十个字');
                                return
                            }
                            if (rightFour.sh_input.length > 500) {
                                dialogutils.showMessage('受害经历太多了');
                                return
                            }
                            if (rightFour.clicktime == 0) {
                                rightFour.clicktime = Math.round(new Date());
                            } else {
                                let nowtime = Math.round(new Date());
                                if (nowtime - rightFour.clicktime < 3000) {
                                    dialogutils.showMessage('不要重复点击');
                                    return
                                }
                                rightFour.clicktime = nowtime;
                            }
                            dialogutils.Net({
                                url: dialogUrl.sign,
                                type: 6,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang,
                                    remark: rightFour.sh_input,
                                    images: JSON.stringify(rightFour.uploadimglist),
                                    type: rightFour.leixingselect,
                                }
                            }, function (data) {
                                if (data.ok) {
                                    rightFour.initData();
                                    dialogutils.getOrderPhone();
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            }, true)
                        },
                        initData: function () {
                            //登录才能有info信息
                            if (uid == 0) {
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.sign_info,
                                type: 5,
                                parmas: {
                                    wangwang: m_dialog_search_wangwang,
                                }
                            }, function (data) {
                                if (data.ok) {
                                    rightFour.type = data.data.type;
                                    rightFour.images = JSON.parse(data.data.images);
                                    rightFour.remark = data.data.remark;
                                    rightFour.status = data.data.status;
                                    rightFour.reason = data.data.reason;
                                } else {
                                }
                                //加载成功后隐藏加载框
                                dialogutils.hidefistLoading();
                            })
                        },
                        getStatus(status) {//0待审核 1验证审核通过 2可疑审核通过 3审核拒绝
                            switch (status) {
                                case 0:
                                    return '待审核'
                                    break
                                case 1:
                                    return '验证审核通过'
                                    break
                                case 2:
                                    return '可疑审核通过'
                                    break
                                case 3:
                                    return '审核拒绝'
                                    break
                            }
                        },
                        jumDbjl: function () {
                            window.open(dialogbaseUrl + 'home/customer/v/info?type=2');
                        },
                    },
                    created: function () {

                    },
                    mounted: function () {
                        // this.initData()
                    },
                })
                rightFive = new Vue({
                    el: '#m_float_right_five_box',
                    data: {
                        isshow: false,
                        is_finish: 0,
                        content: '',
                        text1: '',
                        text2: '',
                        text3: '',
                        seller_wangwang: '',
                        qrcode: '',
                        is_activate: '',
                        greensuccess: '',
                        input_ml: '',
                        qrcode_id: '',
                    },
                    methods: {
                        copyContent: function () {
                            dialogutils.copyText(rightFive.content);
                        },
                        initContent: function (isrefush = false) {
                            if (uid == 0) {
                                return
                            }
                            if (rightFive.content && !isrefush) {
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.share,
                                type: 5,
                                parmas: {
                                    wangwang: rightFive.seller_wangwang
                                }
                            }, function (data) {
                                if (data.ok) {
                                    rightFive.content = data.data.share_text;
                                    rightFive.text1 = data.data.text1;
                                    rightFive.text2 = data.data.text2;
                                    rightFive.text3 = data.data.text3;
                                    rightFive.is_finish = data.data.is_finish;
                                    rightFive.qrcode = data.data.qrcode;
                                    rightFive.qrcode_id = data.data.qrcode_id;
                                    rightFive.is_activate = data.data.is_activate;
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            }, false);
                        },
                        //激活密令
                        jhml: function () {
                            if (rightFive.input_ml.length != 6) {
                                dialogutils.showMessage('请输入合理的密令');
                                return
                            }
                            dialogutils.Net({
                                url: dialogUrl.active_qrcode,
                                type: 6,
                                parmas: {
                                    secret_key: rightFive.input_ml,
                                    qrcode_id: rightFive.qrcode_id,
                                }
                            }, function (data) {
                                if (data.ok) {
                                    dialogutils.showMessage('密令激活成功');
                                    rightFive.initContent(true);
                                    //激活密令后如果用户点击过第二个 那么要刷新用户coin
                                    if (rightTwo) {
                                        rightTwo.refushUserinfo();
                                    }
                                } else {
                                    dialogutils.showMessage(data.data);
                                }
                            }, true)
                        }
                    },
                    created: function () {

                    },
                    mounted: function () {
                        let sellerwwclass = "a[class^=j_UserNick]"; //天猫店 商家旺旺
                        let tbsellerwwclass = "a[class^=user-nick]"; //淘宝店 商家旺旺
                        this.seller_wangwang = $(sellerwwclass).text();
                        if (!this.seller_wangwang) {
                            this.seller_wangwang = $(tbsellerwwclass).text();
                        }
                        this.greensuccess = dialogutils.getServerurl('greensuccess.png');
                    },
                })
            }
        }
        window.dialogutils = dialogutils;
    }
}

