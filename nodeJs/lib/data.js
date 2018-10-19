const fs=require('fs')
const path=require('path')


var lib={}
lib.baseDir=path.join(__dirname,'/../.data/')

//creating a file
lib.create=function(dir,file,data,callback){
  fs.open(lib.baseDir+dir+"/"+file+".json",'wx',(err, fileDescriptor)=>{
    if(!err&&fileDescriptor){
      var stringData=JSON.stringify(data);
      fs.writeFile(fileDescriptor,stringData,(err)=>{
        if(err){
          callback("error writing into the file")
        }else{
          fs.close(fileDescriptor,(err)=>{
            if(err){
              callback("error closing the file")
            }else{
              callback(false)
            }
          })
        }
      })
    }else{
      callback("could not create a file , it may already exists ")
    }
  })
};

//read data file
lib.read=(dir,file,callback)=>{
  fs.readFile(lib.baseDir+dir+"/"+file+".json",'utf-8',(err,data)=>{
    callback(err,data)
  })
}


//updating the file

lib.update=(dir,file,data,callback)=>{
  fs.open(lib.baseDir+dir+"/"+file+".json",'r+',(err,fileDescriptor)=>{
    if(!err&&fileDescriptor){
      var stringData=JSON.stringify(data);
      fs.truncate(fileDescriptor,(err)=>{
        if(err){
          console.log('error truncating the file');
        }
        else{
          fs.writeFile(fileDescriptor,stringData,(err)=>{
            if(err){
              callback("error writing into the file")
            }else{
              fs.close(fileDescriptor,(err)=>{
                if(err){
                  callback("error closing the file")
                }else{
                  callback(false)
                }
              })
            }
          })
        }
      })

    }else{
      callback("could not open the file , it may not exists ")
    }
  })
}


//deleting the file
lib.delete=(dir,file,callback)=>{
  fs.unlink(lib.baseDir+dir+"/"+file+".json",(err)=>{
    if(err){
      console.log('error deleting the file');
    }else{
      callback(false)
    }
  })
}

module.exports=lib;
