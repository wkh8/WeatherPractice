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
            nowCode.code = e.target.dataset.code
            addhistory({
                name:e.target.dataset.location.slice(dom.nav_navP.innerHTML.lastIndexOf(' ')+1),
                // navP.innerHTML.slice(navP.innerHTML.lastIndexOf(',')+1)
                code:e.target.dataset.code
            })
            console.log(nowCode.code);
        }

    }
})

//热门城市点击跳转
dom.nav_hotCity.addEventListener('click',function(e){
    if(e.target.parentNode.dataset.code!==undefined){
        let aim= e.target.parentNode
        console.log(`转到${aim.dataset.code}`);
        nowCode.code=Number(aim.dataset.code)
        // 改名
        dom.nav_navP.innerHTML=aim.dataset.name
        //历史记录
        addhistory({name:aim.dataset.name,
            code:aim.dataset.code
        })
    }
})

//关注城市的点击事件
dom.nav_concernLi.addEventListener('click',function(e){
    if(e.target.tagName==='P'){
       
        let parent=e.target.parentElement
        if(nowCode.code!==Number(parent.dataset.code)){
            //nowcode
            nowCode.code=Number(parent.dataset.code)
            dom.nav_navP.innerHTML=(e.target.parentElement).firstElementChild.firstElementChild.innerHTML
        }
    }
    if(e.target.className==='set_default'){
        // 设为默认
        if(e.target.innerHTML==='设为默认'){

        const aim= (e.target.parentElement).firstElementChild
        user_data.default_last={ name:aim.innerHTML,code:Number(e.target.parentElement.parentElement.dataset.code)}
        localStorage.setItem('default_last',JSON.stringify(user_data.default_last))//待修改
        }
        else {
            user_data.default_last={name:'陕西 西安',code:101110101,flag:true}
            localStorage.setItem('default_last',JSON.stringify(user_data.default_last))//待修改
        }
        //重新渲染关注列表
        render_concern(user_data.arrConcern)
    }
    if(e.target.className==='delete_concern')
    {
        let aimcode=Number(e.target.parentElement.dataset.code)
        //删除数组中的数据
        for(let i=0;i<user_data.ChangeConcern.length;i++){
            if(Number(user_data.ChangeConcern[i].code)===aimcode){    
               user_data.deleteConcern(i)
               //666妙手回春
                render_concern(user_data.arrConcern)
            }
        }
        // console.log(nowCode.code);
        // console.log(arrConcern);
        
        //删除html结构
        e.target.parentElement.remove()

    }
})

//点击添加当前城市数据到数组(关注添加)
dom.nav_concernBtn.addEventListener('click', function (e) {
    //阻止默认行为
    e.preventDefault()
    if (dom.nav_concernBtn.innerHTML === `[添加关注]`) {

        let nowdata =JSON.parse(localStorage.getItem('7ddata')).daily[0]//待修改
        if (user_data.ChangeConcern.length !== 5) {
            user_data.ChangeConcern.push({
                name:dom.nav_navP.innerHTML.slice(dom.nav_navP.innerHTML.lastIndexOf(' ')+1),
                code:nowCode.code,
                data:{
                    weatherName:nowdata.textDay,
                    Max:nowdata.tempMax,
                    Min:nowdata.tempMin,
                    icon:nowdata.iconDay
                }

            })
            dom.nav_concernBtn.innerHTML = `[已关注]`
            dom.nav_concernBtn.style.cursor = 'default' 
            localStorage.setItem('arrConcern',JSON.stringify(user_data.arrConcern))//待修改
        }
        else {
            dom.nav_fullCity.style.display = 'inline-block'
        }




    }
})

//清除历史记录的事件监听
dom.nav_clearBtn.addEventListener('click',function(e){
    e.preventDefault()
   localStorage.removeItem('historydata')//待修改
   dom.nav_history.style.display='none'
    
})

}
nav_main()

//默认渲染
// console.log(default_last);

//nav_导航栏





//检测当前城市是否包含在数组中
function judge_nowCity(){
    for(let i=0;i<user_data.arrConcern.length;i++){
        if(user_data.arrConcern[i]&&Number(nowCode.code)===Number(user_data.arrConcern[i].code)){
            // console.log('切换');
            dom.nav_concernBtn.innerHTML=`[已关注]`
            return
        }
    }
     dom.nav_concernBtn.innerHTML=`[添加关注]`
     dom.nav_concernBtn.style.cursor='pointer'
    //  console.log(arrConcern);
     
}

//渲染关注城市//用于监听数组函数调用
function render_concern(arr) {
    console.log(arr.length);
    
    let str = ''

   if(arr.length===0){
     str=`<span>点击“添加关注”添加城市哟~</span>`
   }
        for (let i=0;arr[i]&&i<arr.length;i++) {

            if(Number(arr[i].code)===Number(user_data.default_last.code)&&(!user_data.default_last.flag)){
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
function addhistory(obj){
   
    for(let i=0;i<user_data.historyArr.length;i++){
        if(Number(obj.code)===Number(user_data.historyArr[i].code)){
            return
        }
    }


    user_data.historyArr.unshift(obj)
    if(user_data.historyArr.length>4){//多余的删除
        user_data.historyArr.pop()
    }
    localStorage.setItem('historydata',JSON.stringify(user_data.historyArr))//存下待修改

    //渲染
    render_history()
    //调用时将历史栏设为显示
    dom.nav_history.style.display='block'

}//暂完

//历史记录渲染
function render_history(){
    //待加入
    if(user_data.historyArr.length===[].length){
        dom.nav_history.style.display='none'
        return
    }
    //不为空则要渲染
    let str=''
    for(let i=0;i<user_data.historyArr.length;i++){
        str= str+ `<li data-code="${user_data.historyArr[i].code}" data-name="${user_data.historyArr[i].name}"><p>${user_data.historyArr[i].name}</p></li>`
    }

    dom.nav_historyUl.innerHTML=str
}
function render() {  // 默认渲染
    render_concern(user_data.arrConcern)//关注记录
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
    dom.nav_navP.innerHTML=user_data.default_last.name
}
//第一次渲染


 




const user_data=(()=>{
//历史记录，关注数组，默认城市
    let userData={
        default_last:JSON.parse(localStorage.getItem('default_last'))||{name:'陕西 西安',code:101110101,flag:true},
        arrConcern:JSON.parse(localStorage.getItem('arrConcern'))||[],
        historyArr:JSON.parse(localStorage.getItem('historydata'))||[]
    }

    //默认的
    

    //监听关注数组变化
    const ChangeConcern = new Proxy(userData.arrConcern, {

    set(target, property, value) {
        if (property === 'length') {
        // console.log('检测到增加');
        render_concern(userData.arrConcern)
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

    return {
        historyArr:userData.historyArr,//返回历史数组
        default_last:userData.default_last,//返回默认城市
        ChangeConcern:ChangeConcern,//检测改变关注数组
        deleteConcern(i){
            delete ChangeConcern[i]
            userData.arrConcern.splice(i,1)
            localStorage.setItem('arrConcern',JSON.stringify(userData.arrConcern))
        },//删除
        arrConcern:userData.arrConcern
        
        


    }

})()

  //初始化天气代码
  const WeatherCode = { code: user_data.default_last.code }
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
  default_location()
  render(nowCode)



//引入css
// import '../css/base.css'
// import '../css/main_body.css'
// import '../css/nav_bottom.css'
// import '../css/nav.css'
// import '../css/footer.css'