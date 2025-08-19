
import {
    login_API,
    register_API,

}from './setuser.js'
const USERNAME_REG=/^[a-zA-Z0-9_]{5,}$/
const PASSWORD_REG=/^(?=.*[a-z])(?=.*\d)[^\s]+$/
function promptWindow(msg){
    //创建
    const newElement = document.createElement('div');
    newElement.className= 'promptWindow'
    newElement.textContent =`${msg}`

    //插入
    document.querySelector('body').appendChild(newElement)
    //延时删除
    setTimeout(()=>{
        newElement.remove()
    },3000)

    
}
function turnIndex(){
    window.location.replace('index.html')
}
async function login_button(){
   const username= document.querySelector('.username input')
   const password=document.querySelector('.password input')
   if(USERNAME_REG.test(username.value)){
    promptWindow('该用户不存在')
    username.value=''
    password.value=''
    return
   }
   const res= await login_API(password.value,username.value)
   //1.
   if(res.code===404){
    promptWindow('sever未启动')
    return
   }
   //2.
   if(res.data.code===404){
    promptWindow(`${res.data.message}`)
    return
   }
   //成功
   localStorage.setItem('token',res.data.token)
   //跳转
   turnIndex()
}
;
(async ()=>{
document.querySelector('.login_button').addEventListener('click',login_button)

})()