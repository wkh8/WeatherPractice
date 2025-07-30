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



let default_last=JSON.parse(localStorage.getItem('default_last'))||{name:'陕西,西安',code:101110101,flag:true}
//默认渲染
// console.log(default_last);

//nav_导航栏




let AimCity=[]
//搜索节流
//添加事件
const search_city = document.querySelector(`.search_city`)
const search_list = document.querySelector(`.search_list`)
const search_list_ul = document.querySelector(`.search_list ul`)
const hot_city = document.querySelector('.hot_city')
//搜索框获得焦点
search_city.addEventListener('focus', function () {
    hot_city.style.display = 'block'
})
//搜索框失去焦点
search_city.addEventListener('blur', function () {
    setTimeout(function () {
        hot_city.style.display = 'none'
        search_list.style.display = 'none'
          search_city.value = ''
    }, 200)

})
//搜索框的事件
search_city.addEventListener('input',
    debounce(async()=> {
        // console.log('更新搜索结果');
        try{
        search_list_ul.innerHTML = ''
        let key = search_city.value
        if (key !== "") {//不为空字符串搜索

            hot_city.style.display = 'none'//隐藏热门城市

            search_list.style.display = 'block'//给出搜索框
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
                search_list_ul.innerHTML = AimCity.join('')
                // console.log(AimCity);
            }
            else {
                search_list_ul.innerHTML = `<li style="text-align: center; color: #888;">抱歉，未找到相关位置</li>`//搜索不到的提示
            }
        }
        else {
            console.log('没有');
            hot_city.style.display = 'block'//给出热门城市
            search_list.style.display = 'none'//隐藏搜索框
        }
    }
    catch(e){
        console.log(e);
        
    }
}, 500)



)//搜索框事件结束

//初始化天气代码
const WeatherCode = { code: default_last.code }
localStorage.setItem('code', JSON.stringify(WeatherCode))
//检测天气代码改变
const nowCode = new Proxy(WeatherCode, {
    set(target, key, val) {
        // console.log(`属性 ${key} 从 ${target[key]} 变成 ${val}`);
        target[key] = val
        localStorage.setItem('code', JSON.stringify(WeatherCode))
        //得到数据并渲染
        render(nowCode)
        //检测当前城市是否在其中
        judge_nowCity()
        return true
    }
})

//点击改变天气代码code//并且改变定位（搜索框的跳转）
const search_li = document.querySelector(`.search_list ul`)
search_li.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        // console.log('清空');
        search_city.value = ''
        //有代码才改变
        if (e.target.dataset.code) {
            navP.innerHTML= e.target.dataset.location
            nowCode.code = e.target.dataset.code
            addhistory({
                name:e.target.dataset.location.slice(navP.innerHTML.lastIndexOf(' ')+1),
                // navP.innerHTML.slice(navP.innerHTML.lastIndexOf(',')+1)
                code:e.target.dataset.code
            })
            console.log(nowCode.code);
        }

    }
})

const arrConcern = arrConcern1()
function arrConcern1(){
    if(JSON.parse(localStorage.getItem('arrConcern'))){
        return JSON.parse(localStorage.getItem('arrConcern'))
    }
    else{
        return []
    }
}
//热门城市点击跳转
hot_city.addEventListener('click',function(e){
    if(e.target.parentNode.dataset.code!==undefined){
        let aim= e.target.parentNode
        console.log(`转到${aim.dataset.code}`);
        nowCode.code=Number(aim.dataset.code)
        let changeNavP=document.querySelector('.nav_p')
        // 改名
        changeNavP.innerHTML=aim.dataset.name
        //历史记录
        addhistory({name:aim.dataset.name,
            code:aim.dataset.code
        })

        
        

    }
})
//监听关注数组变化
const ChangeConcern = new Proxy(arrConcern, {

    set(target, property, value) {
        if (property === 'length') {
        // console.log('检测到增加');
        render_concern(arrConcern)
        // console.log(arrConcern);
        //检测当前城市是否包含在数组中
        judge_nowCity()
        

        }
        let a=Reflect.set(target, property, value)
        return a
    },
    deleteProperty(target, property) {
        // console.log('检测到删除');
        //检测当前城市是否包含在数组中


        //删除前
        let result=Reflect.deleteProperty(...arguments);
        //删除后
        judge_nowCity()

        return  result
    }

})


//检测当前城市是否包含在数组中
function judge_nowCity(){
    const willchange=document.querySelector('.nav_a:last-of-type')//得到要改变的关注按钮
    for(let i=0;i<arrConcern.length;i++){
        if(arrConcern[i]&&Number(nowCode.code)===Number(arrConcern[i].code)){
            // console.log('切换');
            willchange.innerHTML=`[已关注]`
            return
        }
    }
     willchange.innerHTML=`[添加关注]`
     willchange.style.cursor='pointer'
    //  console.log(arrConcern);
     
}



//关注按钮
const fullCity = document.querySelector(`.full_city`)
const addConcern = document.querySelector('.nav_a:last-of-type')
const navP=document.querySelector(`.nav_p`)

//离开按钮隐藏
addConcern.addEventListener('mouseleave', function () {
    fullCity.style.display = 'none'
})
//点击添加当前城市数据到数组(关注添加)
addConcern.addEventListener('click', function (e) {
    //阻止默认行为
    e.preventDefault()
    if (addConcern.innerHTML === `[添加关注]`) {

        let nowdata =JSON.parse(localStorage.getItem('7ddata')).daily[0]
        if (ChangeConcern.length !== 5) {
            ChangeConcern.push({name:navP.innerHTML.slice(navP.innerHTML.lastIndexOf(' ')+1),code:nowCode.code,
                data:{
                    weatherName:nowdata.textDay,
                    Max:nowdata.tempMax,
                    Min:nowdata.tempMin,
                    icon:nowdata.iconDay
                }

            })
            addConcern.innerHTML = `[已关注]`
            addConcern.style.cursor = 'default' 
            localStorage.setItem('arrConcern',JSON.stringify(arrConcern))
        }
        else {
            fullCity.style.display = 'inline-block'
        }




    }
})

//添加渲染关注城市//用于监听数组函数调用
function render_concern(arr) {
    // console.log('arrrrrrr');
    
    // console.log(arr);
    
    const concernLi = document.querySelector(`.concern ul`)
    let str = ''
   
        for (let i=0;arrConcern[i]&&i<arr.length;i++) {

            if(Number(arr[i].code)===Number(default_last.code)&&(!default_last.flag)){
                str= str+ `<li data-code="${arr[i].code}">
           <p class="default_color">
           <span>${arr[i].name}</span>
           <a class="set_default">取消默认</a>
           </p>
            <p class="weather" data-icon="${arr[i].data.icon}">${arr[i].data.weatherName}</p>
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
            <p class="weather" data-icon="${arr[i].data.icon}">${arr[i].data.weatherName}</p>
            <p class="temperature">${arr[i].data.Min}°/${arr[i].data.Max}°</p>
            <a class="delete_concern"></a>
            </li>`
        }
        }
    
    concernLi.innerHTML=str

}
//关注城市的点击事件
const concernLi = document.querySelector(`.concern ul`)
concernLi.addEventListener('click',function(e){
    if(e.target.tagName==='P'){
       
        let parent=e.target.parentElement
        if(nowCode.code!==Number(parent.dataset.code)){
            //nowcode
            nowCode.code=Number(parent.dataset.code)
            navP.innerHTML=(e.target.parentElement).firstElementChild.firstElementChild.innerHTML
        }
    }
    if(e.target.className==='set_default'){
        // 设为默认
        if(e.target.innerHTML==='设为默认'){

        const aim= (e.target.parentElement).firstElementChild
        default_last={ name:aim.innerHTML,code:Number(e.target.parentElement.parentElement.dataset.code)}
        localStorage.setItem('default_last',JSON.stringify(default_last))
        }
        else {
            default_last={name:'陕西,西安',code:101110101,flag:true}
            localStorage.setItem('default_last',JSON.stringify(default_last))
        }
        //重新渲染关注列表
        render_concern(arrConcern)

    }
    if(e.target.className==='delete_concern')
    {
        let aimcode=Number(e.target.parentElement.dataset.code)
        //删除数组中的数据
        for(let i=0;i<ChangeConcern.length;i++){
            if(Number(ChangeConcern[i].code)===aimcode){

                
                delete ChangeConcern[i]
                arrConcern.splice(i,1)//666妙手回春
                localStorage.setItem('arrConcern',JSON.stringify(arrConcern))
            }
        }
        // console.log(nowCode.code);
        // console.log(arrConcern);
        
        //删除html结构
        e.target.parentElement.remove()

    }
})
//历史记录
// obj= {code:,name:}
function addhistory(obj){
    const historyArr= JSON.parse(localStorage.getItem('historydata'))||[]
    for(let i=0;i<historyArr.length;i++){
        if(Number(obj.code)===Number(historyArr[i].code)){
            return
        }
    }


    historyArr.unshift(obj)
    if(historyArr.length>4){//多余的删除
        historyArr.pop()
    }
    localStorage.setItem('historydata',JSON.stringify(historyArr))//存下
    //渲染
    render_history()
    //调用时将历史栏设为显示
    const r=document.querySelector('.history')
    r.style.display='block'

}
//清除历史记录的事件监听
const clearHistory=document.querySelector('.btn')
clearHistory.addEventListener('click',function(e){
    e.preventDefault()
   const clearAim=document.querySelector('.history')
   localStorage.removeItem('historydata')
   clearAim.style.display='none'
    
})
//历史记录渲染
function render_history(){
    const r=document.querySelector('.history')
    const historyArr= JSON.parse(localStorage.getItem('historydata'))||[]
    if(historyArr.length===[].length){
        r.style.display='none'
        return
    }
    //不为空则要渲染
    let str=''
    for(let i=0;i<historyArr.length;i++){
        str= str+ `<li data-code="${historyArr[i].code}" data-name="${historyArr[i].name}"><p>${historyArr[i].name}</p></li>`
    }
    const ul=document.querySelector('.history ul')
    ul.innerHTML=str
}
function render() {  // 默认渲染
    render_concern(arrConcern)//关注记录
    judge_nowCity()
    console.log(`请求${nowCode.code}数据`);
    render_history()//历史记录渲染
    render_OneDay(getApiData(changeLocation(oneDayUrl, String(nowCode.code))))//指数
    render_7d(getApiData(changeLocation(sevenDayUrl, String(nowCode.code))),getApiData(changeLocation(yesterdayUrl, String(nowCode.code))))//七日预报(包括昨天数据)
    render_hours(getApiData(changeLocation(allHourUrl, String(nowCode.code))),getApiData(changeLocation(sevenDayUrl, String(nowCode.code))))//逐小时播报
    render_now(getApiData(changeLocation(nowUrl, String(nowCode.code))))//实况
    render_warning(getApiData(changeLocation(warningUrl, String(nowCode.code))))
    render_air(getApiData(changeLocation(airUrl, String(nowCode.code))))
}




function default_location(){//默认渲染
    const aim=document.querySelector(`.nav_p`)
    aim.innerHTML=default_last.name
}
//第一次渲染
default_location()
render(nowCode)





//引入css
// import '../css/base.css'
// import '../css/main_body.css'
// import '../css/nav_bottom.css'
// import '../css/nav.css'
// import '../css/footer.css'