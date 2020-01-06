var baseServerUrl = 'https://demo.22com.cn/BangKeServer/';//服务器域名或ip

var scroll_html = ` <div style='position:relative;display: flex;flex-direction: row;border: solid #E6E6E6 1px;margin-top: 7px;margin-bottom: 5px;'
                                         class="jcz_qcc_scroll_label">
                                        <!--左边-->
                                        <div style="width: 250px;height: 56px;display: flex;flex-direction: row;align-items: center;border-right: solid #E6E6E6 1px;">
                                            <img src="` + baseServerUrl + `app/public/assets/plug/bangke_logo.png"
                                                 style="width:108px;height: 31px;margin-right: 21px;margin-left: 14px">
                                            <div class="jcz_qcc_scroll_seller_help"
                                                 style="display: flex;align-items: center;flex-direction: row;position: relative;cursor: pointer">
                                                <img src="` + baseServerUrl + `app/public/assets/plug/erweima.png"
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
                                                     src="` + baseServerUrl + `app/public/assets/plug/laba.png"
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
                                        <div style="width: 123px;height: 56px;display: flex;flex-direction: column ;align-items: center;justify-content: center">
                                            <div style="display: flex;flex-direction: row;align-items: center">
                                                <img src="` + baseServerUrl + `app/public/assets/plug/item_logo.png"
                                                     style="width: 12px;height: 12px;margin-right: 5px">
                                                <span style="font-size: 12px;color: #333333">当页标记汇总：</span>
                                            </div>
                                            <span style="font-size: 12px;color: #999999" class="jcz_qcc_report_times">暂无</span>
                                        </div>
                                    </div>`;
