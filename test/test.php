<!DOCTYPE html>
<html>
<body>

<?php
$sdf="{\"href\":\"https://trade.taobao.com/trade/itemlist/list_sold_items.htm\"}";
$json_data = json_decode($sdf, true);
echo $json_data['href'];

?>

</body>
</html>
