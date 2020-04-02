const ms = require('ms');
module.exports = (options, app) => {
    return async (ctx, next) => {
        ctx.session.maxAge = ms('30d');
        await next();
    }
}