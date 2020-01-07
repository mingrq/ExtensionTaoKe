/**
 */

const prefix = 'm_plug_';
const types = [
    1,// 获取远程js
    2,// 头部调用页面的旺旺号 或者存储旺旺
    3, // 页面调用头部获取用户信息 uid token  或者存储信息
    4, // 清除 uid token
    5, // 执行网络请求
    6,//执行post网络请求
    7,//保存到本地查询的旺旺
    8,//获取到本地查询的旺旺
]

let uid = 0;
let token = '';
const isSB = false; //是否加密
const testing = 1; //  0 不显示测试日志， 显示测试日志 1 ,

const sb = 'm666_666';


const Tools = {

    /**
     * 网络请求
     * @param method  get post
     * @param url 请求url
     * @param param 请求参数
     * @param headers 请求头
     * @param callback 回调函数
     */
    doHttp(method = 'get', url, param, headers = {}, callback) {
        axios({
            url: url,
            method: method,
            data: param,
            timeout: 10 * 1000,
            responseType: 'text',
            headers: headers || {},
        }).then((response) => {
            callback && callback.call(this, response)
        }).catch((error) => {
            console.log(error)
            callback && callback.call(this, null)
        });
    },

    /**
     * get  请求
     * @param vue
     * @param url
     * @param param
     * @param callback
     */
    doGet(url, param, callback, loading = false) {
        if (!param) param = {};
        param['_'] = Date.now();
        if (isSB) {
            for (let key in param) {
                let value = param[key];
                value = Tools.AESEncrypt(value.toString());
                param[key] = encodeURIComponent(value);
            }
        }
        if (loading) {
            //  _this.loadingShow(vue)
        }
        axios.get(url, {
            params: param,
            timeout: 10 * 1000,
            responseType: 'text',
            headers: Tools.getHeader(uid, token),
        }).then((response) => {
            // 隐藏
            if (loading) {
                // _this.loadingHide(vue)
            }
            let data = response.data;
            if (isSB) {
                data = Tools.AESDecrypt(data);
            }
            if (!Tools.is_json(data)) {
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
        }).catch((error) => {
            // 隐藏
            if (loading) {
                //   _this.loadingHide(vue)
            }
            callback && callback.call(this, false, '服务器堵车了')
        });
    },

    getHeader(uid, token) {
        let header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            encry: isSB ? Math.ceil(Math.random() * Date.now()) : 0,
            uid: isSB ? (Tools.AESEncrypt(uid.toString())) : uid,
            token: isSB ? (Tools.AESEncrypt(token.toString())) : token,
        }
        return header;
    },

    /**
     * post 请求
     * @param vue
     * @param param
     * @param callback
     */
    doPost(url, param, callback, loading = false) {
        if (!param) param = {};
        let formData = new FormData();
        if (isSB) {  //加密
            for (let key in param) {
                let value = param[key];
                value = Tools.AESEncrypt(value.toString())
                value = (value)
                formData.append(key, value);
            }
        }
        //不加密
        else {
            for (let key in param) {
                let value = param[key];
                value = (value)
                formData.append(key, value);
            }
        }
        if (loading) {
            // _this.loadingShow(vue)
        }
        axios({
            url: url,
            method: 'POST',
            data: formData,
            timeout: 10 * 1000,
            responseType: 'text',
            headers: Tools.getHeader(uid, token)
        }).then((response) => {
            if (loading) {
                //   _this.loadingHide(vue)
            }
            let data = response.data;
            if (isSB) {
                data = Tools.AESDecrypt(data);
            }
            if (!Tools.is_json(data)) {
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
            if (loading) {
                //  _this.loadingHide(vue)
            }
            callback && callback.call(this, false, '服务器堵车了')
        });

    },

    /**
     * 上传文件
     * @param vue
     * @param files
     * @param callback
     */
    postFile(url, files, param, callback, loading = false) {
        if (!param) param = {};
        let formData = new FormData();
        if (isSB) {  //加密
            for (let key in param) {
                let value = param[key];
                value = Tools.AESEncrypt(value.toString())
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
        for (let key in files) {
            let file = files[key];
            if (Tools.isNull(file)) {
                continue;
            }
            formData.append(key, file);
        }

        if (loading) {
            // _this.loadingShow(vue)
        }
        axios({
            url: url,
            method: 'post',
            data: formData,
            timeout: 10 * 1000,
            responseType: 'text',
            headers: Tools.getHeader(uid, token)
        }).then((response) => {
            if (loading) {
                //  _this.loadingHide(vue)
            }
            let data = response.data;
            if (isSB) {
                data = Tools.AESDecrypt(data);
            }
            if (!Tools.is_json(data)) {
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
            if (loading) {
                // _this.loadingHide(vue)
            }
            callback && callback.call(this, false, '服务器堵车了')
        });

    },
    /*判断json*/
    is_json(obj) {
        var isjson = typeof (obj) == "object" &&
            Object.prototype.toString.call(obj).toLowerCase() == "[object object]" &&
            !obj.length;
        return isjson;
    },

    /**
     * aes解密方法
     * @param data 密文
     * @returns  明文
     */
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

    /**
     * aes加密方法
     * @param data  明文
     * @returns  密文
     */
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
    /**
     * 拼接 get 方式的参数
     * @param params
     */
    buildGetParms: function (params) {
        let get = '?';
        if (typeof params == 'object') {
            for (var key in params) {
                let value = params[key] + '';
                get += key + '=' + encodeURIComponent(Tools.AESEncrypt(value)) + '&'
            }
            return get;
        } else {
            return get;
        }
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
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    const type = parseInt(request.type) || 0;
    switch (type) {  //初始化数据
        case 1://根据对应的页面去请求js
            $.ajax({
                type: "POST",
                // url: 'https://www.zhangguishuo.net/plug/index/initJs',
                // url: 'http://47.99.76.134:7001/plug/index/initJs',
                url: 'https://www.huopengpeng.com/plug/index/initJs',
                data: {href: request.href},
                dataType: 'json',
                async: true,
                success: function (msg) {
                    if (msg.data.length == 0) return;
                    //请求js后将js传给对应的页面去插入(解决页面里面网络请求回来不能插入js的问题)
                    //传回来的脚本里面包含请求html的js
                    for (let item of msg.data) {
                        chrome.tabs.executeScript(null, {
                            code: item.code,
                            allFrames: false
                        });
                    }

                },
                error: function (msg) {
                }
            });
            break;
        case 2: //头部调用页面的旺旺号 或者存储旺旺  as,爱上尽可能地，123
            var wangwang = request.token || "";
            if (!wangwang) {
                wangwang = localStorage.getItem(prefix + 'wangwang') || '';
            } else {
                localStorage.setItem(prefix + 'wangwang', wangwang);
            }
            sendResponse({
                wangwang: wangwang
            });
            break;
        case 3:  // 页面调用头部获取用户信息
            uid = request.uid || 0;
            token = request.token || "";

            if (uid == 0) {
                uid = localStorage.getItem(prefix + 'uid') || 0;
            } else {
                localStorage.setItem(prefix + 'uid', uid + '');
            }
            if (!token) {
                token = localStorage.getItem(prefix + 'token') || '';
            } else {
                localStorage.setItem(prefix + 'token', token);
            }

            let coin = request.coin || 0;//账户余额
            if (coin == 0) {
                coin = localStorage.getItem(prefix + 'coin') || 0;
            } else {
                localStorage.setItem(prefix + 'coin', coin);
            }
            sendResponse({
                uid: uid, token: token, coin: coin
            });
            break;
        case 4:  // 清除 uid token
            localStorage.setItem(prefix + 'uid', '0');
            localStorage.setItem(prefix + 'token', '');
            localStorage.setItem(prefix + 'coin', '');
            uid = 0;
            token = '';
            break;
        case 5:  //执行网络请求 GET
            //ming注释
            Tools.doGet(request.url, request.parmas, (ok, data, code) => {
                sendResponse({
                    ok: ok, data: data, code: code
                });
            });

            return true;
            break;
        case 6:  //执行网络请求 POST
            //ming注释
            Tools.doPost(request.url, request.parmas, (ok, data, code) => {
                sendResponse({
                    ok: ok, data: data, code: code
                });
            });

            return true;
            break;
        case 7://保存查询的旺旺
            localStorage.setItem(prefix + 'search_wangwang', request.search_wangwang);
            localStorage.setItem(prefix + 'showindex', request.showindex);
            localStorage.setItem(prefix + 'order_info', JSON.stringify(request.order_info));
            sendResponse();
            break;
        case 8://获取查询的旺旺
            let search_wangwang = localStorage.getItem(prefix + 'search_wangwang') || '';
            let showindex = localStorage.getItem(prefix + 'showindex') || '';
            let order_info = localStorage.getItem(prefix + 'order_info') || '';
            sendResponse({
                search_wangwang: search_wangwang, showindex: showindex, order_info: order_info
            });
            break;
        case 9://没有任何参数的网络请求 doHttp(method = 'get', url, param, headers = {}, callback) {
            Tools.doHttp(request.method, request.url, request.parmas, request.headers, (response) => {
                sendResponse({
                    response: response
                });
            });
            return true;
            break;
    }

});
