const BaseService = require('./base');
class RoleResourceServise extends BaseService {
    constructor(...args) {
        super(...args);
        this.entity = 'role_resource';
    }
   
}
module.exports = RoleResourceServise;