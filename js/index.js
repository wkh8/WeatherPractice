import {
    debounce,//防抖
    getApiData, //api获取数据
    oneDayUrl,//生活指数
    sevenDayUrl,//七日预报
    allHourUrl,//未来24h天气预报
    nowUrl,//当前实况天气
    changeLocation,//改变api的城市代码
} from "./base.js"


//nav_导航栏
// 获取所有城市 本地存储
axios({
    url: '../data/localData/city.json'
}).then(response => {
    const AllcCty = response.data
    localStorage.setItem('WeatherCity', JSON.stringify(AllCity))
})
//获取到城市
const AllCity = JSON.parse(localStorage.getItem('WeatherCity'))

let AimCity
let SearchTimer = null//搜索节流
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
    }, 100)

})
//搜索框添加事件
search_city.addEventListener('input',
    debounce(function () {
        // console.log('更新搜索结果');
        search_list_ul.innerHTML = ''
        let key = search_city.value
        if (key !== "") {//不为空字符串搜索

            hot_city.style.display = 'none'//隐藏热门城市

            search_list.style.display = 'block'//给出搜索框
            // console.log(key);//测试

            AimCity = AllCity.filter(function (item, index) {
                return item.name.includes(key)
            })

            // console.log(AimCity);//测试
            //处理Aimcity
            if (AimCity.length !== 0) {
                AimCity = AimCity.map(function (item) {
                    const highlightedName = item.name.replace(
                        new RegExp(`(${key})`, 'gi'),
                        '<span class="highlight">$1</span>'
                    );
                    return `<li data-code="${item.code}">${highlightedName}</li>`;
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
    }, 300)



)//搜索框事件结束

//初始化天气代码
function firstCode() {
    if (localStorage.getItem('code')) {
        console.log(localStorage.getItem('code'));
        return JSON.parse(localStorage.getItem('code'))

    }
    else {
        return { code: 101110101 }
    }
}

const WeatherCode = firstCode()
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
render(nowCode)//第一次渲染
//点击改变天气代码code
const search_li = document.querySelector(`.search_list ul`)
search_li.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        // console.log('清空');
        search_city.value = ''
        //有代码才改变
        if (e.target.dataset.code) {
            nowCode.code = e.target.dataset.code
            console.log(nowCode.code);
        }

    }
})
//添加关注
const arrConcern = JSON.parse(localStorage.getItem('arrConcern')) || []

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
        return Reflect.set(target, property, value)
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
        if(arrConcern[i]&&nowCode.code===arrConcern[i].code){
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
//点击添加当前城市数据到数组
addConcern.addEventListener('click', function (e) {
    //阻止默认行为
    e.preventDefault()
    if (addConcern.innerHTML === `[添加关注]`) {

        let nowdata =JSON.parse(localStorage.getItem('7ddata')).daily[0]
        if (ChangeConcern.length !== 5) {
            ChangeConcern.push({name:navP.innerHTML.slice(navP.innerHTML.lastIndexOf(',')+1),code:nowCode.code,
                data:{
                    weatherName:nowdata.textDay,
                    Max:nowdata.tempMax,
                    Min:nowdata.tempMin,
                    icon:nowdata.iconDay
                }

            })
            addConcern.innerHTML = `[已关注]`
            addConcern.style.cursor = 'default'
        }
        else {
            fullCity.style.display = 'inline-block'
        }




    }
})

//添加渲染关注城市//用于监听数组函数调用
function render_concern(arr) {
    const concernLi = document.querySelector(`.concern ul`)
    let str = concernLi.innerHTML
    if (concernLi.innerHTML === '') {//初始化
        // console.log('111');
        
        for (let i=0;arrConcern[i]&&i<arr.length;i++) {
            str= str+ `<li data-code="${arr[i].code}">
           <p>${arr[i].name}
           <a class="set_default">设为默认</a>
           </p>
            <p class="weather" data-icon="${arr[i].data.icon}">${arr[i].data.weatherName}</p>
            <p class="temperature">${arr[i].data.Min}°/${arr[i].data.Max}°</p>
            <a class="delete_concern"></a>
            </li>`
            
        }
    }
    else{//添加最后一个
        str=str+ `<li data-code="${arr[arr.length-1].code}">
        <p>${arr[arr.length-1].name}
         <a class="set_default">设为默认</a>
        </p>
        <p class="weather" data-icon="${arr[arr.length-1].data.icon}">${arr[arr.length-1].data.weatherName}</p>
        <p class="temperature">${arr[arr.length-1].data.Min}°/${arr[arr.length-1].data.Max}°</p>
        <a class="delete_concern"></a>
        </li>`
    }
    concernLi.innerHTML=str

}
//关注城市的点击事件
const concernLi = document.querySelector(`.concern ul`)
concernLi.addEventListener('click',function(e){
    if(e.target.tagName==='P'){
       
        let parent=e.target.parentElement
        if(nowCode.code!==Number(parent.dataset.code)){
            console.log('转到该城市');
            //nowcode
            nowCode.code=Number(parent.dataset.code)
        }
    }
    if(e.target.className==='set_default'){
        console.log('设为默认');
    }
    if(e.target.className==='delete_concern')
    {
        let aimcode=Number(e.target.parentElement.dataset.code)
        
        //删除数组中的数据
        for(let i=0;i<ChangeConcern.length;i++){
            if(Number(ChangeConcern[i].code)===aimcode){

                
                delete ChangeConcern[i]
                arrConcern.splice(i,1)//666妙手回春
            }
        }
        // console.log(nowCode.code);
        // console.log(arrConcern);
        
        //删除html结构
        e.target.parentElement.remove()

    }
})


function render(nowCode) {
    render_OneDay(getApiData(changeLocation(oneDayUrl, String(nowCode.code))))//指数
    render_7d( getApiData(changeLocation(sevenDayUrl, String(nowCode.code))))//七日预报
    getApiData(changeLocation(allHourUrl, String(nowCode.code)))//逐小时播报
    render_now(getApiData(changeLocation(nowUrl, String(nowCode.code))))//实况

}
//生活指数渲染
function render_OneDay(res) {

    res.then(f => {
        let res = f.data




    })
}
//当前渲染
function render_now(res){
    res.then(f => {
        let res = f.data
        localStorage.setItem('nowdata',JSON.stringify(res))
    })
}
//7日数据
function render_7d(res){
    res.then(f => {
        let res = f.data
        console.log(res);
        
        localStorage.setItem('7ddata',JSON.stringify(res))
    })
}
