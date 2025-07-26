//以下为七日天气预报



export function render_7d(sevenday,yesterday){//7日数据
   let arr=[]
   sevenday.then(f=>{
     arr=JSON.parse(JSON.stringify(f.data.daily))   

   })
   yesterday.then(f=>{
    let minWind=12
    let maxWind=0;
    for(let item of f.data.weatherHourly){
        if(minWind>Number(item.windScale)){
            minWind=Number(item.windScale)
        }
        if(maxWind<Number(item.windScale)){
            maxWind=Number(item.windScale)
        }
    }

    
    arr.unshift({
        tempMax:f.data.weatherDaily.tempMax,
        tempMin:f.data.weatherDaily.tempMin,
        fxDate:f.data.weatherDaily.date,
        textDay:f.data.weatherHourly[11].text,
        iconDay:f.data.weatherHourly[11].icon,
        textNight:f.data.weatherHourly[23].text,
        iconNight:f.data.weatherHourly[23].icon,
        windScaleDay: `${minWind}-${maxWind}`,

    })


    //以上为构建八天的数据
console.log(arr);
render_7d_child(arr)//渲染7天的天气预报
                    //渲染折线图
})


}




function render_7d_child(arr){//渲染7d
    let str=''
    for(let i=0;i<arr.length;i++){
        const now = new Date().getDay()
        const windname=["无风","软风","轻风","微风","和风","清风","强风","疾风","大风","烈风","狂风","暴风","台风级"]
        const zhoustr = ['周一', '周二', '周三', '周四', '周五', '周六', '周天']
        const labels = ['昨天', '今天', '明天', '后天', zhoustr[(now + 2) % 7], zhoustr[(now + 3) % 7], zhoustr[(now + 4) % 7], zhoustr[(now + 5) % 7]]
        const date= arr[i].fxDate.slice(5).replace('-','月')+'日'
        str=str+`
        <li>
                <p class="day">${labels[i]}</p>
                <p class="date">${date}</p>
                <div class="day_weather">
                    <p class="day_weathername">${arr[i].textDay}</p>
                    <img src="./data/img/small${arr[i].iconDay}.png" alt="">
                </div>
                <div class="night_weather">
                    <img src="./data/img/small${arr[i].iconNight}.png" alt="">
                    <p class="night_weathername">${arr[i].textNight}</p>
                </div>
                <p class="seven_day_wind">${windname[Number(arr[i].windScaleDay.slice(-1))]}${arr[i].windScaleDay}级</p>
            </li>
        `
    }
    //插入
    const aimul=document.querySelector('.seven_day ul')
    aimul.innerHTML=str
}
//折线图



//以上为七日天气预报