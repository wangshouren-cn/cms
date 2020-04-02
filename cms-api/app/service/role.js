const BaseService = require('./base');
class RoleServise extends BaseService {
    constructor(...args) {
        super(...args);
        this.entity = 'role';
    }
    async select(pageNum, pageSize, where) {
        const { app } = this;

        //返回某一页的记录
        const list = await app.mysql.select(this.entity, {
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize
        });
        for (let i = 0; i < list.length; i++) {
            const roleUser = list[i];
            //增加roleUser的拥有的资源和用户
            roleUser.userIds = (await app.mysql.select('role_user', { 'role_id': roleUser.id })).map(item=>item.user_id);
            roleUser.resourceIds = (await app.mysql.select('role_resource', { 'role_id': roleUser.id })).map(item=>item.resource_id);
        }
        //按照条件过滤后的总条数
        const total = await app.mysql.count(this.entity, where)

        return { list, total }
    }
    async getUser() {
        const { app, ctx, service } = this;
        return await app.mysql.select('user');
    }
    async setUser({ roleId, userIds }) {
        const { app, ctx, service } = this;
        //开启事务
        const conn = await app.mysql.beginTransaction();
        try {
            //全部删除
            await conn.query(`DELETE FROM role_user where role_id = ?`, [roleId]);
            //全部插入
            for (let i = 0; i < userIds.length; i++) {
                await conn.insert('role_user', { 'role_id': roleId, 'user_id': userIds[i] });
            }
            await conn.commit();
            return true;
        } catch (e) {
            await conn.rollback();
            return false;
        }
    }
    async getResource() {
        const { app, ctx, service } = this;
        const list = await app.mysql.select('resource');
        const rootMenus = [];
        const resourceMap = {};
        list.forEach(item => {
            item.children = [];
            resourceMap[item.id] = item;
            if (item.parent_id === 0) {
                //顶级资源
                rootMenus.push(item);

            } else {
                resourceMap[item.parent_id] && resourceMap[item.parent_id].children.push(item);
            }
        });

        return rootMenus;

    }
    async setResource({ roleId, resourceIds }) {
        const { app, ctx, service } = this;
        //开启事务
        const conn = await app.mysql.beginTransaction();
        try {
            //全部删除
            await conn.query(`DELETE FROM role_resource where role_id = ?`, [roleId]);
            //全部插入
            for (let i = 0; i < resourceIds.length; i++) {
                await conn.insert('role_resource', { 'role_id': roleId, 'resource_id': resourceIds[i] });
            }
            await conn.commit();
            return true;
        } catch (e) {
            await conn.rollback();
            return false;
        }
    }
}
module.exports = RoleServise;