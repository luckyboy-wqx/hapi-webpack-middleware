const WebpackDevMiddleware=require('webpack-dev-middleware');
const WebpackHotMiddleware=require('webpack-hot-middleware');
const Webpack=require('webpack');

exports.plugin={
	name:"hapi-webpack-middleware",
	version:"1.0.5",
	pkg:require('./package.json'),
	register:async function(server,options){
		const config = options.config;
	    const compiler = Webpack(config);
	    server.app.webpackCompiler = compiler;
	    const devMiddleware = WebpackDevMiddleware(compiler, options.options);
	    const hotMiddleware = WebpackHotMiddleware(compiler, options.options);

	    server.ext('onRequest', (request, reply) => {
	        const req = request.raw.req;
	        const res = request.raw.res;

	        devMiddleware(req, res, (err) => {
	            if (err) {
	                return reply(err);
	            }
	            return reply.continue();
	        });
	    });

	    server.ext('onRequest', (request, reply) => {

	        const req = request.raw.req;
	        const res = request.raw.res;

	        hotMiddleware(req, res, (err) => {
	            if (err) {
	                return reply(err);
	            }
	            return reply.continue();
	        });
	    });

	}
}