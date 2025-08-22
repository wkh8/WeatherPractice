import {
    debounce,//防抖
    getApiData, //api获取数据
    oneDayUrl,//生活指数
    sevenDayUrl,//七日预报
    allHourUrl,//未来24h天气预报
    nowUrl,//当前实况天气
    changeLocation,
    yesterdayUrl,//改变api的城市代码
    cityUrl,//城市天气代码
    warningUrl,//警报url
    airUrl,//空气指数
} from "./base.js"

import {
    render_now,  //实况
    render_warning,//警报
    render_air,//空气指数
} from "./nav_bottom.js"

import {
    render_hours,   //逐小时预报
} from './hours.js'
import {
    render_7d, //七日
    render_OneDay,//生活指数
} from './main_body.js'
import {
    dom
}
from './dom.js'
import {
user_data,
}
from './userDataMoudle.js'
//事件监听
function nav_main(){
    let AimCity=[]

//搜索框获得焦点
dom.nav_searchCity.addEventListener('focus', function () {
    dom.nav_hotCity.style.display = 'block'
})

//搜索框失去焦点
dom.nav_searchCity.addEventListener('blur', function () {
    setTimeout(function () {
        dom.nav_hotCity.style.display = 'none'
        dom.nav_searchList.style.display = 'none'
          dom.nav_searchCity.value = ''
    }, 200)

})

//离开按钮隐藏
dom.nav_concernBtn.addEventListener('mouseleave', function () {
    dom.nav_fullCity.style.display = 'none'
})

//搜索框的事件
dom.nav_searchCity.addEventListener('input',
    debounce(async()=> {
        // console.log('更新搜索结果');
        try{
        dom.nav_searchListUl.innerHTML = ''
        let key = dom.nav_searchCity.value
        if (key !== "") {//不为空字符串搜索

            dom.nav_hotCity.style.display = 'none'//隐藏热门城市

            dom.nav_searchList.style.display = 'block'//给出搜索框
            // console.log(key);//测试

            //获取aimcity
             const res= await getApiData(changeLocation(cityUrl,key))
             
             const fis=res.data.location||[]
            //  初始化
            AimCity=[]
             //处理成之前的模式
            for(let i=0;i<fis.length;i++){
               const strname=[fis[i].adm1,fis[i].adm2,fis[i].name].filter(Boolean).
               filter((v,r,arr)=>arr.indexOf(v)===r).join(',')
               AimCity.push({name:strname,
                code:fis[i].id,
                location:fis[i].adm1+' '+fis[i].name
                   })
            }
            
                


           
            // console.log(AimCity);//测试
            //处理Aimcity
            if (AimCity.length !== 0) {
                AimCity = AimCity.map(function (item) {
                    const highlightedName = item.location.replace(
                        new RegExp(`(${key})`, 'gi'),
                        '<span class="highlight">$1</span>'
                    );
                    return `<li data-code="${item.code}"  data-location="${item.location}">${highlightedName}</li>`;
                })
                dom.nav_searchListUl.innerHTML = AimCity.join('')
                // console.log(AimCity);
            }
            else {
                dom.nav_searchListUl.innerHTML = `<li style="text-align: center; color: #888;">抱歉，未找到相关位置</li>`//搜索不到的提示
            }
        }
        else {
            console.log('没有');
            dom.nav_hotCity.style.display = 'block'//给出热门城市
            dom.nav_searchList.style.display = 'none'//隐藏搜索框
        }
    }
    catch(e){
        console.log(e);
        
    }
}, 500)



)//搜索框事件结束

//点击改变天气代码code//并且改变定位（搜索框的跳转）
dom.nav_searchListUl.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        // console.log('清空');
        dom.nav_searchCity.value = ''
        //有代码才改变
        if (e.target.dataset.code) {
            dom.nav_navP.innerHTML= e.target.dataset.location
            CodeNow.setNowCode(e.target.dataset.code)
            user_data.addHistory({
                name:e.target.dataset.location.slice(dom.nav_navP.innerHTML.lastIndexOf(' ')+1),
                // navP.innerHTML.slice(navP.innerHTML.lastIndexOf(',')+1)
                code:e.target.dataset.code
            })
        }

    }
})

//热门城市点击跳转
dom.nav_hotCity.addEventListener('click',function(e){
    if(e.target.parentNode.dataset.code!==undefined){
        let aim= e.target.parentNode
        CodeNow.setNowCode(aim.dataset.code)
        // 改名
        dom.nav_navP.innerHTML=aim.dataset.name
        //历史记录
        user_data.addHistory({name:aim.dataset.name,
            code:aim.dataset.code
        })
    }
})

//关注城市的点击事件
dom.nav_concernLi.addEventListener('click',function(e){
    if(e.target.tagName==='P'){//转到关注城市
       
        let parent=e.target.parentElement
        if(CodeNow.getNowCode()!==Number(parent.dataset.code)){
            CodeNow.setNowCode(parent.dataset.code)
            dom.nav_navP.innerHTML=(e.target.parentElement).firstElementChild.firstElementChild.innerHTML
        }
    }
    if(e.target.className==='set_default'){
        // 设为默认
        if(e.target.innerHTML==='设为默认'){

        const aim= (e.target.parentElement).firstElementChild
        user_data.setDefault({ name:aim.innerHTML,code:Number(e.target.parentElement.parentElement.dataset.code)})
        }
        else {
            user_data.setDefault({name:'陕西 西安',code:101110101,flag:true})
        }
        //重新渲染关注列表
        render_concern(user_data.getArrConcern())
    }
    if(e.target.className==='delete_concern')
    {//删除默认
        let aimcode=Number(e.target.parentElement.dataset.code)
        //删除数组中的数据
        let concernarr=user_data.getArrConcern()
        for(let i=0;i<concernarr.length;i++){
            if(Number(concernarr[i].code)===aimcode){    
               user_data.deleteConcern(i)
            }
        }
        //删除html结构
        e.target.parentElement.remove()

    }
})//改

//点击添加当前城市数据到数组(关注添加)
dom.nav_concernBtn.addEventListener('click', function (e) {
    //阻止默认行为
    e.preventDefault()
    if (dom.nav_concernBtn.innerHTML === `[添加关注]`) {

        let nowdata =JSON.parse(localStorage.getItem('7ddata')).daily[0]
        if (user_data.getArrConcern().length !== 5) {
            user_data.addConcern({
                name:dom.nav_navP.innerHTML.slice(dom.nav_navP.innerHTML.lastIndexOf(' ')+1),
                code:CodeNow.getNowCode(),
                data:{
                    weatherName:nowdata.textDay,
                    Max:nowdata.tempMax,
                    Min:nowdata.tempMin,
                    icon:nowdata.iconDay
                }

            })
        }
        else {
            dom.nav_fullCity.style.display = 'inline-block'
        }




    }
})

//清除历史记录的事件监听
dom.nav_clearBtn.addEventListener('click',function(e){
    e.preventDefault()
   user_data.deleteHistory()
   dom.nav_history.style.display='none'
    
})//改

dom.exitBtn.addEventListener('click',()=>{
    localStorage.setItem('token','')
    window.location.replace('login.html')
})
}
nav_main()

//默认渲染

//nav_导航栏





//仅用于user——data与初次渲染（判断当前城市是否已经再关注数组中）
export function judge_nowCity(){
    let concernarr=user_data.getArrConcern()
    for(let i=0;i<concernarr.length;i++){
        if(CodeNow.getNowCode()===Number(concernarr[i].code)){
            // console.log('切换');
            dom.nav_concernBtn.innerHTML=`[已关注]`
            dom.nav_concernBtn.style.cursor = 'default'
            return
        }
    }
     dom.nav_concernBtn.innerHTML=`[添加关注]`
     dom.nav_concernBtn.style.cursor='pointer'
    //  console.log(arrConcern);
     
}
//渲染关注城市//用于监听数组函数调用
export function render_concern(arr) {
    let def=user_data.getDefault()
    console.log(arr.length);
    
    let str = ''

   if(arr.length===0){
     str=`<span>点击“添加关注”添加城市哟~</span>`
   }
   
        for (let i=0;arr[i]&&i<arr.length;i++) {

            if(Number(arr[i].code)===Number(def.code)&&(!def.flag)){
                str= str+ `<li data-code="${arr[i].code}">
           <p class="default_color">
           <span>${arr[i].name}</span>
           <a class="set_default">取消默认</a>
           </p>
            <img src="./data/img/small${arr[i].data.icon}.png" alt="">
            <p class="weather">${arr[i].data.weatherName}</p>
            <p class="temperature">${arr[i].data.Min}°/${arr[i].data.Max}°</p>
            <a class="delete_concern"></a>
            </li>`
            }
            else{

            
            str= str+ `<li data-code="${arr[i].code}">
           <p>
           <span>${arr[i].name}</span>
           <a class="set_default">设为默认</a>
           </p>
            <img src="./data/img/small${arr[i].data.icon}.png" alt="">
            <p class="weather" data-icon="${arr[i].data.icon}">${arr[i].data.weatherName}</p>
            <p class="temperature">${arr[i].data.Min}°/${arr[i].data.Max}°</p>
            <a class="delete_concern"></a>
            </li>`
        }
        }
    
    dom.nav_concernLi.innerHTML=str

}
//历史记录
// obj= {code:,name:}
//历史记录渲染
export function render_history(){
    //待加入
    let historyArr=user_data.getHistory()
    if(historyArr.length===[].length){
        dom.nav_history.style.display='none'
        return
    }
    //不为空则要渲染
    let str=''
    for(let i=0;i<historyArr.length;i++){
        str= str+ `<li data-code="${historyArr[i].code}" data-name="${historyArr[i].name}"><p>${historyArr[i].name}</p></li>`
    }

    dom.nav_historyUl.innerHTML=str
}
function render() {  // 默认渲染
    render_concern(user_data.getArrConcern())//关注记录
    judge_nowCity()
    console.log(`请求${CodeNow.getNowCode()}数据`);
    render_history()//历史记录渲染
    render_OneDay(getApiData(changeLocation(oneDayUrl, String(CodeNow.getNowCode()))))//指数
    render_7d(getApiData(changeLocation(sevenDayUrl, String(CodeNow.getNowCode()))),getApiData(changeLocation(yesterdayUrl, String(CodeNow.getNowCode()))))//七日预报(包括昨天数据)
    render_hours(getApiData(changeLocation(allHourUrl, String(CodeNow.getNowCode()))),getApiData(changeLocation(sevenDayUrl, String(CodeNow.getNowCode()))))//逐小时播报
    render_now(getApiData(changeLocation(nowUrl, String(CodeNow.getNowCode()))))//实况
    render_warning(getApiData(changeLocation(warningUrl, String(CodeNow.getNowCode()))))
    render_air(getApiData(changeLocation(airUrl, String(CodeNow.getNowCode()))))
}
//15日天气预报的插入
export function add_15d() {
    dom.body_tempWeather.href = `https://www.weather.com.cn/weather15d/${CodeNow.getNowCode()}.shtml`
}

//第一次渲染


const CodeNow=(()=>{
    let code=user_data.getDefault().code

    return {
        getNowCode(){
            return Number(code)
        },
        setNowCode(aim){
            code=Number(aim)
        render(code)//调用渲染
        }
    }
})()
function default_location(){//默认渲染
    dom.nav_navP.innerHTML=user_data.getDefault().name
}
  default_location()
  render(CodeNow.getNowCode())



//引入css
// import '../css/base.css'
// import '../css/main_body.css'
// import '../css/nav_bottom.css'
// import '../css/nav.css'
// import '../css/footer.css'