const { Service } = require('egg');

class BaseServise extends Service {
    async select(pageNum, pageSize, where) {
        console.log('pageNum, pageSize, where', pageNum, pageSize, where);

        //返回某一页的记录
        const list = await this.app.mysql.select(this.entity, {
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize
        });
        //按照条件过滤后的总条数
        const total = await this.app.mysql.count(this.entity, where)

        return { list, total }
    }
    async create(entity) {
        let result = await this.app.mysql.insert(this.entity, entity);
        return result.affectedRows > 0;
    }
    async update(entity) {
        let result = await this.app.mysql.update(this.entity, entity);
        return result.affectedRows > 0;
    }
    async destroy(ids) {
        ids = Array.isArray(ids) ? ids : [ids];
        let results = []
        for (let i = 0; i < ids.length; i++) {
            let result = await this.app.mysql.delete(this.entity, { id: ids[i] });
            results.push(result)
        }

        return results.every(item => item.affectedRows > 0);
    }
}
module.exports = BaseServise;