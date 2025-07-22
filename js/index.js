import  {
    debounce,//防抖
    getApiData, //api获取数据
    oneDayUrl,//生活指数
    sevenDayUrl,//七日预报
    allHourUrl,//未来24h天气预报
    nowUrl,//当前实况天气
    changeLocation,//改变api的城市代码
} from "./base.js"


//nav_
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
const search_list = document.querySelector(`.search_list ul`)
//搜索框添加事件
search_city.addEventListener('input',
    debounce(function () {
        // console.log('更新搜索结果');
        search_list.innerHTML = ''



        let key = search_city.value
        if (key !== "") {//不为空字符串搜索
            

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
                search_list.innerHTML = AimCity.join('')

                // console.log(AimCity);
            }
            else {
                search_list.innerHTML = ``//搜索不到的提示


            }
        }
        else{
            console.log('没有');//给出热门城市
        }
    }, 300)



)//搜索框事件结束

//初始化天气代码
function firstCode(){
    if(localStorage.getItem('code')){
        console.log(localStorage.getItem('code'));
        return JSON.parse(localStorage.getItem('code'))
        
    }
    else{
        return {code:101110101}
    }
}

const WeatherCode=firstCode()
//检测天气代码改变
const nowCode=new Proxy(WeatherCode,{
    set(target,key,val){
        //  console.log(`属性 ${key} 从 ${target[key]} 变成 ${val}`);
        target[key]=val
        localStorage.setItem('code',JSON.stringify(WeatherCode))
        //得到数据并渲染
        render(nowCode)
        
         
        
        


        return true
    }
})
render(nowCode)//第一次渲染
//点击改变天气代码code
const search_li=document.querySelector(`.search_list ul`)
search_li.addEventListener('click',function(e){
       if(e.target.tagName==='LI'){
        nowCode.code=e.target.dataset.code
        // console.log(nowCode.code);
        
       }
})

function render(nowCode){
    render_OneDay( getApiData(changeLocation(oneDayUrl,String(nowCode.code))))//指数
    getApiData(changeLocation(sevenDayUrl,String(nowCode.code)))//七日预报
    getApiData(changeLocation(allHourUrl,String(nowCode.code)))//逐小时播报
    getApiData(changeLocation(nowUrl,String(nowCode.code)))//实况
}
//生活指数渲染
function render_OneDay(res){

    res.then(f=>{
       let res= f.data

       console.log(res);
       
        
    })
}

