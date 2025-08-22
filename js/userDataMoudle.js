
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
    let token = localStorage.getItem('token')
    let temp = await tokenGet_API(token)
    let userData
    // console.log(temp);
    if (temp.data&&temp.data.code === 400) {//自动登录成功
        userData = temp.data.userdata
    }
    else {//否则
        //跳转至登录页面
        turnLogin()
    }
    //userdata要加username
    async function setUser() {//更新数据
    let res= await upDate_API(userData.username,JSON.stringify(userData),token)
    console.log(res);
    //token过期
    if(res.data.code===102){
        turnLogin()
    }

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