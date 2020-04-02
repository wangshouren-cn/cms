'use strict';

const BaseController = require('./base');

class RoleController extends BaseController {
  constructor(...args) {
    super(...args)
    this.entity = 'role';
  }
  async getUser() {
    
    const { app, service, ctx } = this;
    console.log('ctx.session.user',ctx.session.user);

    const result = await service.role.getUser();
    this.success(result);
  }
  //设置用户和角色的关系 把角色和用户进行关联
  async setUser() {
    const { app, service, ctx } = this;
    const body = ctx.request.body;//{roleId:1,userIds:[1,2]}
    const result = await service.role.setUser(body);
    result ? this.success("为角色分配用户成功！") : this.error("为角色分配用户失败！");
  }
  async getResource() {
    const { app, service, ctx } = this;
    const result = await service.role.getResource();
    this.success(result);
  }
  //设置用户和资源的关系 把角色和资源进行关联
  async setResource() {
    const { app, service, ctx } = this;
    const body = ctx.request.body;//{roleId:1,resourceIds:[1,2]}
    const result = await service.role.setResource(body);
    result ? this.success("为角色分配资源成功！") : this.error("为角色分配资源失败！");
  }
}

module.exports = RoleController;
