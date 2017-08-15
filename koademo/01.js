const koa = require('koa');
const fs = require('fs');
const path = require('path');
const route = require('koa-route');
const static_resource = require('koa-static');
const static_path = './static'; //静态资源目录，相对于入口js文件的路径
const app = new koa();

const main = ctx => {
	ctx.response.type = 'html';
	ctx.response.body = fs.createReadStream('./tmp/index.html');
	// if (ctx.request.path != '/') {
	// 	if (ctx.request.accepts('html')) {
	// 		ctx.response.type = 'html';
	// 		ctx.response.body = fs.createReadStream('./tmp/index.html');
	// 	} else if (ctx.request.accepts('json')) {
	// 		ctx.response.type = 'text';
	// 		ctx.response.body = {
	// 			data: 'Hello koa'
	// 		};
	// 	}
	// } else {
	// 	if (ctx.request.accepts('xml')) {
	// 		ctx.response.type = 'xml';
	// 		ctx.response.body = '<data>Hello koa</data>';
	// 	} else {
	// 		ctx.response.type = 'text';
	// 		ctx.response.body = 'Hello koa';
	// 	}
	// }
}

const about = ctx => {
	ctx.response.body = 'Hello about';
}

const resource = static_resource(path.join(__dirname, static_path));

const redirect = ctx => {
	ctx.response.redirect('/');
	ctx.response.body = '<a href="/">index page</a>';
}

const logger = (ctx, next) => {
	console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
	next();
}


app.use(resource);
app.use(logger);
app.use(route.get('/', main));
app.use(route.get('/about', about));
app.use(route.get('/redirect', redirect));
app.listen(3000);