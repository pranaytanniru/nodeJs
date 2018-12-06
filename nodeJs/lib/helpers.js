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

helpers.createRandomString=(length)=>{
  if(length<0){
    return false;
  }
  var randomString='';
  var charactersItCanContain='0123456789abcdefghijklmnopqrstuvwxyz';
  for(var i=0;i<length;i++){
    var randomCharacter=charactersItCanContain.charAt(Math.floor(Math.random()*charactersItCanContain.length));
    randomString+=randomCharacter;
  }
  return randomString;
}
module.exports = helpers;
