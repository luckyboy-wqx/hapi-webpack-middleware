const WebpackDevMiddleware=require('webpack-dev-middleware');
const WebpackHotMiddleware=require('webpack-hot-middleware');
const Webpack=require('webpack');

exports.plugin={
	name:"hapi-webpack-middleware",
	version:"1.0.0",
	pkg:require('./package.json'),
	register:async function(server,options){
		const config = options.config;
	    const compiler = Webpack(config);
	    server.app.webpackCompiler = compiler;
	    const devMiddleware = WebpackDevMiddleware(compiler, options.options);
	    const hotMiddleware = WebpackHotMiddleware(compiler, options.options);

	    server.ext({
	    	type:'onRequest',
	    	method:async (request,h)=>{
	    		const {req,res}=request.raw;
	    		try {
	    			let setWebpackDevMiddleware = new Promise((resolve,reject)=>{
	    				devMiddleware(req,res,(err)=>{
	    					if(err){
	    						reject();
	    					}
	    					resolve();
	    				})
	    			});
	    			await setWebpackDevMiddleware;
	    			return h.continue;
	    		}
	    		catch(err){
	    			throw err;
	    		}
	    	}
	    });

	    server.ext({
	    	type:'onRequest',
	    	method:async (request,h)=>{
	    		const {req,res}=request.raw;
	    		try {
	    			let setWebpackHotMiddleware = new Promise((resolve,reject)=>{
	    				hotMiddleware(req,res,(err)=>{
	    					if(err){
	    						reject();
	    					}
	    					resolve();
	    				})
	    			});
	    			await setWebpackHotMiddleware;
	    			return h.continue;
	    		}
	    		catch(err){
	    			throw err;
	    		}
	    	}
	    })



	}
}