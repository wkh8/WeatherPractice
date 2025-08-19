//导入mysql模块
// eslint-disable-next-line no-undef
const mysql=require('mysql2')
// eslint-disable-next-line no-undef
const express=require('express')
// eslint-disable-next-line no-undef
const cors=require('cors')
// eslint-disable-next-line no-undef
const jwt= require('jsonwebtoken');

const SECRET='siyao666'

//建立与mysql的连接关系
const db= mysql.createPool({
    host:'127.0.0.1', //ip地址
    user:'root', //数据库账号
    password:'wkhwkh123',//密码
    database:`my_sql2`,//指定要操作的数据库
})
//创建服务器 
const app=express()
app.use(express.json())
app.use(cors())
//直接挂路由
//登录的路由与对应的mysql操作函数

//检测token中间件
function checkToken(req,res,next){
     //取token
    const token = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]; //自用不加前缀

    //1.缺少message
    if(!token){
        return res.json(
            {code:101,message:'缺少token'}
        )
    }
   
    //2.验证
    jwt.verify(token,SECRET,(err,tokenData)=>{
        if(err) {
            const msg=err.name==='TokenExpiredError'
            ? 'token 已过期'
            : 'token 无效'
            return res.json(
                    {code:102, msg}
            )
        }
        //成功
        
        
    req.tokenData=tokenData
    next()
    })
    
}

//登录
app.get('/login',async (req,res)=>{
    try { 
        const password=req.query.password;
        const username=req.query.username;
        const result= await SQL_getUser(password,username);
        res.json(result);
    }
    catch(err){
        console.log(err.message);
        
    }
   
})
async function SQL_getUser(password,username){
    try{
        const [res]=await db.promise().query('SELECT * FROM user_data where username = ?',[username])
       if(res.length===0){
        return  {code:404,message:'未找到该用户'}
       }
       else if(res[0].password!==password){
        return  {code:404,message:'密码错误'}
       }
       else if(res[0].password===password){
        //不传数据只传token
        return {code:400,message:"登录成功",/*userdata:res[0].data,*/token:jwt.sign({ username }, SECRET, { expiresIn: '2h' })}
       }
        else{
            return{code:404,message:'数据库错误?'}
        }

    }
    catch(err){
        console.log(err.message);
        throw err
    }
 

}
//注册的路由和mysql操作函数
app.post('/register',async (req,res)=>{
    try{
        const result= await SQL_setUser(req.body)
        res.json(result)
    }
    catch(err){
        console.log(err.message);
    }
})
async function SQL_setUser(data){
    try{
        const [res]=await db.promise().query('insert into user_data set ?',[data])
        if(res.affectedRows===1){
            return {code:400,message:'注册成功'}
        }else
        {
            return {code:404,message:'注册失败'}
        }
    }
    catch(err){
        if(err.code==='ER_DUP_ENTRY'){
            return{code:404,message:'用户名已经存在'}
        }
        else{
            return {code:404,message:err.message}
        }
    }
}
//更新用户数据（PUT）
app.put('/update',checkToken,async (req,res)=>{
   const result = await SQL_upDate(req.tokenData.username,req.body.data) 
   res.json(result)
})
async function SQL_upDate(username,data){
    try{
    const [res]=await db.promise().query('UPDATE user_data SET data= ? where username= ?',[data,username])
    if(res.affectedRows===1){
        return {code:400,message:'更新成功'}
    }
    else{
        return {code:404,message:'更新失败'}
    }
}
catch(err){
    return {code:404,message:err.message}
}
    
}
//通过token获取数据
app.get('/tokenGet',checkToken,async (req,res)=>{
   let result= await SQL_tokenGet(req.tokenData.username)
   res.json(result)
})
async function SQL_tokenGet(username){
    try{
        const [res]=await db.promise().query('SELECT * FROM user_data where username = ?',[username])
       if(res.length===0){
        return {code:404,message:'未找到该用户'}
       }
       else {
        return {code:400,message:"登录成功",userdata:res[0].data}
       }
    }
    catch(err){
        console.log(err.message);
        throw err
    }
    
}

// 注册服务
app.listen(3000,function(){
    console.log('启动');
})