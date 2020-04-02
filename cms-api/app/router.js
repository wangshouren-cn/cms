'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth(app.config.auth, app);

  router.get('/', controller.home.index);
  //登录注册
  router.post('/api/signup', controller.index.signup);
  router.post('/api/signin', controller.index.signin);
  //验证码
  router.get('/api/captcha', controller.index.captcha);
  router.post('/api/checkCaptcha', controller.index.checkCaptcha);
  //RESTful 
  router.resources('user', '/api/user', controller.user);
  router.resources('user', '/api/role', controller.role);
  router.resources('user', '/api/resource', controller.resource);
  router.resources('user', '/api/roleResource', controller.roleResource);
  router.resources('user', '/api/roleUser', controller.roleUser);

  //用户资源 这4个接口需要登录后才能访问
  /*
  * 1. 可以在设置黑白名单 
   */
  //获得所有的用户 
  router.get('/api/role/getUser', controller.role.getUser)
  router.post('/api/role/setUser', controller.role.setUser)

  router.get('/api/role/getResource', controller.role.getResource)
  router.post('/api/role/setResource', controller.role.setResource)

};
