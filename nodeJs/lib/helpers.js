const crypto = require('crypto');
const config = require('./config')
var helpers={}

helpers.hash=(password)=>{
  if (typeof(password)=='string'&&password.length>0) {
    var hash=crypto.createHmac('sha256',config.hashingSecret).update(password).digest('hex')
    return hash;
  }else {
    return false;
  }
}

helpers.parseJsonToObject=(text)=>{
  try{
    var obj=JSON.parse(text);
    return obj
  }catch(e){
    return {}
  }
}

module.exports = helpers;
