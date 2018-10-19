var environment={}

environment.staging={
	'httpPort':3000,
	'httpsPort':3001,
	'envName':'staging',
	'hashingSecret':'this is a secret',
};

environment.production={
	'httpPort':5000,
	'httpsPort':5001,
	'envName':'production',
	'hashingSecret':'this is a secret',
};

var currentEnvironment=typeof(process.env.NODE_ENV)==='string'?process.env.NODE_ENV.toLowerCase():''

var environmentExport=typeof(environment[currentEnvironment])==='object'?environment[currentEnvironment]:environment.staging

module.exports=environmentExport
