
import {
    login_API,
    register_API,

} from './setuser.js'
const USERNAME_REG = /^[a-zA-Z0-9_]{6,12}$/
const PASSWORD_REG = /^(?=.*[a-z])(?=.*\d)[^\s]{9,20}$/
const NAME_REG = /^[a-zA-Z0-9\u4e00-\u9fa5]{5,30}$/
function promptWindow(msg) {
    //创建
    const newElement = document.createElement('div');
    newElement.className = 'promptWindow'
    newElement.textContent = `${msg}`

    //插入
    document.querySelector('body').appendChild(newElement)
    //延时删除
    setTimeout(() => {
        newElement.remove()
    }, 3000)


}
function turnIndex() {
    window.location.replace('index.html')
}
function turnLog_A(ele) {
    ele.parentNode.parentNode.style.transform = 'translateX(0)'
}
function turnReg_A(ele) {
    ele.parentNode.parentNode.style.transform = 'translateX(-50%)'
}
async function login_button() {
    const username = document.querySelector('.username + input')
    const password = document.querySelector('.password + input')
    if(username.value===''||password.value===''){
        promptWindow('输入不能为空')
        return
    }
    if (!USERNAME_REG.test(username.value)) {
        promptWindow('该用户不存在')
        username.value = ''
        password.value = ''
        return
    }
    const res = await login_API(password.value, username.value)
    //1.
    if (res.code === 404) {
        promptWindow('sever未启动')
        return
    }
    //2.
    if (res.data.code === 404) {
        promptWindow(`${res.data.message}`)
        return
    }
    //成功
    localStorage.setItem('token', res.data.token)
    //跳转
    turnIndex()
}
async function reg_button() {
    const dom1=document.querySelector('.reg_name_box input')
    const dom2=document.querySelector('.reg_username_box input')
    const dom3=document.querySelector('.reg_password_box input')
    const dom4=document.querySelector('.reg_password2_box input')
if(dom1.value===''||dom2.value===''||dom3.value===''||dom4.value===''){
    promptWindow('输入不能为空')
    return
}
if(!NAME_REG.test(dom1.value)||
   !USERNAME_REG.test(dom2.value)||
   !PASSWORD_REG.test(dom3.value)||
   !(dom3.value===dom4.value)
){
    promptWindow('输入不规范')
    return
}

let userData={
        default_last:{name:'陕西 西安',code:101110101,flag:true},
        arrConcern:[],
        historyArr:[],
        username:dom2.value,
    }
//尝试注册
let res= await register_API(dom3.value,dom2.value,JSON.stringify(userData),dom1.value)
//1.
if (res.code === 404) {
    promptWindow('sever未启动')
    return
}
//2.
if (res.data.code === 404) {
    promptWindow('注册失败')
    console.log(res);
    
    return
}
//3.
if (res.data.code === 405){
    promptWindow('用户名已存在')
    return
}
//成功
console.log(res);

promptWindow('注册成功')

//清空
dom1.value=''
dom2.value=''
dom3.value=''
dom4.value=''
}
;
(async () => {
    //登录
    document.querySelector('.login_button').addEventListener('click', login_button)
    //注册
    document.querySelector('.reg_button').addEventListener('click',reg_button)
    //转页面点击
    document.querySelector('.reg_A').addEventListener('click', (e) => {
        turnReg_A(e.target)
    })
    document.querySelector('.login_A').addEventListener('click', (e) => {
        turnLog_A(e.target)
    })
    //名称提示
    document.querySelector('.reg_name_box input').addEventListener('input', (e) => {
        let temp = document.querySelector('.name_prompt')
        if (NAME_REG.test(e.target.value)) {
            temp.innerHTML = ''
        }
        else {
            temp.innerHTML = '请输入5-30个字符，仅支持字母、数字和汉字。'
            if (e.target.value === '') {
                temp.style.color = 'silver'
            }
            else {
                temp.style.color = 'red'
            }
        }

    })
    //用户名提示
    document.querySelector('.reg_username_box input').addEventListener('input', (e) => {
        let temp = document.querySelector('.username_prompt')
        if (USERNAME_REG.test(e.target.value)) {
            temp.innerHTML = ''
        } else {
            temp.innerHTML = '仅支持字母、数字和下划线。长度6-12'
            if (e.target.value === '') {
                temp.style.color = 'silver'
            }
            else {
                temp.style.color = 'red'
            }
        }

    })
    //密码提示
    document.querySelector('.reg_password_box input').addEventListener('input', (e) => {
        let val = e.target.value
        let temp = document.querySelector('.password_prompt')
        if (PASSWORD_REG.test(val)) {
            temp.innerHTML = ''
        }
        else {
            if (val === '') {
                temp.innerHTML = '至少一个小写字母和数字，长度9-20'
                temp.style.color = 'silver'
            }
            else {
                temp.style.color = 'red'
                // 检查是否包含小写字母
                if (!/[a-z]/.test(val)) {
                    temp.innerHTML = '必须包含至少一个小写字母'
                    return
                }
                //是否包含数字
                if (!/\d/.test(val)) {
                    temp.innerHTML = '必须包含至少一个数字'
                    return
                }
                //长度检查
                if(val.length<9||val.length>20){
                    temp.innerHTML = '长度必须在9到20个字符'
                    return
                }
                
                temp.innerHTML='不支持空格等其他特殊字符'
            }

        }
    })
    //密码确认
    document.querySelector('.reg_password2_box input').addEventListener('input',(e)=>{
        let last=document.querySelector('.reg_password_box input').value
        let temp=document.querySelector('.password2_prompt')
        //上次通过才会触发提示
        if(PASSWORD_REG.test(last)){

            //相同
            if(last===e.target.value){
                temp.innerHTML=''
                return
            }
            //空
            if(e.target.value===''){
                temp.innerHTML='再次输入密码'
                temp.style.color='silver'
                return
            }
            //不同
            if(last!==e.target.value){
                temp.innerHTML='俩次密码不一致'
                temp.style.color='red'
                return
            }
            
        }

    })
})()