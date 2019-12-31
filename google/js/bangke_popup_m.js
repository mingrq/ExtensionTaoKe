var _this = null;
window.onload = function () {
    var vm = new Vue({
        el: '.vue_demo',
        data: function () {
            return {
                queryOrder: '',
                queryWangWang: '',
                logo: '',
                qq: '',
                list: [],
                rollSet: null,
                roll: -1,
                customer: null,
            }
        },
        methods: {
            initData: function () {
                chrome.extension.sendMessage({
                    type: 5,
                    url: 'https://www.huopengpeng.com/plug/index/popup',
                    parmas: {}
                }, (data) => {
                    if (data.ok) {
                        _this.queryOrder = data.data.queryOrder;
                        _this.queryWangWang = data.data.queryWangWang;
                        _this.qq = data.data.qq;
                        _this.logo = data.data.logo;
                        _this.doList(data.data)
                    }
                });
            },
            doList: function (data) {
                for (var i = 0; i < data.list.length; i++) {
                    $('.qcc_vue_list').find('ul').eq(0).prepend(
                        '<a target="_blank" href="' + data.list[i].href + '">' +
                        '<li style="height:40px;line-height:40px;color:#000;font-size: 12px;display: flex;flex-direction: row;' +
                        'align-content: center;justify-content: center">' +
                        '' + this.toDate(data.list[i].add_time, 'yyyy-MM-dd HH:mm:ss') +
                        '<span style="color: #0060FF;margin: 0px 5px;">' + data.list[i].wangwang + '</span>被标记为【<span style="color:#FE0000">'
                        + data.list[i].type + '</span>】</li></a>'
                    );
                }
                var rollHeight = $('.qcc_vue_list').find('ul').eq(0).find('li').eq(0).height();
                var rollLength = $('.qcc_vue_list').find('ul').eq(0).find('li').length;
                var $roll = $('.qcc_vue_list').find('ul').eq(0);
                if (rollLength > 1) {
                    _this.rollSet = setInterval(function () {
                        _this.rollTime($roll, rollHeight, rollLength)
                    }, 4800)
                    $roll.hover(function () {
                        clearInterval(_this.rollSet);			//清除自动滑动动画
                    }, function () {
                        _this.rollSet = setInterval(function () {
                            _this.rollTime($roll, rollHeight, rollLength)
                        }, 4800);	//继续执行动画
                    })
                }
            },
            rollTime: function ($roll, rollHeight, rollLength) {
                if (_this.roll == -1) {
                    _this.roll = rollHeight;
                }
                if (_this.roll == 0) {
                    $roll.css('marginTop', '0px');
                }
                var rollMax = parseInt(rollHeight) * parseInt(rollLength) - parseInt(rollHeight);
                $roll.animate({
                    marginTop: '-' + _this.roll + 'px'
                }, '800', function () {
                    if (_this.roll < rollMax) {
                        _this.roll = _this.roll + rollHeight
                    } else {
                        _this.roll = 0;
                    }
                })
            },
            /**
             * 时间格式化
             * @param time    当前时间毫秒
             * @param format  格式化输出格式  yyyy-MM-dd HH:mm:ss
             * @constructor
             */
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
            /*获取用户信息*/
            initCustomerInfo: function () {
                chrome.extension.sendMessage({
                    type: 5,
                    url: 'https://www.huopengpeng.com/plug/index/info',
                    parmas: {}
                }, (data) => {
                    if (data.ok) {
                        _this.customer = data.data;
                    }
                });
            },
            logout: function () {  //退出登录
                $('.customer_div').hide();
                _this.customer = null;
                chrome.extension.sendMessage({type: 4,});
            },
        },
        mounted: function () {
            _this.initData();
            _this.initCustomerInfo();
        },
        created: function () {
            _this = this;
        }
    });

}

