/*
*
*Request handlers
*
*/

const _data = require('./data');
const helpers = require('./helpers');
var handlers={}
handlers.sample=function(data,callback){
	callback(200,data)
}
handlers.ping=function(data,callback){
	callback(200)
}
handlers.pageNotFound=function(data,callback){
	callback(404,"pageNotFound")
}
handlers.users=(data,callback)=>{
	const acceptableMethods=['post','get','put','delete']
	if(acceptableMethods.indexOf(data.method)>-1){
		handlers._users[data.method](data,callback)
	}else{
		callback(405)
	}
}

handlers._users={}
handlers._users.post=(data,callback)=>{
	var firstName=typeof(data.payload.firstName)=='string'&&data.payload.firstName.trim().length>0?data.payload.firstName.trim():false
	var lastName=typeof(data.payload.lastName)=='string'&&data.payload.lastName.trim().length>0?data.payload.lastName.trim():false
	var phone=typeof(data.payload.phone)=='string'&&data.payload.phone.trim().length==10?data.payload.phone.trim():false
	var password=typeof(data.payload.password)=='string'&&data.payload.password.trim().length>0?data.payload.password.trim():false
	var tosAgreement=typeof(data.payload.tosAgreement)=='boolean'&&data.payload.tosAgreement==true?true:false

	if(firstName && lastName && phone && password && tosAgreement){
		_data.read('users',phone,(err,data)=>{
			if(err){
				var hashedPassword=helpers.hash(password);
				if(hashedPassword){
					var userObject={
						"firstName":firstName,
						"lastName":lastName,
						"phone":phone,
						"hashedPassword":hashedPassword,
						"tosAgreement":true
					}
					_data.create('users',phone,userObject,(err)=>{
						if(err){
							console.log(err);
							callback(500,{'Error':'could not create the user'})
						}else{
							callback(200)
						}
					})
				}else{
					callback(500,{'Error':'could not hash the user\'s password'})
				}
			}else{
				callback(400,{'Error':'User with the phone number already exists'})
			}
		})
	}else{
		callback(400,{'Error':'Missing required fields'})
	}

}

// @TODO: ONLY AUTHENTICATED USERS CAN ACCESS THEIR DATA
handlers._users.get=(data,callback)=>{
	var phone=typeof(data.queryString.phone)=='string'&&data.queryString.phone.trim().length==10?data.queryString.phone.trim():false
	if(phone){
		_data.read('users',phone,(err,userData)=>{
				if(!err&&userData){
					delete userData.hashedPassword
					callback(200,userData)
				}else{
					callback(400,{'Error':'User not found'})
				}
		})
	}else{
		// console.log('phone',data.payload,'data',data);
		callback(400,{'Error':'Missing required fields'})
	}
}
handlers._users.put=(data,callback)=>{
	var phone=typeof(data.payload.phone)=='string'&&data.payload.phone.trim().length==10?data.payload.phone.trim():false
	var firstName=typeof(data.payload.firstName)=='string'&&data.payload.firstName.trim().length>0?data.payload.firstName.trim():false
	var lastName=typeof(data.payload.lastName)=='string'&&data.payload.lastName.trim().length>0?data.payload.lastName.trim():false
	var password=typeof(data.payload.password)=='string'&&data.payload.password.trim().length>0?data.payload.password.trim():false

	if(phone){
		if(firstName || lastName || password){
			_data.read('users',phone,(err,userData)=>{
					if(!err&&data){
						if(firstName){
							userData.firstName=firstName
						}
						if(lastName){
							userData.lastName=lastName
						}
						if(password){
							userData.hashedPassword=helpers.hash(password)
						}
						_data.update('users',phone,userData,(err)=>{
							if(err){
								callback(500,{'Error':'Error updating the user'})
							}else{
								callback(200,{})
							}
						})
					}else{
						callback(400,{'Error':'User not found'})
					}
			})
		}else{
			callback(400,{'Error':'Missing required fields'})
		}
	}else{
		callback(400,{'Error':'Missing required fields'})
	}
}
handlers._users.delete=(data,callback)=>{
	var phone=typeof(data.payload.phone)=='string'&&data.payload.phone.trim().length==10?data.payload.phone.trim():false
	if(phone){
		_data.read('users',phone,(err,userData)=>{
				if(!err&&userData){
					_data.delete('users',phone,(err)=>{
						if(err){
							callback(500,{'Error':'Error deleting the user'})
						}else{
							callback(200)
						}
					})
				}else{
					callback(400,{'Error':'User not found'})
				}
		})
	}else{
		callback(400,{'Error':'Missing required fields'})
	}
}
handlers.tokens=(data,callback)=>{
	const acceptableMethods=['post','get','put','delete']
	if(acceptableMethods.indexOf(data.method)>-1){
		handlers._tokens[data.method](data,callback)
	}else{
		callback(405)
	}
}
handlers._tokens={}
handlers._tokens.post=(data,callback)=>{
	var phone=typeof(data.payload.phone)=='string'&&data.payload.phone.trim().length==10?data.payload.phone.trim():false
	var password=typeof(data.payload.password)=='string'&&data.payload.password.trim().length>0?data.payload.password.trim():false

	if(phone && password ){
		_data.read('users',phone,(err,userData)=>{
			if(!err&&userData){
				var hashedPassword=helpers.hash(password);
				if(hashedPassword==userData.hashedPassword){
					var id=helpers.createRandomString(20);
					var expires=Date.now()+1000*60*60;
					var tokenObject={
						 "phone":phone,
						'id':id,
						'expires':expires,
					}
					_data.create('tokens',id,tokenObject,(err)=>{
						if(err){
							// console.log(err);
							callback(500,{'Error':'could not create the token'})
						}else{
							callback(200,tokenObject);
						}
					})
				}else{
					callback(400,{'Error':'Incorrect password'})
				}
			}else{
				callback(400,{'Error':'User not found'})
			}
		})
	}else{
		callback(400,{'Error':'Missing required fields'})
	}
}
handlers._tokens.get=(data,callback)=>{
	console.log('data.queryString.id',data.queryString.id);
	var id=typeof(data.queryString.id)=='string'&&data.queryString.id.trim().length==20?data.queryString.id.trim():false
	if(id){
		_data.read('tokens',id,(err,tokenData)=>{
				if(!err&&tokenData){
					callback(200,tokenData)
				}else{
					callback(404,{'Error':'Token not found'})
				}
		})
	}else{
		callback(400,{'Error':'Missing required fields'})
	}
}
handlers._tokens.put=(data,callback)=>{
	var id=typeof(data.payload.id)=='string'&&data.payload.id.trim().length==20?data.payload.id.trim():false
	var extend=typeof(data.payload.extend)=='boolean'?data.payload.extend:false
	if(id&&extend){
		_data.read('tokens',id,(err,tokenData)=>{
				if(!err&&tokenData){
					if(tokenData.expires>Date.now()){
						tokenData.expires=Date.now()+1000*60*60;
						_data.update('tokens',tokenData.id,tokenData,(err)=>{
							if(err){
								callback(500,{'Error':'Error updating the token'})
							}else{
								callback(200)
							}
						})
					}else{
						callback(400,{'Error':'Session timed out'})
					}
				}else{
					callback(404,{'Error':'Token not found'})
				}
		})
	}else{
		callback(400,{'Error':'Missing required fields'})
	}
}
handlers._tokens.delete=(data,callback)=>{
	var id=typeof(data.payload.id)=='string'&&data.payload.id.trim().length==20?data.payload.id.trim():false
	if(id){
		_data.read('tokens',id,(err,tokenData)=>{
				if(!err&&tokenData){
					_data.delete('tokens',id,(err)=>{
						if(err){
							callback(500,{'Error':'Error deleting the Token'})
						}else{
							callback(200)
						}
					})
				}else{
					callback(400,{'Error':'Token not found'})
				}
		})
	}else{
		callback(400,{'Error':'Missing required fields'})
	}
}
module.exports=handlers
