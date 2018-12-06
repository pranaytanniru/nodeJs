const express=require('express')
const app=express()
const port = process.env.port || 4444

app.get('/',(req,res)=>{
	res.send('<h1>HELLO</h1>');
})


app.get('/api',(req,res)=>{
	//res.send('<h1>IN API PAGE</h1>');
	res.json({name:'pranay'})
})

app.listen(port)
console.log('server started');
//console.log(process.env);
