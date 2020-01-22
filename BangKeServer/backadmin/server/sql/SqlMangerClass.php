<?php
/**
 * Created by PhpStorm.
 * User: ming
 * Date: 2020/1/22
 * Time: 21:55
 */

class SqlMangerClass
{
    private $servername = "";//数据库地址
    private $username = "test";//数据库用户名
    private $userpw = "";//数据库密码
    private $sqlname = "test";//数据库名称
    private $con;//数据库连接实例

    /**
     * 连接数据库
     */
protected final function sqlCon()
    {
        $con = mysqli_connect($this->servername, $this->username, $this->userpw, $this->sqlname, '3306');//数据库建立连接
        if (!$con) {
            //连接数据库失败
            $this->con = null;
        } else {
            mysqli_query($con, 'SET NAMES UTF8');
            //连接数据库成功
            $this->con = $con;
        }
    }

    /**
     * 关闭数据库
     */
    protected final function sqlClose()
    {
        if ($this->con) {
            mysqli_close($this->con);
        }
    }


}