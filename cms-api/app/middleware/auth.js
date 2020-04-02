const { verify } = require('jsonwebtoken');
function verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
        verify(token, secret, function (err, payload) {
            if (err) return reject(err);
            resolve(payload);
        })
    })
}
/* module.exports = (options, app) => {
    return async (ctx, next) => {
        //在此处进行权限判断
        const blackList = options.blackList;
        if (blackList.includes(ctx.url)) {
            const token = ctx.get('Authorization');
            if (!token) {
                ctx.status = 401;
                ctx.body = { code: 1, data: '没有token' };
            } else {
                try {
                    const user = await verifyToken(token, app.config.jwtSecret);
                    ctx.session.user = user;
                    await next();
                } catch (e) {
                    ctx.status = 401;
                    ctx.body = { code: 1, data: 'token验证失败' };
                }
            }
        } else {
            await next();
        }
    }
} */
module.exports = (options, app) => {
    return async (ctx, next) => {
        //在此处进行权限判断
        const token = ctx.get('Authorization');
        if (!token) {
            ctx.status = 401;
            ctx.body = { code: 1, data: '没有token' };
        } else {
            try {
                const user = await verifyToken(token, app.config.jwtSecret);
                ctx.session.user = user;
                await next();
            } catch (e) {
                ctx.status = 401;
                ctx.body = { code: 1, data: 'token验证失败' };
            }
        }

    }
}