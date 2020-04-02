/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585811646247_8395';

  // add your middleware config here
  config.middleware = [/* 
    'auth'
   */'init'];
  config.auth = {
    blackList: [
      '/api/role/getResource',
      '/api/role/setResource',
      '/api/role/getUser',
      '/api/role/setUser'
    ]
  }
  // add your user config here
  const userConfig = {
    jwtSecret: 'wsr',

    security: {
      domainWhiteList: ['http://localhost:8000'],
      csrf: false
    },
    cors: {
      origin: 'http://localhost:8000',
      credentials: true
      // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    },
    //配置mysql链接地址
    mysql: {
      client: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: 3306,
        database: 'cms'
      }
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
