const BaseService = require('./base');
class ResourceServise extends BaseService {
    constructor(...args) {
        super(...args);
        this.entity = 'resource';
    }
}
module.exports = ResourceServise;