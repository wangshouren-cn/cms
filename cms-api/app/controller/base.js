'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 0,
      data
    }
  }
  error(error) {
    this.ctx.body = {
      code: 1,
      error
    }
  }
  //支持分页
  async index() {

    const { ctx, service } = this;
    const { pageNum, pageSize, ...where } = ctx.query;
    const currentPageNum = isNaN(pageNum) ? 1 : parseInt(pageNum);
    const currentPageSize = isNaN(pageSize) ? 3 : parseInt(pageSize);
    const result = await service[this.entity].select(currentPageNum, currentPageSize, where);
    this.success(result)
  }
  async create() {
    const { ctx, app, service } = this;
    const user = ctx.request.body;//{username,password,..}
    const result = await service[this.entity].create(user);
    result ? this.success("创建成功！") : this.error("创建失败！")
  }
  async update() {
    const { ctx, app, service } = this;
    const id = ctx.params.id;
    const user = ctx.request.body;
    user.id = id;
    console.log('user', user);

    const result = await service[this.entity].update(user);
    result ? this.success("更新成功！") : this.error("更新失败！")
  }
  async destroy() {
    const { ctx, app, service } = this;
    const id = ctx.params.id;//{username,password,..}
    console.log('ctx.params', ctx.params);
    const ids = ctx.request.body;
    console.log('ids', ids);
    const result = await service[this.entity].destroy(Array.isArray(ids) ? ids : id);
    result ? this.success("删除成功！") : this.error("删除失败！")
  }
}

module.exports = BaseController;
