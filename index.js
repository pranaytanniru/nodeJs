const http=require('http')

var server=http.createServer((request,response)=>{
		response.end('hey this is pranay');
	})
server.listen(3000,()=>{});
