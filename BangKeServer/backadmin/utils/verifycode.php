<?php
// <span style="white-space:pre">  </span>//因为要把产生的验证码保存到session中，此处为session开始
session_start();
//创建一张宽100高30的图像
$width = 110;
$height = 32;
$image = imagecreatetruecolor($width, $height);
//为$image设置背景颜色为白色
$bgcolor = imagecolorallocate($image, 255, 255, 255);
//填充背景颜色
imagefill($image, 0, 0, $bgcolor);

//生成4个随机数
/*for($i=0; $i<4; $i++){
       //设置字体为6
       $fontsize=62;
       //设置背景颜色为随机颜色 三个rand（）函数分别对应颜色的rgb让他们产生在0~120这个范围的数值
       $fontcolor=imagecolorallocate($image, rand(0,120), rand(0, 120), rand(0,120));
       //生成随机数字
       $fontcontent=rand(0, 9);
       //控制数字出现的位置x->left y->top
       $x=($i*$width/4)+rand(8, 10);
       $y=rand(5, 10);

       imagestring($image, $fontsize, $x, $y, $fontcontent, $fontcolor);

   }*/

$captch_code = "";
for ($i = 0; $i < 4; $i++) {
    $fontsize = 80;
    $fontcolor = imagecolorallocate($image, rand(0, 120), rand(0, 120), rand(0, 120));
    $data = "1234567890abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ";
    //设置每次产生的字符从$data中每次截取一个字符
    $fontcontent = substr($data, rand(0, strlen($data)), 1);
    //让产生的四个字符拼接起来
    $captch_code .= $fontcontent;
    //控制每次出现的字符的坐标防止相互覆盖即x->left y->top
    $x = ($i * $width / 4) + rand(5, 10);
    $y = rand(5, 10);
    //此函数用来将产生的字符在背景图上画出来
    imagestring($image, $fontsize, $x, $y, $fontcontent, $fontcolor);
}
$_SESSION['authcode'] = $captch_code;//把产生的验证码存入session中
//用来在背景图片上产生200个干扰点
for ($i = 0; $i < 200; $i++) {
    //干扰点的颜色
    $pointcolor = imagecolorallocate($image, rand(50, 200), rand(50, 200), rand(50, 200));
    //该函数用来把每个干扰点在背景上描绘出来
    imagesetpixel($image, rand(1, $width), rand(1, $height), $pointcolor);
}

//产生三条干扰线
for ($i = 0; $i < 2; $i++) {
    # code...
    //干扰线的颜色
    $linecolor = imagecolorallocate($image, rand(80, 220), rand(80, 220), rand(80, 220));
    //画出每条干扰线
    imageline($image, rand(1, 99), rand(1, 29), rand(1, 99), rand(1, 29), $linecolor);
}
//设置header图片格式为png
header('content-type:image/png');
//显示图片
imagepng($image);


//destory
imagedestroy($image);