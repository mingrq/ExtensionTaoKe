var m_advert_href = window.location.href;
var m_advert_top_Href = top.location.href;
var m_advert_isCc = false;//正式 false 测试 true

var m_last_refresh_time = 0; //上次刷新广告时间
var m_last_mouse_move_time = 0; //客户上次鼠标移动时间
var m_timer = null;


//是否正式 如果正式则请求网上的js 否则调试本地
if (m_advert_isCc) {
    //如果请求的页面与浏览器页面相同则执行(防止包含iframe重复请求js)
    if (m_advert_href && m_advert_href == m_advert_top_Href) {
        //传入对应的url 获取对应的js
        //截取字符串前面一段
        m_advert_href = m_advert_href.split('?')[0];
        chrome.extension.sendMessage({type: 1, href: m_advert_href}, (data) => {
        });
    }
}
//服务器代码
else {
    if (m_advert_href == m_advert_top_Href) {
        let baseUrl = 'https://www.qinchacha.com/'; //网络请求测试地址
        //let baseUrl = 'http://192.168.0.111:7001/'; //网络请求测试地址

        //这个地方只写测试 未来放到服务器上直接下载下来
        var advert_urls = {
            advert: baseUrl + 'advert/index/advert',
            advert_ckick: baseUrl + 'advert/index/click',
        }

        var billhtml = '<div id="jcz_qinchacha-advert-div"\n' +
            '     style="width: 100%;height: 0px;align-items: center;position: relative; display: none ;cursor: pointer>\n' +
            '    <a href=""\n' +
            '       class="m_plug_adv_herf"\n' +
            '       style="width: 100%;height: 100%;text-decoration: none ;    display: block;;color :#ffffff;"\n' +
            '       target="_blank"\n' +
            '       adv_id="">\n' +
            '        <div style="height: 100%;background-size: cover ;background:  no-repeat center center;cursor: pointer"></div>\n' +
            '    </a><span class="jcz_qinchacha-advert-close"\n' +
            '              style="position: absolute;width: 20px;height: 20px;    line-height: 20px;color: #ffffff;cursor: pointer;top: 15px;right: 30px;    ;background: #666;text-align: center">X</span>' +
            '</div>\n'

        var advert_utils = {
            //初始化广告
            readBill: function () {


                //关闭广告则不执行定时间任务
                if ($('#jcz_qinchacha-advert-div').length == 0) {
                    return;
                }
                if ((Date.now() - m_last_refresh_time) < 10000) {
                    return;
                }

                //鼠标上次移动时间间隔 如果1分钟之没有移动，则不刷新广告
                if ((Date.now() - m_last_mouse_move_time) > 1000 * 60) {
                    // m_timer = setTimeout(() => {
                    //     advert_utils.readBill();
                    // }, 10000)
                    return;
                }

                if (m_timer) {
                    clearTimeout(m_timer);
                    m_timer = null;
                }

                var adv = $('.m_plug_adv_herf').attr('adv_id');
                chrome.extension.sendMessage({
                    type: 5,
                    url: advert_urls.advert,
                    parmas: {
                        size: '1920X60',
                        href: m_advert_href
                    }
                }, (data) => {
                    if (data.ok) {
                        $('.m_plug_adv_herf').show()
                        $('.m_plug_adv_herf').css({
                            height: '60px',
                        })
                        $('.m_plug_adv_herf').attr('href', data.data.link)
                        $('.m_plug_adv_herf').attr('stalls_id', data.data.stalls_id)
                        $('.m_plug_adv_herf').attr('image_id', data.data.image_id)
                        $('.m_plug_adv_herf div').css('background', 'url(' + data.data.image + ') center center')
                        $('#jcz_qinchacha-advert-div').click(function () {
                            advert_utils.clickBill();
                        })
                        $('.jcz_qinchacha-advert-close').click(function (oEvent) {
                            $('#jcz_qinchacha-advert-div').remove();
                            oEvent.cancelBubble = true;
                            oEvent.stopPropagation();
                        })

                        $('.qcc_tag').click(function (oEvent) {
                            oEvent.cancelBubble = true;
                            oEvent.stopPropagation();
                        });

                        m_last_refresh_time = Date.now();

                        //开启定时任务
                        // m_timer = setTimeout(() => {
                        //     advert_utils.readBill();
                        // }, 10000)
                    } else {
                        $('.m_plug_adv_herf').remove();
                    }

                });
            },
            //头顶广告
            clickBill: function () {
                var stalls_id = $('.m_plug_adv_herf').attr('stalls_id')
                var image_id = $('.m_plug_adv_herf').attr('image_id')
                if (stalls_id == 0 || image_id == 0) {
                    return
                }
                window.open($('.m_plug_adv_herf').attr('href'));
                chrome.extension.sendMessage({
                    type: 6,
                    url: advert_urls.advert_ckick,
                    parmas: {
                        advert_id: stalls_id,
                        image_id: image_id,
                    }
                }, (data) => {
                })
            },
        }
        //请求广告数据
        $('#jcz_qinchacha-advert-div').remove();
        $('body').prepend(billhtml);
        m_last_mouse_move_time = Date.now();
        $(document).mousemove(function (event) {
            m_last_mouse_move_time = Date.now();
            // console.log('鼠标移动')
        });

        advert_utils.readBill();
    }
}