
import {
    tokenGet_API,
    login_API,
    upDate_API,
} from './setuser.js'
import {
    render_concern,
    render_history,
    judge_nowCity,
} from './nav.js'
import {
    dom,
} from './dom.js'
export const user_data = {}


function turnLogin(){
    window.location.replace('login.html')
}
await (async () => {
    //历史记录，关注数组，默认城市
    //初始化userData
    // let userData={
    //     default_last:lastUser.default_last||{name:'陕西 西安',code:101110101,flag:true},
    //     arrConcern:lastUser.arrConcern||[],
    //     historyArr:lastUser.historyArr||[]
    // }
//测试
localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndraCIsImlhdCI6MTc1NTQyMzEyMCwiZXhwIjoxNzU1NDMwMzIwfQ.Lm7KFw5_zIg6kIGiVtg1NJcT6gP4ipPfzTBmgM-gNF')

    let token = localStorage.getItem('token')
    let temp = await tokenGet_API(token)
    console.log(temp);
    
    let userData
    if (temp.data&&temp.data.code === 400) {//自动登录成功
        userData = JSON.parse(temp.data.userdata)
    }
    else {//否则
        //跳转至登录页面
        turnLogin()
    }
    //userdata要加username
    function setUser() {//更新数据
      
    }



    //默认的

    Object.assign(user_data,{
        deleteConcern(i) {
            userData.arrConcern.splice(i, 1)
            render_concern(userData.arrConcern)
            judge_nowCity()
            setUser()
        },//删除
        addConcern(obj) {
            userData.arrConcern.push(obj)
            render_concern(userData.arrConcern)
            judge_nowCity()
            setUser()
        },
        getArrConcern() {
            return [...userData.arrConcern]
        },
        deleteHistory() {
            userData.historyArr = []
            setUser()
        },
        addHistory(obj) {
            for (let i = 0; i < userData.historyArr.length; i++) {
                if (Number(obj.code) === Number(userData.historyArr[i].code)) {
                    return
                }
            }
            userData.historyArr.unshift(obj)
            if (userData.historyArr.length > 4) {//多余的删除
                userData.historyArr.pop()
            }
            render_history()
            //调用时将历史栏设为显示
            dom.nav_history.style.display = 'block'
            setUser()
        },
        getHistory() {
            return [...userData.historyArr]
        },
        getDefault() {
            return { ...userData.default_last }
        },
        setDefault(obj) {
            userData.default_last = { ...obj }
            setUser()
        },


    })
})()