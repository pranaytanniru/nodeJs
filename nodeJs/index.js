const http=require('http')
const https=require('https')
const url=require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const config=require('./config')
const fs=require('fs')

var httpsObject={
	'key':fs.readFileSync('./https/key.pem'),
	'cert':fs.readFileSync('./https/cert.pem')
}
var httpServer=http.createServer(unified)
var httpsServer=https.createServer(httpsObject,unified)
function unified(request,response){
	var parsedUrl=url.parse(request.url)
	var path=parsedUrl.pathname
	var trimmedPath=path.replace(/^\/+|\/+$/g,'')
	var queryString=parsedUrl.query

	var method=request.method
	var headers=request.headers
	var decoder=new StringDecoder('utf-8')
	var buffer=''


	request.on('data',(data)=>{
		buffer+=decoder.write(data)
	})
	request.on('end',()=>{
		buffer+=decoder.end();
		//choosing the handlers
		var choosenHandler=typeof(router[trimmedPath])!=='undefined'?router[trimmedPath]:handlers.pageNotFound
		var data={
			'trimmedPath':trimmedPath,
			'queryString':parsedUrl.query,
			'method':method,
			'headers':headers,
			'payload':buffer,
		}
		choosenHandler(data,(status=200,payload={})=>{
			var payloadString=JSON.stringify(payload)
			response.setHeader('Content-Type','application/json')
			response.writeHead(status)
			response.end(payloadString)
			console.log('sending the data',payloadString);
		})
		// console.log('the data received is',buffer);
	})

	// console.log('request',headers);//need to be tested through postman
	// console.log('url is',parsedUrl);
	// console.log('the path received is',trimmedPath)
	// console.log('the method received is',method)
}
httpServer.listen(config.httpPort,()=>{
	console.log('the server is running on localhost:',config.httpPort,'mode',config.envName);
});

httpsServer.listen(config.httpsPort,()=>{
	console.log('the server is running on localhost:',config.httpsPort,'mode',config.envName);
});


var handlers={}
handlers.sample=function(data,callback){
	callback(200,data)
}
handlers.pageNotFound=function(data,callback){
	callback(404)
}
var router={
	'sample':handlers.sample
}


/*
var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'
*/
