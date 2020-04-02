const BaseService = require('./base');
class UserServise extends BaseService {
    constructor(...args) {
        super(...args);
        this.entity = 'user';
    }
    async select(pageNum, pageSize, where) {

        //返回某一页的记录
        const list = await this.app.mysql.select(this.entity, {
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize
        });
        for (let i = 0; i < list.length; i++) {
            const user = list[i];
            // user.resources = ?
            const resources = await this.app.mysql.query(`select resource.* from resource 
            inner join role_resource on resource.id = role_resource.resource_id
            inner join role_user on role_resource.role_id = role_user.role_id
            where role_user.user_id = ?`, [user.id]);
            const rootMenus = [];
            const map = {};
            resources.forEach(resource => {
              resource.children = [];
              map[resource.id] = resource;// 把资源的ID和资源的对象关系存放到了map中
              if (resource.parent_id === 0) {
                rootMenus.push(resource);
              } else {
                map[resource.parent_id] && map[resource.parent_id].children.push(resource);
              }
            });
            user.resources = rootMenus;
          }

        //按照条件过滤后的总条数
        const total = await this.app.mysql.count(this.entity, where)

        return { list, total }
    }
}
module.exports = UserServise;