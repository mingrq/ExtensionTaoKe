var jcz_qcc_errorww_href = window.location.href;
var jcz_qcc_errorww_top_Href = top.location.href;
var jcz_qcc_errorww_isCc = false;//正式 false 测试 true

//是否正式 如果正式则请求网上的js 否则调试本地
if (jcz_qcc_errorww_isCc) {
    //如果请求的页面与浏览器页面相同则执行(防止包含iframe重复请求js)
    if (jcz_qcc_errorww_href && jcz_qcc_errorww_href == jcz_qcc_errorww_top_Href) {
        //传入对应的url 获取对应的js
        //截取字符串前面一段
        jcz_qcc_errorww_href = jcz_qcc_errorww_href.split('?')[0];
        chrome.extension.sendMessage({type: 1, href: jcz_qcc_errorww_href}, (data) => {
        });
    }
}
//服务器代码
else {
    if (jcz_qcc_errorww_href && jcz_qcc_errorww_href == jcz_qcc_errorww_top_Href) {
        let err_baseUrl = 'https://www.qinchacha.com/'; //网络请求测试地址
        //let err_baseUrl = 'http://192.168.0.111:7001/'; //网络请求测试地址
        let saveuploadingkey = 'jcz_qcc_plug_uploading';
        let ismystart = false;//判断是否当前页启动的自动上传旺旺

        //这个地方只写测试 未来放到服务器上直接下载下来
        var errorww_urls = {
            report: err_baseUrl + 'plug/punish/report',//上报违规记录
            get_punish: err_baseUrl + 'plug/punish/get_punish',//获取单个违规记录
            report_order: err_baseUrl + 'plug/punish/report/order',//上报违规订单
            get_order: err_baseUrl + 'plug/punish/get_order',//获取单个订单
            report_info: err_baseUrl + 'plug/punish/report/info',//获取单个订单
        }


        let err_wangwang = null;

        let punish_id = ''; //获取的服务器的违规记录id
        let punish_size = 0; //同样的违规记录id重复出现的次数
        let order_id = ''; //获取的服务器的订单id
        let order_size = 0; //同样的订单id重复出现的次数

        var errorww_utils = {
            // 判断是否登录
            checkLogin: function () {
                let sellerwwclass = "span[class^=sn-user-nick]"; //天猫店 商家旺旺
                let tbsellerwwclass = "a[class^=user-nick]"; //淘宝店 商家旺旺
                let tmsellerwwclass = "a[class^=j_UserNick]"; //淘宝店 商家旺旺
                err_wangwang = $(sellerwwclass).text();
                if (!err_wangwang) {
                    err_wangwang = $(tbsellerwwclass).text();
                }
                if (!err_wangwang) {
                    err_wangwang = $(tmsellerwwclass).text();
                }
                if (err_wangwang.length > 0) {
                    //判断是否正在上传
                    let isuploading = localStorage.getItem(saveuploadingkey) || '';
                    if (!isuploading) {
                        ismystart = true;
                        localStorage.setItem(saveuploadingkey, 1);
                        //先上传违规信息
                        errorww_utils.getAllOrderPage();
                        setTimeout(function () {
                            //获取违规记录下的所有订单
                            errorww_utils.get_punish();
                        }, 6000);
                        setTimeout(function () {
                            //获取订单里面所有的旺旺
                            errorww_utils.getOrder();
                        }, 10000)
                    }

                }
            },

            /**
             * 请求一共有多少页
             */
            getAllOrderPage: function () {
                //待处理违规
                //取第一页 拿到总数 下一步分页请求用到
                let wgpage = 0;
                let wgurl = 'https://healthcenter.taobao.com/home/json/GetPunishHistory.json?page=1&startTime=&endTime=&pointRange=0%2C1%2C2%2C5&_ksTS=' + Math.round(new Date()) + '_23&callback=jsonp24'
                errorww_utils.Net({url: wgurl, type: 'get'}, function (data) {
                    if (data.ok) {
                        if (data.data.punish_history_list.success) {
                            if (data.data.punish_history_list.pageDO) {
                                let count = parseInt(data.data.punish_history_list.pageDO.totalCount);
                                wgpage = Math.ceil(count / parseInt(data.data.punish_history_list.pageDO.pageSize));
                                setTimeout(function () {
                                    errorww_utils.getAllOrder(wgpage, 0);
                                }, 1000)
                            }
                        }
                    } else {
                    }
                });
                //待处理管控
                let gkpage = 0;
                let gkurl = 'https://healthcenter.taobao.com/home/json/get_punish_history.json?page=1&startTime=&endTime=&_ksTS=' + Math.round(new Date()) + '_23&callback=jsonp24&pointRange=3'
                setTimeout(function () {
                    errorww_utils.Net({url: gkurl, type: 'get'}, function (data) {
                        if (data.ok) {
                            if (data.data.punish_history_list.success) {
                                let count = parseInt(data.data.punish_history_list.pageDO.totalCount);
                                gkpage = Math.ceil(count / parseInt(data.data.punish_history_list.pageDO.pageSize));
                                setTimeout(function () {
                                    errorww_utils.getAllOrder(0, gkpage);
                                }, 1500)
                            }
                        } else {
                        }
                    });
                }, 1000)
            },
            /**
             * 获取所有的违规记录
             */
            getAllOrder: function (wgpage, gkpage) {
                //获取所有违规记录订单号
                let punish_ids = [];
                let wgtype = ['虚假交易'];
                // 待处理违规
                let i = 1;
                let itemtime = 2000;
                let wginterval = setInterval(function () {
                    if (i < wgpage + 1) {
                        let url = 'https://healthcenter.taobao.com/home/json/GetPunishHistory.json?page=' + i + '&startTime=&endTime=&pointRange=0%2C1%2C2%2C5&_ksTS=' + Math.round(new Date()) + '_23&callback=jsonp24'
                        errorww_utils.Net({url: url, type: 'get'}, function (data) {
                            if (data.ok) {
                                if (data.data.punish_history_list.success) {
                                    data.data.punish_history_list.module.map((item) => {
                                        if (errorww_utils.inArray(wgtype, item.ruleTypeStr)) {
                                            punish_ids.push(item.punishId);
                                        }
                                    })
                                }
                            }
                        });
                        i++;
                    } else {
                        clearInterval(wginterval);
                    }
                }, itemtime);
                //待处理管控
                let k = 1;
                let gktype = ['天猫销量评价管理规则'];
                let gkinterval = setInterval(function () {
                    if (k < gkpage + 1) {
                        let url = 'https://healthcenter.taobao.com/home/json/get_punish_history.json?page=' + k + '&startTime=&endTime=&_ksTS=' + Math.round(new Date()) + '_23&callback=jsonp24&pointRange=3'
                        errorww_utils.Net({url: url, type: 'get'}, function (data) {
                            if (data.ok) {
                                if (data.data.punish_history_list.success) {
                                    data.data.punish_history_list.module.map((item) => {
                                        if (errorww_utils.inArray(gktype, item.ruleTypeStr)) {
                                            punish_ids.push(item.id);
                                        }
                                    })
                                }
                            }
                        });
                        k++;
                    } else {
                        clearInterval(gkinterval);
                    }
                }, itemtime);

                let time = 0;
                if (wgpage < gkpage) {
                    time = itemtime * gkpage + 500;
                } else {
                    time = itemtime * wgpage + 500;
                }
                console.log(time);
                setTimeout(function () {
                    errorww_utils.reportPunish(punish_ids);
                }, time)
            },

            /**
             * 上传违规记录
             * @param punish_ids
             */
            reportPunish: function (punish_ids) {
                chrome.extension.sendMessage({
                    type: 6,
                    url: errorww_urls.report,
                    parmas: {wangwang: err_wangwang, punish_ids: JSON.stringify(punish_ids)}
                }, (data) => {
                });
            },

            /**
             * 获取单个违规记录
             */
            get_punish: function () {
                chrome.extension.sendMessage({
                    type: 5,
                    url: errorww_urls.get_punish,
                    parmas: {wangwang: err_wangwang}
                }, (data) => {
                    if (data.ok) {
                        if (data.data.punish_id) {
                            //判断重复出现的次数
                            if (punish_size < 3) {
                                setTimeout(function () {
                                    errorww_utils.get_punish();
                                }, 3000)
                                errorww_utils.searchAllorder(data.data.punish_id);
                            }
                            if (data.data.punish_id == punish_id) {
                                punish_size++;
                            } else {
                                punish_id = data.data.punish_id;
                                punish_size = 0;
                            }
                        }
                    }
                });
            },

            /**
             * 拿到违规记录下所有的订单
             * @param successids
             */
            searchAllorder: function (punishId) {
                let allorderid = [];
                let url = 'https://healthcenter.taobao.com/home/json/get_affect_order_list.do?pageSize=10000&page=1&_ksTS=' + Math.round(new Date()) + '_93&callback=jsonp94&punishId=' + punishId + '&type=3'
                errorww_utils.Net({url: url, type: 'get'}, function (data) {
                    if (data.ok) {
                        if (data.data.module.data) {
                            data.data.module.data.map((item) => {
                                if (item.editUrl) {
                                    let detalid = item.editUrl.split('bizOrderId=')[1];
                                    if (detalid) {
                                        allorderid.push(detalid);
                                    }
                                }
                            })
                            errorww_utils.upLoadOrder(punishId, allorderid);
                        }
                    } else {
                    }
                });
            },

            /**
             * 上传违规记录对应的订单号
             * @param punishId
             * @param orderids
             */
            upLoadOrder: function (punishId, orderids) {
                chrome.extension.sendMessage({
                    type: 6,
                    url: errorww_urls.report_order,
                    parmas: {wangwang: err_wangwang, punish_id: punishId, order_ids: JSON.stringify(orderids)}
                }, (data) => {
                });
            },

            /**
             * 获取单个违规订单id
             */
            getOrder: function () {
                chrome.extension.sendMessage({
                    type: 5,
                    url: errorww_urls.get_order,
                    parmas: {wangwang: err_wangwang}
                }, (data) => {
                    if (data.ok) {
                        if (data.data.order_id) {
                            //判断同样订单id出现的次数
                            if (order_size < 3) {
                                setTimeout(function () {
                                    errorww_utils.getOrder();
                                }, 5000)
                                setTimeout(function () {
                                    errorww_utils.searchWw(data.data.order_id);
                                }, 3000)
                            }
                            if (data.data.order_id == order_id) {
                                order_size++;
                            } else {
                                order_id = data.data.order_id;
                                order_size = 0;
                            }
                        }
                    }
                });

            },

            /**
             * 获取订单里面的旺旺
             * @param orderid
             */
            searchWw: function (orderid) {
                let wangwang = '';
                let url = 'https://tradearchive.taobao.com/trade/detail/trade_item_detail.htm?biz_order_id=' + orderid;
                chrome.extension.sendMessage({
                    type: 9,
                    method: 'get',
                    url: url,
                    parmas: {}
                }, (data) => {
                    try {
                        if (data.response.data) {
                            let data1 = data.response.data.split('<span class="nickname">')[1];
                            let data2 = data1.split('</span>')[0];
                            wangwang = data2;
                            errorww_utils.upLoadReportInfo(orderid, wangwang)
                        }
                    } catch (e) {
                    }
                });
            },
            /**
             * 上传违规记录对应的旺旺
             * @param punishId
             * @param orderids
             */
            upLoadReportInfo: function (orderid, wangwang) {
                chrome.extension.sendMessage({
                    type: 6,
                    url: errorww_urls.report_info,
                    parmas: {tb_account: wangwang, order_id: orderid}
                }, (data) => {
                });
            },


            //获取服务器地址方便后期改
            getServerurl: function (url) {
                return err_baseUrl + 'assets/plug/' + url
            },
            Net: function (parms, getresponse) {
                axios({
                    url: parms.url,
                    method: parms.type,
                    timeout: 10 * 1000,
                    responseType: 'text',
                }).then((response) => {
                    let data = response.data;
                    if (data) {
                        let data1 = data.split('({')[1];
                        data1 = '{'+data1;
                        let data2 = data1.split('}}})')[0];
                        data2 =data2+'}}}';
                        getresponse({ok: 1, data: JSON.parse(data2)});
                    } else {
                        getresponse({ok: 0});
                    }

                }).catch(function (error) {
                    console.log(error);
                });
            },
            /**
             * 数组是否包含某个元素
             * @param arr
             * @param obj
             * @returns {boolean}
             */
            inArray: function (arr, obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] == obj) {
                        return true;
                    }
                }
                return false;
            }

        }
        errorww_utils.checkLogin();
        //当前页启动的情况下 关闭自动上传旺旺
        window.onbeforeunload = function (event) {
            if (ismystart) {
                localStorage.setItem(saveuploadingkey, '')
            }
        }
    }
}
