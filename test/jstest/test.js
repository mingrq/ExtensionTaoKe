let jcz_qcc_sold_item_href = window.location.href;
let jcz_qcc_sold_item_topHref = top.location.href;
let jcz_qcc_sold_item_isCc = false;//正式 false 测试 true
//是否正式 如果正式则请求网上的js 否则调试本地
if (jcz_qcc_sold_item_isCc) {
    //如果请求的页面与浏览器页面相同则执行(防止包含iframe重复请求js)
    if (jcz_qcc_sold_item_href && jcz_qcc_sold_item_href == jcz_qcc_sold_item_topHref) {
        //传入对应的url 获取对应的js
        //截取字符串前面一段
        jcz_qcc_sold_item_href = jcz_qcc_sold_item_href.split('?')[0];
        chrome.extension.sendMessage({type: 1, href: jcz_qcc_sold_item_href}, (data) => {
        });
    }
} else {
    if (jcz_qcc_sold_item_href == jcz_qcc_sold_item_topHref) {
        let baseUrl = 'https://www.qinchacha.com/'; //网络请求测试地址
        //let baseUrl = 'http://192.168.0.111:7001/'; //网络请求测试地址
        //let baseUrl = 'http://192.168.0.111:7001/'; //网络请求测试地址
        let uid = 0;
        let token = '';
        let wangwang = '';

        let roll = -1;
        let notice = -1;
        let rollSet;
        let noticeSet;

        let changesoldlist_rightlogin = null;
        let changesoldlist_plcx = null;
        let changesoldlist_allbj = null;

        let pushitenrightcalss = "td[class^=item-mod__thead-cell___]"; //卖出列表 右边push的chass
        let orderclass = "label[class^=item-mod__checkbox-label___]"; //获取订单号的class
        let biaojiclass = "tr[class*=suborder-mod__first-item___]"; //添加右边标记的class
        let sellerwwclass = "a[class^=j_UserNick]"; //天猫店 商家旺旺
        let tbsellerwwclass = "a[class^=user-nick]"; //淘宝店 商家旺旺
        let beyWang = "a[class^=buyer-mod__name___]";//买家旺旺
        let tbsellerlogoutclass = "a[class^=sn-logout]"; //天猫退出登录
        let searchAllclass = "div[class^=simple-pagination-mod__container___]"; //搜索全部class
        //这个地方只写测试 未来放到服务器上直接下载下来
        let sold_list_urls = {
            upload_wangwang: baseUrl + 'plug/index/upload_wangwang',
            init_list: baseUrl + 'plug/index/init_list',
            init_notice: baseUrl + 'plug/index/notice',
            login: baseUrl + 'plug/index/login',
            user_info: baseUrl + 'plug/index/info',
            batch_tbk_info: baseUrl + 'plug/buyer/batch_tbk_info',
        }

        let loginhtml = `
                <!--浮出-->
                <!--插件升级弹窗-->
                <div class="jcz_qcc_upgrade" style="top: 0;left: 0;right: 0;bottom: 0; position: fixed;display: none;flex-direction: column; justify-content: center;align-items: center;z-index: 999;  background: rgba(0, 0, 0, 0.2);">
                    <div id="jcz_qcc_upgrade_content" style="width: 300px;  height: 150px; background-color: #fff;display: flex;flex-direction: column;border-radius: 4px; box-shadow:0px 14px 9px rgba(0,0,0,0.16);">
                        <span style="font-size: 14px;margin-top: 5px;margin-left: 10px;color: #aaaaaa">
                            提示
                        </span>
                        <span style="font-size: 14px;margin-top: 5px;margin-left: 10px;flex: 1">
                            亲查查插件已经有新版本了，请前去官网下载最新版本插件获取更好的体验。
                        </span>
                        <div style="margin-top: 10px; width: inherit;height: 40px;display: flex;flex-direction: row;border-top: solid #eee 1px">
                            <span id="jcz_qcc_upgrade_cancle" style="display: flex;align-items: center;justify-content: center ;font-size: 14px;flex: 1;color: #999999;border-right: solid #eee 1px;cursor: pointer">
                               取消
                            </span>
                            <span id="jcz_qcc_upgrade_go" style="display: flex;align-items: center;justify-content: center;font-size: 14px;flex: 1;color: #3898fc;cursor: pointer">
                               前去更新
                            </span>
                        </div>
                    </div>
                </div>
                <div class="jcz_qcc_changesold_list_float">
                    <style>
                        input:-webkit-autofill {
                          -webkit-box-shadow: 0 0 0px 1000px white inset;
                        }
                        input, button, select, textarea {
                            outline: none;
                            border-width: 0px;
                        }
                
                        textarea {
                            resize: none;
                            border-width: 0px;
                        }
                
                        .jcz_qcc_changesold_list_float {
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.4);
                            position: fixed;
                            display: none;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            z-index: 999999;
                        }
                
                        .jcz_qcc_changesold_float_box {
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            position: absolute;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            z-index: 1;
                        }
                
                        .jcz_qcc_float_right_one_right_item span {
                            color: #333333;
                            font-size: 14px;
                        }
                
                        .jcz_qcc_float_right_one_right_item h6 {
                            margin-left: 30px;
                            color: #99A2A8;
                            font-size: 14px;
                        }
                        .jcz_qcc_shangesold_showmessagebox{
                            position: absolute;
                            display: none;
                            padding-left: 20px;
                            padding-right: 20px;
                            z-index: 99999999;
                            width: auto;
                            min-width: 130px;
                            height: auto;
                            min-height: 60px;
                            color: #fff;
                            font-size: 14px;
                            align-items: center;
                            justify-content: center;
                            border-radius: 4px;
                            background-color: rgba(0,0,0,0.7);
                            box-shadow:0px 14px 9px rgba(0,0,0,0.16);
                        }
                        
                        #showallbj:hover{
                            border: 1px solid #ff0000;
                            box-sizing: border-box;
                        }
                
                
                    </style>
                   
                    <div class="jcz_qcc_changesold_float_box">
                        <!--提示信息弹窗-->
                        <div class="jcz_qcc_shangesold_showmessagebox" >
                        </div>
                        <!--登录-->
                        <div v-show="isshow" id="jcz_qcc_changesold_float_right_login_box" style="width: 436px;height: 315px;background-color: #fff;border-radius: 5px;display: flex;flex-direction: column;z-index: 9999">
                            <div style="padding: 31px">
                                <img style="width: 114px;height: 50px;" :src="getServerurl('right_one_qcc_logo.png')"/>
                                <div style="width: 100%;display: flex;flex-direction: row;align-items: center;height: 40px;margin-top: 26px;border:1px solid #E6E6E6;border-radius: 2px;">
                                    <img :src="getServerurl('username.png')"
                                         style="width: 13px;height: 15px;margin-left: 14px;margin-right: 14px">
                                    <input style="flex: 1 ;color:#333;  -webkit-box-shadow: 0 0 0px 1000px white inset;" v-model="phone" oninput="value=value.replace(/[^\\d]/g,'')"
                                           placeholder="请输入手机号码">
                                </div>
                                <div style="width: 100%;display: flex;flex-direction: row;align-items: center;height: 40px;margin-top: 16px;margin-bottom:16px;border:1px solid #E6E6E6;border-radius: 2px">
                                    <img :src="getServerurl('pwd.png')"
                                         style="width: 13px;height: 15px;margin-left: 14px;margin-right: 14px">
                                    <input type="password" style="flex: 1;color:#333; -webkit-box-shadow: 0 0 0px 1000px white inset;" v-model="pwd"
                                           oninput="if(value.length>18)value=value.slice(0,18)" placeholder="请输入密码">
                                </div>
                                <div @click="login()"
                                     style="width: 100%;height: 40px;border-radius: 2px;background-color: #FF8181;display: flex;align-items: center;justify-content: center;color: #fff;font-size: 14px;ont-weight:bold;cursor: pointer">
                                    登录
                                </div>
                
                                <div style="width: 100%;display: flex;flex-direction: row;align-items: center;margin-top: 20px">
                                    <a :href="baseUrl" style="flex: 1;color: #999999;font-size: 12px;" target="_blank">用户注册</a>
                                    <a :href="baseUrl" styl="color: #999999;font-size: 12px;" target="_blank">找回密码</a>
                                </div>
                            </div>
                        </div>
                         <!--批量查询弹框-->
                        <div v-show="isshow" id="jcz_qcc_changesold_float_plcx_box" style="width: 520px;height: 561px;background-color: #fff;border-radius: 5px;z-index: 9999;display: flex">
                            <div style="padding: 15px;display: flex;flex-direction: column;align-items: center;width: inherit">
                                <div style="display: flex;flex-direction: row;align-items:center;font-size: 16px;color: #333">
                                    <img style="width: 16px;height: 16px;margin-right: 5px" :src="getServerurl('item_logo.png')"/>淘客订单批量查询
                                </div>
                                <span style="font-size: 12px;margin-top: 6px;margin-bottom: 4px; color: #999999">当前页可查询订单{{list.length}}条</span>
                                <!--列表-->
                                <div v-if="list.length >0" style="flex: 1;min-height: 350px;display: flex;flex-direction: column;width: 100%">
                                    <!--标题部分-->
                                    <div style="width: inherit;height: 24px;background-color: #F8F8F8;border:1px solid #E6E6E6;border-bottom-width: 0px; display: flex;flex-direction: row;align-items: center">
                                        <span style="height: inherit;width: 39px;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;border-right:1px solid #E6E6E6; ">
                                        <img @click="changeselectAll(1)" v-if="is_select_all" :src="getServerurl('select.png')" style="width: 12px;height: 12px">
                                        <img @click="changeselectAll(0)" v-else :src="getServerurl('un_select.png')" style="width: 12px;height: 12px">
                                        </span>
                                        <span style="height: inherit;width: 39px;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;border-right:1px solid #E6E6E6; ">
                                        序号
                                        </span>
                                        <span style="height: inherit;flex: 1;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;border-right:1px solid #E6E6E6; ">
                                        下单旺旺
                                        </span>
                                        <span style="height: inherit;flex: 1;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;border-right:1px solid #E6E6E6; ">
                                        订单编号
                                        </span>
                                        <span style="height: inherit;flex: 1;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;">
                                        淘客查询结果
                                        </span>
                                    </div>
                                    <!--内容部分-->
                                     <div v-for="(vo,index) in list" :style="index == list.length-1 ? 'border-bottom-width: 1px' : 'border-bottom-width: 0px'" style="width: inherit;height: 24px; border:1px solid #E6E6E6; display: flex;flex-direction: row;align-items: center">
                                        <nobr style="height: inherit;line-height: 22px; width: 39px; font-size: 12px;color: #333333;text-align: center; border-right:1px solid #E6E6E6;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                              <img v-if="vo.is_canselect==-1" :src="getServerurl('unable_select.png')" style="width: 12px;height: 12px">
                                              <img @click="changeItemSelect(index)" v-if="vo.is_canselect==0" :src="getServerurl('un_select.png')" style="width: 12px;height: 12px">
                                              <img @click="changeItemSelect(index)" v-if="vo.is_canselect==1" :src="getServerurl('select.png')" style="width: 12px;height: 12px">
                                        </nobr>
                                        <nobr style="height: inherit;line-height: 22px; width: 39px; font-size: 12px;color: #333333;text-align: center; border-right:1px solid #E6E6E6;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                        {{index+1}}
                                        </nobr>
                                        <nobr style="height: inherit;line-height: 22px; flex: 1;font-size: 12px;color: #333333;text-align: center; border-right:1px solid #E6E6E6;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                        {{vo.wangwang}}
                                        </nobr>
                                        <nobr style="height: inherit;line-height: 22px; flex: 1;font-size: 12px;text-align: center; color: #333333;border-right:1px solid #E6E6E6;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                         {{vo.ordernum}}
                                        </nobr>
                                        <nobr v-if="vo.is_tbk ==-2" @click="searchTbk(index)" style="height: inherit; line-height: 22px;flex: 1;text-align: center; font-size: 12px;color:#006FFF;text-overflow:ellipsis; white-space: nowrap; display: flex;align-items: center;justify-content: center; overflow: hidden;cursor: pointer">
                                        <img style="width: 12px;height: 12px;margin-right: 4px;" :src="getServerurl('item_search.png')">  {{getStarus(vo.is_tbk)}}
                                        </nobr>
                                        <nobr v-if="vo.is_tbk ==-1" style="height: inherit; line-height: 22px;flex: 1;text-align: center; font-size: 12px;color:#333333;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                        {{getStarus(vo.is_tbk)}}
                                        </nobr>
                                        <nobr v-if="vo.is_tbk ==0" style="height: inherit;line-height: 22px; flex: 1;text-align: center; font-size: 12px;color:#DDDDDD;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                        {{getStarus(vo.is_tbk)}}
                                        </nobr>
                                        <nobr v-if="vo.is_tbk ==1" style="height: inherit;line-height: 22px; flex: 1;text-align: center;font-size: 12px;color:#FF0000;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                        {{getStarus(vo.is_tbk)}}
                                        </nobr>
                                    </div>
                                </div>
                                <!--没有数据-->
                                <div v-if="list.length ==0" style="flex: 1;min-height: 350px;display: flex;flex-direction: column;align-items: center;justify-content: center ;width: 100%">
                                     <span style="font-size: 16px;color: #999999">
                                       当前页面暂无可查订单
                                     </span>       
                                </div>

                                <div style="margin-top: 12px;width: 100%;display: flex;flex-direction: column">
                                    <span v-if="issearch ==0" @click="startSearch()"  style="width: inherit;height: 40px;display: flex;align-items: center;justify-content: center;background-color:#FF8181; font-size: 14px;color: #fff;font-weight: bold;border-radius: 4px; cursor: pointer">
                                        开始批量查询    
                                    </span>
                                    <span v-if="issearch ==1" style="width: inherit;height: 40px;display: flex;align-items: center;justify-content: center;background-color:#C5C5C5; font-size: 14px;color: #fff;font-weight: bold;border-radius: 4px;cursor: pointer">
                                        淘客查询中    
                                    </span>
                                    <div style="margin-top:10px;width: inherit;display: flex;flex-direction: row;align-items: center;font-size: 12px;color: #333">
                                        批量查询需要5亲币/订单。
                                        <span style="flex: 1"></span>
                                        <img style="margin-right: 11px;width: 12px;height: 12px;" :src="getServerurl('qb_logo.png')">
                                        亲币
                                        <span style="margin-left: 25px;font-size: 12px;color: #FFA74E;">{{coin}}</span>
                                        <span @click="czClick()" style="margin-left: 9px;font-size: 12px;color: #0088FF;cursor: pointer">充值</span>
                                        <span @click="refushClcik()" style="margin-left: 9px;font-size: 12px;color: #0088FF;cursor: pointer">刷新</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--当页标记汇总-->
                        <div v-show="isshow" id="jcz_qcc_changesold_float_allbj_box" style="width: 430px;padding:15px;background-color: #fff;border-radius: 5px;z-index: 9999;display: flex">
                            <div style="display: flex;flex-direction: column;align-items: center;width: inherit">
                                <div style="display: flex;flex-direction: row;align-items:center;font-size: 16px;color: #333">
                                    <img style="width: 16px;height: 16px;margin-right: 5px" :src="getServerurl('item_logo.png')"/>当页标记汇总
                                </div>
                                <!--列表-->
                                <div v-if="list.length >0" style="margin-top: 20px;flex: 1;display: flex;flex-direction: column;width: 100%">
                                    <!--标题部分-->
                                    <div style="width: inherit;height: 24px;background-color: #F8F8F8;border:1px solid #E6E6E6;border-bottom-width: 0px; display: flex;flex-direction: row;align-items: center">
                                        <span style="height: inherit;flex: 1;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;border-right:1px solid #E6E6E6; ">
                                        订单编号
                                        </span>
                                        <span style="height: inherit;flex: 1;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;border-right:1px solid #E6E6E6; ">
                                        下单旺旺
                                        </span>
                                        <span style="height: inherit;flex: 1;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #999999;">
                                        标记情况
                                        </span>
                                    </div>
                                    <!--内容部分-->
                                     <div v-for="(vo,index) in list" :style="index == list.length-1 ? 'border-bottom-width: 1px' : 'border-bottom-width: 0px'" style="width: inherit;height: 24px; border:1px solid #E6E6E6; display: flex;flex-direction: row;align-items: center">
                                        <nobr style="height: inherit;line-height: 22px; flex: 1;font-size: 12px;text-align: center; color: #333333;border-right:1px solid #E6E6E6;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                         {{vo.order}}
                                        </nobr>
                                        <nobr style="height: inherit;line-height: 22px; flex: 1;font-size: 12px;color: #333333;text-align: center; border-right:1px solid #E6E6E6;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                        {{vo.wangwang}}
                                        </nobr>
                                        <nobr v-if="vo.count>0" @click="jumBjDetal(index)" style="height: inherit; line-height: 22px;flex: 1;text-align: center; font-size: 12px;color:#FF0000;ext-decoration:underline;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;text-decoration:underline;cursor: pointer">
                                            {{vo.count}}
                                        </nobr>
                                        <nobr v-if="vo.count==0" style="height: inherit; line-height: 22px;flex: 1;text-align: center; font-size: 12px;color:#999999;ext-decoration:underline;text-overflow:ellipsis; white-space: nowrap; display: block; overflow: hidden;">
                                           暂无标记
                                        </nobr>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;


        let sold_list_utils = {
            //提示弹窗
            showMessage: function (messagecontent) {
                $('.jcz_qcc_shangesold_showmessagebox').css('display', 'flex');
                $('.jcz_qcc_shangesold_showmessagebox').text(messagecontent);
                setTimeout(function () {
                    $('.jcz_qcc_shangesold_showmessagebox').css('display', 'none');
                }, 2000)
            },
            //修改已卖出列表插入数据
            pushList: function () {
                //获取所有的订单号
                let allorder = [];
                for (let i = 0; i < $(orderclass).length; i++) {
                    allorder.push($(orderclass).eq(i).find('span')[2].innerHTML)
                }

                //获取所有的买家旺旺号
                let count = $(beyWang).length;
                let shopWangWangs = [];
                for (let i = 0; i < count; i++) {
                    shopWangWangs.push($(beyWang).eq(i).text());
                }
                if (allorder.length > 0 && shopWangWangs.length > 0 && wangwang) {
                    let photourl = sold_list_utils.getServerurl("");

                    //拿到外层cell
                    //此类名同一行有两个 取偶数个
                    chrome.extension.sendMessage({
                            type: 5,
                            url: sold_list_urls.init_list,
                            parmas: {
                                seller_wangwang: wangwang,
                                wangwangs: JSON.stringify(shopWangWangs),
                                order_nums: JSON.stringify(allorder),
                            }
                        }, (data) => {
                            //防止下一页数据重复
                            $('.jcz_qcc_plug_main_div').remove();
                            $('.jcz_qcc_bj_all_box').remove();
                            setTimeout(() => {
                                //插入是否使用淘客
                                let cell = $(pushitenrightcalss);
                                if (!data.ok) {
                                    return;
                                }
                                data.data.order_list.map((item) => {
                                    for (let i = 0; i < cell.length; i++) {
                                        if (i % 2 != 0) continue;  //
                                        let top = "<style>\n" +
                                            "    .jcz_qcc_nav_div:hover {\n" +
                                            "        border-bottom-color: #0077FF\n" +
                                            "    }\n" +
                                            "\n" +
                                            "    .jcz_qcc_nav_div {\n" +
                                            "        margin: -15px 0px;\n" +
                                            "        padding: 11px 0px 11px;\n" +
                                            "        width: 114px;\n" +
                                            "        position: relative;\n" +
                                            "        display: flex;\n" +
                                            "        flex-direction: row;\n" +
                                            "        align-items: center;\n" +
                                            "        justify-content: center;\n" +
                                            "        border-bottom: 2px solid #EAF7FF;\n" +
                                            "        flex: 1;\n" +
                                            "        cursor: pointer;\n" +
                                            "    }\n" +
                                            "</style>\n" +
                                            "<div class=\"jcz_qcc_plug_main_div\" style=\"height: auto;float: right;margin-top: 0px; display: flex;\n" +
                                            "            flex-direction: row;\n" +
                                            "            align-items: center;\n" +
                                            "            font-size: 12px;\n" +
                                            "            margin-right: -1px;\n" +
                                            "            width: 342px;\">\n" +
                                            "    <div class=\"jcz_qcc_header_div\" style=\"   width: 114px;\n" +
                                            "            margin: -15px 0px;\n" +
                                            "            padding: 12px 0px;\n" +
                                            "            height: auto;\n" +
                                            "            display: flex;\n" +
                                            "            flex-direction: row;\n" +
                                            "            align-items: center;\n" +
                                            "            justify-content: center;\">\n" +
                                            "        <img class=\"jcz_qcc_header_img_qcc\"\n" +
                                            "             src=\"" + photourl + "logo_qcc.png?v=0.3\" style=\" width: 77px;\n" +
                                            "            height: 22px;\"/>\n" +
                                            "    </div>\n" +
                                            "    <div class=\"jcz_qcc_header_right\" style=\"flex: 1;\n" +
                                            "            display: flex;\n" +
                                            "            flex-direction: row;\n" +
                                            "            height: auto;\">\n" +
                                            "        <!--查信誉-->\n" +
                                            "        <div id='jcz_qcc_nav_div_cxy' class=\"jcz_qcc_nav_div jcz_qcc_nav_div_cxy\">\n" +
                                            "            <img class=\"jcz_qcc_nav_div_img\"\n" +
                                            "                 src=\"" + photourl + "item_search.png\" style=\" width: 12px;\n" +
                                            "            height: 12px;\n" +
                                            "            margin: 0px 6px;\">\n" +
                                            "            <div class=\"jcz_qcc_nav_div_title\" style=\" color: #0077FF;\n" +
                                            "            font-size: 12px;\">查信誉\n" +
                                            "            </div>\n" +
                                            "        </div>\n";

                                        let chaxinyu = "        <!--查淘客-->\n" +
                                            "        <div id='jcz_qcc_nav_div_ctk'  class=\"jcz_qcc_nav_div jcz_qcc_nav_div_ctk\">\n" +
                                            "            <img class=\"jcz_qcc_nav_div_img\"\n" +
                                            "                 src=\"" + photourl + "item_search.png\" style=\" width: 12px;\n" +
                                            "            height: 12px;\n" +
                                            "            margin: 0px 6px;\">\n" +
                                            "            <div class=\"jcz_qcc_nav_div_title\" style=\" color: #0077FF;\n" +
                                            "            font-size: 12px;\">查淘客\n" +
                                            "            </div>\n" +
                                            "        </div>\n";
                                        <!--无淘客佣金-->
                                        let wutaoke = "<div id='jcz_qcc_nav_div_wtk' class='jcz_qcc_nav_div_wtk' style=\"margin: -15px 0px;\n" +
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
                                            "        <div id='jcz_qcc_nav_div_sytk' class='jcz_qcc_nav_div_sytk' style=\"margin: -15px 0px;\n" +
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

                                        let end = "    </div>\n" +
                                            "</div>";
                                        let appendhtml = '';
                                        if (item.order_num.trim() == cell.eq(i).find('span')[2].innerHTML.trim()) {
                                            switch (item.is_tbk) {//0没有查询记录 1使用了淘客 2无淘客
                                                case 0:
                                                    appendhtml = top + chaxinyu + end
                                                    break
                                                case 1:
                                                    appendhtml = top + shiyongtaoke + end
                                                    break
                                                case 2:
                                                    appendhtml = top + wutaoke + end
                                                    break
                                            }
                                            cell.eq(i).append(appendhtml);
                                            break
                                        }
                                    }
                                })

                                let $listitem = $(biaojiclass);
                                //1遍历旺旺对应的数据插入
                                for (let i = 0; i < $listitem.length; i++) {
                                    for (let item of data.data.wangwang_list) {
                                        let appendhtml = '<div class=\"jcz_qcc_bj_all_box\" style=\"flex-direction: column;align-items: center;display: flex\">';
                                        //标记条数
                                        if (item.count > 0) {
                                            appendhtml = appendhtml + '<span class="jcz_qcc_bjsize" style=\"color: #FF0000;font-size: 12px;line-height: 13px;border-bottom: solid 1px #FF0000;cursor:pointer; margin-bottom: 5px\">' + item.count + '条标记</span>\n';
                                        } else {
                                            appendhtml = appendhtml + '<span style=\"color:#CCCCCC;font-size: 12px;margin-bottom: 5px\">暂无标记</span>\n';
                                        }
                                        appendhtml = appendhtml + '<div class="jcz_qcc_bjbox" style= "display: flex;\n' +
                                            "        border-radius: 2px;" +
                                            "        flex-direction: row;" +
                                            "        align-items: center;" +
                                            "        justify-content: center;" +
                                            "        cursor: pointer;" +
                                            "        width: 68px;height: 22px;border: solid 1px #FFD5C5\">" +
                                            "            <img src=\"" + photourl + "item_logo.png\" style=\"height:14px;width: 14px;margin-right: 3px\">" +
                                            "            <span style=\"color: #FF723C;font-size: 12px\">标记TA</span>" +
                                            '        </div> </div>\n';
                                        if (item.wangwang.trim() == $listitem.eq(i).find("a[class^='buyer-mod__name___']").text().trim()) {
                                            $(biaojiclass).eq(i).children().eq(7).append(appendhtml);
                                            break;
                                        }
                                    }
                                }
                                changesoldlist_allbj.refushList(data.data.wangwang_list, allorder, shopWangWangs);
                            }, 300);
                        }
                    );
                    setTimeout(function () {
                        sold_list_utils.addListClick();
                        sold_list_utils.addbiaojiClick();
                    }, 2000)
                    sold_list_utils.exitClick();
                }
            },
            //退出登录按钮
            exitClick: function () {
                $(tbsellerlogoutclass).unbind().click(function () {
                    chrome.extension.sendMessage({
                        type: 4,
                    }, (data) => {
                        uid = 0;
                    })
                })
            },
            //添加查信誉点击事件
            addListClick: function () {
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

                //查信誉
                $('.jcz_qcc_nav_div_cxy').unbind().click(function () {
                    let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                    //拿到标题
                    let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                    let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                    let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                    let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                    let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                    let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                    sold_list_utils.openSearchwwDialog(0, wangwang, order_num, create_time, paynum, order_img, order_title);
                })
                //查淘客
                $('.jcz_qcc_nav_div_ctk').unbind().click(function () {
                    //拿到标题
                    let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                    //拿到标题
                    let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                    let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                    let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                    let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                    let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                    let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                    sold_list_utils.openSearchwwDialog(1, wangwang, order_num, create_time, paynum, order_img, order_title);
                })

            },
            //添加标记点击事件
            addbiaojiClick: function () {
                $('.jcz_qcc_bjsize').unbind().click(function () {
                    //拿到标题
                    let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                    //拿到标题
                    let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                    let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                    let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                    let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                    let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                    let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                    sold_list_utils.openSearchwwDialog(0, wangwang, order_num, create_time, paynum, order_img, order_title);
                })
                $('.jcz_qcc_bjbox').unbind().click(function () {
                    //拿到标题
                    let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                    //拿到标题
                    let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                    let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                    let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                    let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                    let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                    let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                    sold_list_utils.openSearchwwDialog(3, wangwang, order_num, create_time, paynum, order_img, order_title);
                })

                //设置点击事件
                //使用了淘客
                $('.jcz_qcc_nav_div_sytk').unbind().click(function () {
                    //拿到标题
                    let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                    //拿到标题
                    let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                    let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                    let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                    let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                    let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                    let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                    sold_list_utils.openSearchwwDialog(1, wangwang, order_num, create_time, paynum, order_img, order_title);
                })
                //无淘客
                $('.jcz_qcc_nav_div_wtk').unbind().click(function () {
                    //拿到标题
                    let parents = $(this).parents("div[class^='item-mod__trade-order___']");
                    //拿到标题
                    let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                    let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                    let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                    let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                    let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                    let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                    sold_list_utils.openSearchwwDialog(1, wangwang, order_num, create_time, paynum, order_img, order_title);
                })

            },
            //数据刷新点击任务
            readClick: function () {
                /*搜索订单 跳转指定 */
                $("button[class*='button-mod__primary___']").unbind().click(function () {
                    click(1300);
                });
                /*$("div[class^='field-mod__field___']").eq(12).find('button').eq(0)
                    .unbind().click(function () {
                    click(1300);
                });*/
                /*监听上下页 + */
                $("div[class^='simple-pagination-mod__container___']").find('button')
                    .unbind().click(function () {
                    click(1300);
                });
                //上五页
                $('.pagination-jump-prev').unbind().click(function () {
                    click(1300);
                });
                //下五页
                $('.pagination-jump-next').unbind().click(function () {
                    click(1300);
                });
                /* 页面跳转*/
                $('.pagination-options-go').unbind().click(function () {
                    click(1300);
                });
                /*上一页 箭头*/
                $('.pagination-prev').unbind().click(function () {
                    click(1300);
                })
                /* 选择 页码 */
                $('.pagination-item').unbind().click(function () {
                    click(1300);
                });
                /*下一页 箭头*/
                $('.pagination-next').unbind().click(function () {
                    click(1300);
                })
                $('.pagination').parent().next().find('button').eq(0).unbind().click(function () {
                    click(1300);
                })

                /* 页面跳转*/
                function click(time) {
                    if (time == null) {
                        time = 1300;
                    }
                    setTimeout(function () {
                        //重新拉取列表数据
                        sold_list_utils.pushList();
                        sold_list_utils.scrollHtml();
                        //地下li重新增加第一次看不见的元素 需要重新初始化点击事件
                        setTimeout(() => {
                            sold_list_utils.readClick();
                        }, (500));

                    }, time);
                }

            },
            //滚动动画
            rollingNotice: function ($dome) {
                let noticeHeight = $($dome).find('ul').eq(0).find('li').eq(0).height();
                let noticeLength = $($dome).find('ul').eq(0).find('li').length;
                let $notice = $($dome).find('ul').eq(0);
                if (noticeLength > 1) {
                    noticeSet = setInterval(function () {
                        sold_list_utils.noticeTime($notice, noticeHeight, noticeLength)
                    }, 2800)
                    $notice.hover(function () {
                        clearInterval(noticeSet);			//清除自动滑动动画
                    }, function () {
                        noticeSet = setInterval(function () {
                            sold_list_utils.noticeTime($notice, noticeHeight, noticeLength)
                        }, 2800);	//继续执行动画
                    })
                }
            },

            rollingSign: function ($dome) {
                let rollHeight = $($dome).find('ul').eq(0).find('li').eq(0).height();
                let rollLength = $($dome).find('ul').eq(0).find('li').length;
                let $roll = $($dome).find('ul').eq(0);
                if (rollLength > 1) {
                    rollSet = setInterval(function () {
                        sold_list_utils.rollTime($roll, rollHeight, rollLength)
                    }, 4800)
                    $roll.hover(function () {
                        clearInterval(rollSet);			//清除自动滑动动画
                    }, function () {
                        rollSet = setInterval(function () {
                            sold_list_utils.rollTime($roll, rollHeight, rollLength)
                        }, 4800);	//继续执行动画
                    })
                }
            },
            //公告滚动
            noticeTime: function ($roll, rollHeight, rollLength) {
                if (notice == -1) {
                    notice = rollHeight;
                }
                if (notice == 0) {
                    $roll.css('marginTop', '0px');
                }
                let rollMax = parseInt(rollHeight) * parseInt(rollLength) - parseInt(rollHeight);
                $roll.animate({
                    marginTop: '-' + notice + 'px'
                }, '800', function () {
                    if (notice < rollMax) {
                        notice = notice + rollHeight
                    } else {
                        notice = 0;
                    }
                })
            },
            //滚动方法
            rollTime: function ($roll, rollHeight, rollLength) {
                if (roll == -1) {
                    roll = rollHeight;
                }
                if (roll == 0) {
                    $roll.css('marginTop', '0px');
                }
                let rollMax = parseInt(rollHeight) * parseInt(rollLength) - parseInt(rollHeight);
                $roll.animate({
                    marginTop: '-' + roll + 'px'
                }, '800', function () {
                    if (roll < rollMax) {
                        roll = roll + rollHeight
                    } else {
                        roll = 0;
                    }
                })
            },

            //订单上面滚动数据和公告
            scrollHtml: function () {
                //获取所有的买家旺旺号
                let count = $(beyWang).length;
                let shopWangWangs = [];
                for (let i = 0; i < count; i++) {
                    shopWangWangs.push($(beyWang).eq(i).text());
                }
                let url = sold_list_utils.getServerurl("");
                var scroll_html = ` <div style='position:relative;display: flex;flex-direction: row;border: solid #E6E6E6 1px;margin-top: 7px;margin-bottom: 5px;'
                                         class="jcz_qcc_scroll_label">
                                        <!--左边-->
                                        <div style="width: 250px;height: 56px;display: flex;flex-direction: row;align-items: center;border-right: solid #E6E6E6 1px;">
                                            <img src="` + url + `logo_qcc.png"
                                                 style="width:108px;height: 31px;margin-right: 21px;margin-left: 14px">
                                            <div class="jcz_qcc_scroll_seller_help"
                                                 style="display: flex;align-items: center;flex-direction: row;position: relative;cursor: pointer">
                                                <img src="` + url + `erweima.png"
                                                     style="width:14px;height: 14px;margin-right: 7px">
                                                <span style="font-size: 12px;color: #333333">商家互助群</span>
                                                <!--悬浮二维码-->
                                                <div id="jcz_qcc_scroll_erweima_box"
                                                     style="width: 168px;height: auto;align-items: center;justify-content: center;display: none; background-color: #fff;border-radius: 1px;box-shadow:0px 3px 6px rgba(0,0,0,0.16);position: absolute;top: 38px;left: -35px;">
                                                    <img id="jcz_qcc_scroll_erweima_img" src="" style="width: 149px;height: 149px;margin: 10px">
                                                </div>
                                            </div>
                                        </div>
                                        <!--中间-->
                                        <div style="display: flex;flex: 1;flex-direction: column;justify-content: center; border-right: solid #E6E6E6 1px;">
                                            <div style="display: flex;flex-direction: row;align-items: center;height: 20px;">
                                                <img class="jcz_qcc_dowebok_notice_icon"
                                                     src="` + url + `laba.png"
                                                     style="padding-left: 13px;height: 15px">
                                                <div class="jcz_qcc_dowebok_notice"
                                                     style="flex: 1;height: 100%;margin-left: 5px;line-height: 20px;overflow: hidden;">
                                                    <ul>
                                                    </ul>
                                                </div>
                                            </div>
                                    
                                            <!--被标记数据-->
                                            <div class="jcz_qcc_dowebok_sign"
                                                 style="height: 16px; margin-left: 13px;margin-top: 7px; line-height: 16px;overflow: hidden;">
                                                <ul>
                                                </ul>
                                            </div>
                                        </div>
                                        <!--右边-->
                                        <div id="showallbj" style="cursor: pointer; width: 123px;height: 56px;display: flex;flex-direction: column ;align-items: center;justify-content: center">
                                            <div style="display: flex;flex-direction: row;align-items: center;">
                                                <img src="` + url + `item_logo.png"
                                                     style="width: 12px;height: 12px;margin-right: 5px">
                                                <span style="font-size: 12px;color: #333333">当页标记汇总：</span>
                                            </div>
                                            <span style="font-size: 12px;color: #999999;font-weight: bold" class="jcz_qcc_report_times">暂无</span>
                                        </div>
                                    </div>`;
                $('.jcz_qcc_scroll_label').remove();
                $("div[class^=tabs-mod__main___]").after(scroll_html);

                //获取公告信息
                chrome.extension.sendMessage({
                        type: 5,
                        url: sold_list_urls.init_notice,
                        parmas: {
                            wangwangs: JSON.stringify(shopWangWangs),
                            wangwang: wangwang,
                        }
                    }, (data) => {
                        //插入是否使用淘客
                        if (!data.ok) return;
                        let num = data.data.num || 0;
                        let notice_ist = data.data.notice_ist;
                        let sign_ist = data.data.sign_ist;

                        if (num) {
                            $('.jcz_qcc_report_times').html(num + '条');
                            $('.jcz_qcc_report_times').css({
                                color: 'red',
                                textDecoration: 'underline',
                            });
                        }
                        $('#showallbj').unbind().click(function () {
                            sold_list_utils.showBjhz();
                        });
                        if (notice_ist.length <= 0) {
                            $('.jcz_qcc_dowebok_notice_icon').remove();
                        } else {
                            //赋值滚动列表数据
                            for (let i = 0; i < notice_ist.length; i++) {
                                if (notice_ist[i].href) {
                                    $('.jcz_qcc_dowebok_notice').find('ul').eq(0).prepend(
                                        '<li ><a target="_blank" href=" ' + notice_ist[i].href + ' " style="color: #5D5D5D">' + notice_ist[i].title + '</a></li>'
                                    );
                                } else {
                                    $('.jcz_qcc_dowebok_notice').find('ul').eq(0).prepend(
                                        '<li ><a   style="color: #5D5D5D">' + notice_ist[i].title + '</a></li>'
                                    );
                                }
                            }
                        }


                        for (let i = 0; i < sign_ist.length; i++) {
                            $('.jcz_qcc_dowebok_sign').find('ul').eq(0).prepend(
                                '<a target="_blank" href="' + sign_ist[i].href + '">' +
                                '<li style="height:16px;line-height:16px;color:#000;font-size: 12px;display: flex;flex-direction: row;' +
                                '">' +
                                '' + sold_list_utils.toDate(sign_ist[i].add_time, 'yyyy-MM-dd HH:mm:ss') +
                                '<span style="color: #0060FF;margin: 0px 5px;">' + sign_ist[i].wangwang + '</span>被标记为【<span style="color:#FE0000">'
                                + sign_ist[i].type + '</span>】</li></a>'
                            );
                        }

                        //鼠标的移入移出
                        if (data.data.qrcode) {
                            $('#jcz_qcc_scroll_erweima_img').attr('src', data.data.qrcode)
                            $(".jcz_qcc_scroll_seller_help").mouseover(function () {
                                $("#jcz_qcc_scroll_erweima_box").css('display', 'flex');
                            }).mouseout(function () {
                                $("#jcz_qcc_scroll_erweima_box").css('display', 'none');
                            });
                        }

                        setTimeout(() => {
                            sold_list_utils.rollingSign('.jcz_qcc_dowebok_sign')
                            sold_list_utils.rollingNotice('.jcz_qcc_dowebok_notice')
                        }, 500)
                    }
                );
            },
            //插入搜索全部按钮
            pushSearchAll: function () {
                return
                sold_list_utils.Net({
                    url: sold_list_urls.user_info,
                    type: 5,
                    parmas: {}
                }, function (data) {
                    if (data.ok) {
                        if (data.data.close_tbk_query == 0) {
                            let imgurl = sold_list_utils.getServerurl('plcx_img.png');
                            var searchAllhtml = '<img src="' + imgurl + '" id="jcz_qcc_search_all_img" style="width: 133px;height: 24px;margin-right: 10px;cursor: pointer">';
                            $(searchAllclass).prepend(searchAllhtml);
                            $(searchAllclass).css('display', 'flex');
                            $('#jcz_qcc_search_all_img').unbind().click(function () {
                                sold_list_utils.searchAllTk();
                            });
                        } else {
                        }
                    }
                })


            },
            //插入登录框
            pushLogin: function () {
                $('body').append(loginhtml);
                setTimeout(function () {
                    sold_list_utils.initLoginJs();
                    sold_list_utils.initPlch();
                    sold_list_utils.initBjbox();
                    //点击灰色部分关闭
                    $('.jcz_qcc_changesold_list_float').unbind().click(function () {
                        $('.jcz_qcc_changesold_list_float').css('display', 'none');
                    });
                    $('#jcz_qcc_changesold_float_right_login_box').unbind().click(function () {
                        event.stopPropagation();
                    });
                    $('#jcz_qcc_changesold_float_plcx_box').unbind().click(function () {
                        event.stopPropagation();
                    });
                    $('#jcz_qcc_changesold_float_allbj_box').unbind().click(function () {
                        event.stopPropagation();
                    });

                }, 200);

            },
            //初始化登录js
            initLoginJs: function () {
                changesoldlist_rightlogin = new Vue({
                    el: '#jcz_qcc_changesold_float_right_login_box',
                    data: {
                        isshow: false,
                        phone: '',
                        pwd: '',
                        seller_wangwang: '',
                        baseUrl: baseUrl,
                    },
                    methods: {
                        login: function () {
                            if (!this.phone) {
                                sold_list_utils.showMessage('请输入手机号')
                                return
                            }
                            if (this.phone.length != 11) {
                                sold_list_utils.showMessage('手机号不合法')
                                return
                            }
                            if (!this.pwd) {
                                sold_list_utils.showMessage('请输入密码')
                                return
                            }
                            if (!this.seller_wangwang) {
                                sold_list_utils.showMessage('缺少商家旺旺')
                                return
                            }
                            dialogutils.Net({
                                url: sold_list_urls.login,
                                type: 6,
                                parmas: {
                                    wangwang: changesoldlist_rightlogin.seller_wangwang,
                                    phone: changesoldlist_rightlogin.phone,
                                    password: changesoldlist_rightlogin.pwd,
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
                                        changesoldlist_rightlogin.isshow = false
                                        //给dialog设置id
                                        uid = saverequist.uid;
                                        changesoldlist_plcx.coin = saverequist.coin;
                                        sold_list_utils.showMessage('登录成功');
                                        //打开批量查询
                                        sold_list_utils.showPlcx();
                                    })
                                } else {
                                    sold_list_utils.showMessage(data.data);
                                }
                            })
                        },
                        getServerurl: function (url) {
                            return sold_list_utils.getServerurl(url);
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
            },
            //初始化批量查询js
            initPlch: function () {
                changesoldlist_plcx = new Vue({
                    el: '#jcz_qcc_changesold_float_plcx_box',
                    data: {
                        isshow: false,
                        list: [],
                        coin: 0,
                        issearch: 0,
                        is_select_all: 1,
                        close_tbk_query: 0,
                    },
                    methods: {
                        getServerurl: function (url) {
                            return sold_list_utils.getServerurl(url);
                        },
                        changeselectAll: function (is_select_all) {
                            if (is_select_all == 1) {//列表所有选中变成非选中
                                changesoldlist_plcx.is_select_all = 0;
                                for (let i = 0; i < changesoldlist_plcx.list.length; i++) {
                                    if (changesoldlist_plcx.list[i].is_canselect != -1) {
                                        changesoldlist_plcx.list[i].is_canselect = 0;
                                    }
                                }
                            } else {
                                changesoldlist_plcx.is_select_all = 1;
                                for (let i = 0; i < changesoldlist_plcx.list.length; i++) {
                                    if (changesoldlist_plcx.list[i].is_canselect != -1) {
                                        changesoldlist_plcx.list[i].is_canselect = 1;
                                    }
                                }
                            }
                        },
                        changeItemSelect: function (index) {
                            if (changesoldlist_plcx.list[index].is_canselect == 1) {
                                changesoldlist_plcx.list[index].is_canselect = 0;
                            } else {
                                changesoldlist_plcx.list[index].is_canselect = 1;
                            }
                        },
                        searchTbk: function (index) {
                            //隐藏当前
                            $('.jcz_qcc_changesold_list_float').css('display', 'none');
                            //拿到标题
                            let parents = $("div[class^='item-mod__trade-order___']").eq(index);
                            //拿到标题
                            let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                            let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                            let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                            let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                            let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                            let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                            sold_list_utils.openSearchwwDialog(1, wangwang, order_num, create_time, paynum, order_img, order_title);
                        },
                        //开始查询
                        startSearch: function () {
                            if (uid == 0) {
                                sold_list_utils.showLogin();
                                return
                            }
                            //剩余查询数量
                            let sycx = 0;
                            //0非淘宝客订单 1淘宝客订单 -1查询失败 -2等待查询
                            changesoldlist_plcx.list.map((item) => {
                                if (item.is_canselect == 1) {
                                    sycx++;
                                }
                            })
                            if (sycx == 0) {
                                sold_list_utils.showMessage('暂无可查询订单');
                                return
                            }
                            //修改按钮状态为进行中 防止重复点击
                            changesoldlist_plcx.issearch = 1;
                            //取出所有的订单号
                            let order_nums = [];
                            changesoldlist_plcx.list.map((item) => {
                                if (item.is_canselect == 1) {
                                    order_nums.push(item.ordernum);
                                }
                            })
                            let order_nums_string = JSON.stringify(order_nums);
                            sold_list_utils.Net({
                                url: sold_list_urls.batch_tbk_info,
                                type: 5,
                                parmas: {
                                    order_nums: order_nums_string
                                }
                            }, function (data) {
                                //修改按钮状态
                                changesoldlist_plcx.issearch = 0;
                                if (data.ok) {
                                    //修改当前弹窗列表数据
                                    let responselist = data.data;
                                    let list = changesoldlist_plcx.list;
                                    responselist.map((item) => {
                                        for (let i = 0; i < list.length; i++) {
                                            if (item.order_num == list[i].ordernum) {
                                                list[i].is_tbk = item.is_tbk;
                                                list[i].is_canselect = -1;
                                                break;
                                            }
                                        }
                                    })
                                    changesoldlist_plcx.list = list;
                                    //查询用户余额
                                    changesoldlist_plcx.getUserinfo();
                                    //修改淘宝列表数据
                                    changesoldlist_plcx.refushTbList(responselist);
                                } else {
                                    sold_list_utils.showMessage(data.data);
                                }
                            })
                        },
                        //充值
                        czClick: function () {
                            window.open(baseUrl + 'home/customer/v/info?type=1');
                        },
                        //刷新
                        refushClcik: function () {
                            changesoldlist_plcx.getWwOrder();
                            changesoldlist_plcx.getUserinfo();
                        },
                        refushTbList: function (list) {
                            let html = '';
                            <!--无淘客佣金-->
                            let wutaoke = "<div id='jcz_qcc_nav_div_wtk' class='jcz_qcc_nav_div_wtk' style=\"margin: -15px 0px;\n" +
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
                                "        <div id='jcz_qcc_nav_div_sytk' class='jcz_qcc_nav_div_sytk' style=\"margin: -15px 0px;\n" +
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
                            //拿到所有查询的淘宝列表item
                            let parentitem = $('.jcz_qcc_nav_div_ctk').parents("div[class^='item-mod__trade-order___']");
                            for (let i = 0; i < parentitem.length; i++) {
                                //获取每个item 下面的旺旺 和订单号
                                let ordernum = parentitem.eq(i).find(pushitenrightcalss).find('span')[2].innerHTML;
                                //循环所有的订单查询结果
                                list.map((item) => {
                                    if (item.order_num == ordernum) {
                                        //单条查询成功后才做操作
                                        if (item.is_tbk != -1) {
                                            //判断是否是淘宝客
                                            if (item.is_tbk == 0) {
                                                html = wutaoke;
                                            }
                                            if (item.is_tbk == 1) {
                                                html = shiyongtaoke;
                                            }
                                            //判断是否有查淘客按钮 防止重复添加
                                            if (parentitem.eq(i).find('#jcz_qcc_nav_div_ctk').length > 0) {
                                                //删除查淘客按钮
                                                parentitem.eq(i).find('#jcz_qcc_nav_div_ctk').remove();
                                                //添加对应的html
                                                parentitem.eq(i).find('.jcz_qcc_header_right').append(html);
                                            }

                                        }
                                    }
                                })
                            }
                            setTimeout(function () {
                                sold_list_utils.addbiaojiClick();
                            }, 1000)
                        },
                        //拿到列表旺旺号和订单
                        getWwOrder: function () {
                            //找到所有可查询的按钮
                            //可以查询的item
                            let list = [];
                            let item = $("div[class^='item-mod__trade-order___']");
                            for (let i = 0; i < item.length; i++) {
                                //获取每个item 下面的旺旺 和订单号
                                let ordernum = item.eq(i).find(pushitenrightcalss).find('span')[2].innerHTML;
                                let wangwang = item.eq(i).find("a[class^='buyer-mod__name___']").text();
                                let is_tbk = -2;//  0非淘宝客订单 1淘宝客订单 -1查询失败 -2等待查询
                                //有查淘客这个按钮 判断是否查询过
                                let is_canselect;
                                if (item.eq(i).find('.jcz_qcc_nav_div_ctk').length > 0) {
                                    is_canselect = 1;//-1不能选 0没选中 1选中
                                } else {
                                    is_canselect = -1;//-1不能选 0没选中 1选中
                                    //判断查询的状态
                                    if (item.eq(i).find('.jcz_qcc_nav_div_wtk').length > 0) { //无淘客
                                        is_tbk = 0;
                                    } else {
                                        is_tbk = 1;
                                    }
                                }
                                list.push({
                                    is_canselect: is_canselect,
                                    ordernum: ordernum,
                                    wangwang: wangwang,
                                    is_tbk: is_tbk
                                })
                            }
                            this.list = list;
                        },
                        //获取用户信息
                        getUserinfo: function () {
                            if (uid == 0) {
                                return
                            }
                            sold_list_utils.Net({
                                url: sold_list_urls.user_info,
                                type: 5,
                                parmas: {}
                            }, function (data) {
                                if (data.ok) {
                                    changesoldlist_plcx.coin = data.data.customer.coin;
                                }
                            })
                        },
                        //0非淘宝客订单 1淘宝客订单 -1查询失败 -2等待查询
                        getStarus: function (status) {
                            let newstatus = parseInt(status);
                            switch (newstatus) {
                                case -2:
                                    return '免费查询'
                                case -1:
                                    return '查询失败'
                                case 0:
                                    return '非淘宝客订单'
                                case 1:
                                    return '淘宝客订单'
                            }
                        }
                    },
                    created: function () {
                    },
                    mounted: function () {

                    },
                })

            },
            //当页标记汇总
            initBjbox: function () {
                changesoldlist_allbj = new Vue({
                    el: '#jcz_qcc_changesold_float_allbj_box',
                    data: {
                        isshow: false,
                        list: [],
                    },
                    methods: {
                        getServerurl: function (url) {
                            return sold_list_utils.getServerurl(url);
                        },
                        jumBjDetal(index) {
                            let parents = $("div[class^='item-mod__trade-order___']").eq(index);
                            //拿到标题
                            let wangwang = parents.find("a[class^='buyer-mod__name___']").text();
                            let order_num = parents.find(orderclass).find('span')[2].innerHTML;
                            let create_time = parents.find(orderclass).find('span')[5].innerHTML;
                            let paynum = parents.find("div[class^='price-mod__price___']").find('span')[1].innerHTML;
                            let order_img = parents.find("a[class^='production-mod__pic___']a").find('img')[0].src;
                            let order_title = parents.find("td[class^='sol-mod__no-br___']").find('div').eq(2).find('a').eq(0).text();
                            sold_list_utils.openSearchwwDialog(0, wangwang, order_num, create_time, paynum, order_img, order_title);
                        },
                        refushList(wangwang_list, orders, wangwangs) {
                            let list = [];
                            for (let i = 0; i < orders.length; i++) {
                                let item = {};
                                item.order = orders[i];
                                item.wangwang = wangwangs[i];
                                item.count = 0;
                                for (let j = 0; j < wangwang_list.length; j++) {
                                    if (wangwang_list[j].wangwang.trim() == item.wangwang.trim()) {
                                        item.count = wangwang_list[j].count;
                                    }
                                }
                                list.push(item);
                            }
                            this.list = list;
                        }
                    },
                    created: function () {
                    },
                    mounted: function () {

                    },
                })

            },
            //查询所有淘客
            searchAllTk: function () {
                chrome.extension.sendMessage({type: 3}, (result) => {
                    uid = result.uid;
                    token = result.token;
                    if (uid == 0) {
                        sold_list_utils.showLogin();
                        return
                    }
                    sold_list_utils.showPlcx();
                });
            },
            //显示登录框
            showLogin: function () {
                $('.jcz_qcc_changesold_list_float').css('display', 'flex');
                changesoldlist_rightlogin.isshow = true;
                changesoldlist_plcx.isshow = false;
            },
            //显示批量查询
            showPlcx: function () {
                $('.jcz_qcc_changesold_list_float').css('display', 'flex');
                changesoldlist_rightlogin.isshow = false;
                changesoldlist_plcx.isshow = true;
                changesoldlist_plcx.is_select_all = 1;
                changesoldlist_plcx.getWwOrder();
                changesoldlist_plcx.getUserinfo();
            },
            //显示标记汇总
            showBjhz: function () {
                $('.jcz_qcc_changesold_list_float').css('display', 'flex');
                $('#jcz_qcc_changesold_float_allbj_box').css('display', 'flex');
                changesoldlist_allbj.isshow = true;
            },

            //获取服务器地址方便后期改
            getServerurl: function (url) {
                return baseUrl + 'assets/plug/' + url
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

            //上传旺旺
            uploadwangwang: function () {
                //抓取商家旺旺
                if (wangwang) {
                    chrome.extension.sendMessage({
                        type: 6,
                        url: sold_list_urls.upload_wangwang,
                        parmas: {
                            wangwang: wangwang,
                        }
                    }, (data) => {

                    });
                }
            },
            //获取本地商家用户信息
            getlocalsellerinfo: function () {
                chrome.extension.sendMessage({type: 3}, function (result) {
                    uid = result.uid;
                    token = result.token;
                });
            },

            /*错误提示*/
            errText: function (err, goal) {
                $(goal).text(err)
                setTimeout(function () {
                    $(goal).text('')
                }, 3000)
            },
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
            /**
             * 打印日志
             * @param str
             */
            Log: function (str) {
                isCc && console.log(str)
            },
            /**
             * 时间格式化
             * @param time    当前时间毫秒
             * @param format  格式化输出格式  yyyy-MM-dd HH:mm:ss
             * @constructor
             */
            toDate: function (time, format) {
                let t = new Date(parseInt(time) * 1000);
                let tf = function (i) {
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

            /**
             * 字符串是否包含
             */
            isContains: function (str, substr) {
                if (!str || !substr) {
                    return false;
                }
                return str.indexOf(substr) >= 0;
            },
            //网络请求
            Net: function (netprams, response, isshowLoading = false) {
                chrome.extension.sendMessage(netprams, (data) => {
                    response(data);
                    if (!data.ok) {
                        if (data.code == '99999') {
                            chrome.extension.sendMessage({
                                type: 4,
                            }, (data) => {
                                uid = 0;
                            })
                            sold_list_utils.showMessage(data.data);
                            //登录失效后重新pushhtml
                            setTimeout(function () {
                                sold_list_utils.showLogin();
                            }, 2000)
                            return
                        }
                    }
                    //关闭初始化时的dialog弹窗
                });
            },
            /**
             * 判断是否登录
             */
            checkUpdata: function () {
                setTimeout(function () {

                    chrome.extension.sendMessage({type: 9}, (result) => {
                        if (!result) {
                            //判断今天是否提醒过
                            let saveupdatatime = localStorage.getItem('jcz_qcc_checkupdatatime', sold_list_utils.getdatstartTime());
                            //今天的起点时间 是否大于存储的时间
                            if (sold_list_utils.getdatstartTime() > saveupdatatime) {
                                $('.jcz_qcc_upgrade').css('display', 'flex');
                                //禁止时间冒泡
                                $('#jcz_qcc_upgrade_content').unbind().click(function () {
                                    event.stopPropagation();
                                });
                                //去官网
                                $('#jcz_qcc_upgrade_go').unbind().click(function () {
                                    window.open(baseUrl + 'home/download');
                                    $('.jcz_qcc_upgrade').css('display', 'none');
                                });
                                //隐藏
                                $('#jcz_qcc_upgrade_cancle').unbind().click(function () {
                                    $('.jcz_qcc_upgrade').css('display', 'none');
                                });
                                //隐藏
                                $('.jcz_qcc_upgrade').unbind().click(function () {
                                    $('.jcz_qcc_upgrade').css('display', 'none');
                                });
                                localStorage.setItem('jcz_qcc_checkupdatatime', sold_list_utils.getdatstartTime());
                            }
                        }
                    });
                }, 2000)
            },

            /**
             * 获取今天起点的时间戳
             */
            getdatstartTime() {
                var now = new Date().setHours(0, 0, 0, 0);
                var time = parseInt(now / 1000);
                return time
            }

        }
        // 获取uid token
        chrome.extension.sendMessage({type: 3}, (result) => {
            uid = result.uid;
            token = result.token;

            wangwang = $(sellerwwclass).text();
            if (!wangwang) {
                wangwang = $(tbsellerwwclass).text();
            }
            //1上传旺旺
            sold_list_utils.uploadwangwang();
            //2插入已卖出列表右边数据
            sold_list_utils.pushList();
            // sold_list_utils.pushDialog();
            //设置下一页点击事件 重新刷新数据
            sold_list_utils.readClick();
            //插入订单上面的滚动内容和公告
            sold_list_utils.scrollHtml();
            //插入批量查询按钮
            sold_list_utils.pushSearchAll();
            //插入登录框
            sold_list_utils.pushLogin();
            //判断是否更新
            sold_list_utils.checkUpdata();
        });
    }
}
