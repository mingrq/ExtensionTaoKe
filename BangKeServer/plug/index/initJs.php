<?php
/**
 * Created by PhpStorm.
 * User: ming
 * Date: 2020/1/8
 * Time: 22:21
 */

header('Access-Control-Allow-Origin:*');//注意！跨域要加这个头 上面那个没有

$json_data=$_POST['href'];
$json_array = array();
$jsarray = array('initUIJs','checkDialog','report','advert');//返回的js
if ($json_data === 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm') {
    $json_array['code'] = 0;
    $json_array['message'] = '插件初始化';
    $json_data_array = array();
    for ($i = 0; $i < count($jsarray); $i++) {
        $js = file_get_contents("../webjs/" . $jsarray[$i] . ".js");
        $code = array();
        $code['code']=$js;
        $json_data_array[] = $code;
    }
    $json_array['data'] = $json_data_array;
    $json = json_encode($json_array);
    echo $json;
} else {
    echo "m参数错误";
}

/*接收json格式数据*/
//$json_raw = file_get_contents("php://input");
//$json_data = json_decode($json_raw, true);
//$json_array = array();
//$jsarray = array('initUIJs','checkDialog','report','advert');//返回的js
//if ($json_data['href'] === 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm') {
//    $json_array['code'] = 0;
//    $json_array['message'] = '插件初始化';
//    $json_data_array = array();
//    for ($i = 0; $i < count($jsarray); $i++) {
//        $js = file_get_contents("../webjs/" . $jsarray[$i] . ".js");
//        $code = array();
//        $code['code']=$js;
//        $json_data_array[] = $code;
//    }
//    $json_array['data'] = $json_data_array;
//    $json = json_encode($json_array);
//    echo $json;
//} else {
//    echo "m参数错误";
//}


