const koa = require('koa');
const path = require('path');
const fs = require('fs.promised');
const route = require('koa-route');
const koaBody = require('koa-body');
const staticResource = require('koa-static');
const staticPath = './static'; //静态资源目录，相对于入口js文件的路径
const app = new koa();

const resource = staticResource(path.join(__dirname, staticPath));

const main = async function(ctx, next) {
	ctx.response.type = 'html';
	ctx.response.body = await fs.readFile('./tmp/index.html', 'utf8');
};

const err500 = ctx => {
	ctx.throw(500);
};

const err404 = ctx => {
	ctx.response.status = 404;
	ctx.response.body = 'page out of now';
};


const logRequestUrl = async(ctx, next) => {
	console.log(`${ctx.request.method} ${ctx.request.url}`);
	await next();
};

const logRequestTime = async(ctx, next) => {
	const start = new Date().getTime();
	await next();
	const end = new Date().getTime();
	const ms = end - start;
	console.log(`time = ${ms}ms`);
};


const errHander = async(ctx, next) => {
	try {
		await next()
	} catch (err) {
		ctx.response.status = err.statusCode || err.status || 500;
		ctx.response.body = {
			message: err.message
		}
		ctx.app.emit('error', err, ctx);
	}
};

app.on('error', (err, ctx) => {
	console.error('server error', err);
});

const login = async(ctx, next) => {
	const body = ctx.request.body;
	if (!body.name) {
		ctx.throw(400, 'name required');
	}
	ctx.response.type = 'json';
	ctx.response.body = {
		name: body.name
	};
};

app.use(errHander);
app.use(resource);
app.use(logRequestUrl);
app.use(logRequestTime);
app.use(koaBody());
app.use(route.get('/', main));
app.use(route.post('/login', login));
app.use(route.get('/err500', err500));
app.use(route.get('/err404', err404));
app.listen(3000);