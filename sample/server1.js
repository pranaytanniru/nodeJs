const https = require('https');
const http = require('http');
const fs = require('fs');


var data=`getting comfortable with vim:P`

http.createServer((req,serverRes)=>{
  if(req.method==='GET'&& req.url==='/'){
      serverRes.write(data);
      serverRes.end();
  }
}).listen(4444)
