// const axios=require('axios')//引入到浏览器时要去掉
//得到用户数据(get)
//更新用户数据(PUT)
//删除用户数据(delete)
//注册用户数据(post)
//获得上次凭证卸载nav.js中,当上次为匿名时,本地获取,否则使用login获取
// eslint-disable-next-line no-undef
const api=axios.create({
    baseURL:'http://localhost:3000/',
    timeout:10000,
});

// (()=>{ 
// register_AQI('123456','wkhw','7777','name222').then(res=>{
//     console.log(res.data);
    
// })
// // upDate_AQI('wkhwkh','123').then(res=>{
// //     console.log(res.data);
// // })
// // login_AQI('123456','wkhwkh').then(res=>{
// //     console.log(res.data);
// // })
// ;
// })()


;
// //得到即登录
;
 export async function login_API(password,username){
    try{
        let result= await api.get('/login',{
            params:{
                username:username,
                password:password,
            }
        })
        return result
    }
    catch(err){
        return err
    }

}
//注册
;
export async function register_API(password,username,data,name){
    try {
       const result = await api.post('/register',
            {password,
            username,
            data,
            name
            })
        return result
    }
    catch(err){
        return err
    }

}
//更新数据
export async function upDate_API(username,data,token){
    try{
       const result= await api.put('/update',
            {username,
                data,
            },
        {
            headers:{
                Authorization: token
             }
        })
        return result
    }catch(err){
        return err
    }
    
}
//token获取数据
export async function tokenGet_API(token){
    try{
        const result= await api.get('/tokenGet',
             {headers:{
                Authorization: token
             }
             })
         return result
     }catch(err){
         return err
     }
    
}
