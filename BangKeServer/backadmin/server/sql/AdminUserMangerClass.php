<?php
/**
 *
 * 管理员信息管理
 * Created by PhpStorm.
 * User: ming
 * Date: 2020/1/22
 * Time: 22:24
 */

class AdminUserMangerClass extends SqlMangerClass
{
    /**
     * 构造函数
     */
    public function __construct()
    {
        parent::sqlClose();//连接数据库
    }

    /**
     * 添加管理员
     */
    public function add_admin($admin_user_entity)
    {

    }

    /**
     * 删除管理员
     * @param $admin_user_id 管理员用户id
     */
    public function delete_admin($admin_user_id)
    {

    }

    /**
     * 查询所有管理员
     */
    public function select_admin_all()
    {

    }

    /**
     * 查询管理员_管理员类型
     * @param $classify 管理员类型
     */
    public function select_admin_buyClassify($classify)
    {

    }

    /**
     * 修改管理员信息
     */
    public function alter_admin_all($admin_user_entity)
    {

    }
}