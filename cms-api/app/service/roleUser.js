const BaseService = require('./base');
class RoleUserServise extends BaseService {
    constructor(...args) {
        super(...args);
        this.entity = 'role_user';
    }
}
module.exports = RoleUserServise;