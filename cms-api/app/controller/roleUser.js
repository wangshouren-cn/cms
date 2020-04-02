'use strict';

const BaseController = require('./base');

class roleUserController extends BaseController {
  constructor(...args) {
    super(...args)
    this.entity = 'roleUser';
  }
}

module.exports = roleUserController;
