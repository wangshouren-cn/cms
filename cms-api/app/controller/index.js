'use strict';
const svgCaptcha = require('svg-captcha');
const BaseController = require('./base');
const { sign } = require('jsonwebtoken');

class IndexController extends BaseController {
    async captcha() {
        const { ctx } = this;
        const captcha = svgCaptcha.create({});
        //eggjs内置session
        ctx.session.captcha = {
            text: captcha.text,
            expires: new Date(Date.now() + 60 * 1000)
        };

        ctx.set('Content-Type', 'image/svg+xml');
        ctx.body = captcha.data;
    }
    async checkCaptcha() {
        const { ctx } = this;
        const { captcha } = ctx.request.body;

        if (ctx.session.captcha.text.toUpperCase() === captcha.toUpperCase() &&
            ctx.session.captcha.expires > Date.now()) {
            ctx.body = { code: 0, data: '验证码验证成功！' }
        } else {
            ctx.body = { code: 1, data: '验证码验证失败！' }
        }
    }
    async signup() {
        const { ctx, app } = this;
        const user = ctx.request.body;

        const result = await app.mysql.insert('user', user);
        result.affectedRows > 0 ? this.success({ id: result.insertId }) : this.error("注册失败！");

    }
    async signin() {
        const { ctx, app } = this;
        const { username, password, captcha = '' } = ctx.request.body;
        console.log('ctx.session.captcha', ctx.session.captcha);
        //验证码
        let err = null;
        if (!captcha || !ctx.session.captcha) err = "请填写验证码！";
        else if (captcha.toUpperCase() !== ctx.session.captcha.text.toUpperCase()) {
            err = "验证码错误！"
        }
        if (ctx.session.captcha.expires > Date.now()) {
            err = "验证码已失效！"
        }
        if (err) return this.error(err);
        const result = await app.mysql.select('user', {
            where: { username, password },
            limit: 1
        });

        if (result && result.length > 0) {
            const user = result[0];

            //获得用户拥有的资源
            const resources = await this.app.mysql.query(`SELECT resource.* FROM resource 
             INNER JOIN role_resource ON resource.id = role_resource.resource_id
             WHERE role_resource.role_id = ?`, [user.role_id]);

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

            this.success(sign(JSON.parse(
                JSON.stringify(((delete user.password) && user))),
                this.config.jwtSecret,
                { expiresIn: '7 days' }
            ))
        } else {
            this.error("登录失败！")
        }



    }
}

module.exports = IndexController;
