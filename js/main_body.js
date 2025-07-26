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
render_chart(arr)//渲染折线图
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
//全局注册
Chart.register(ChartDataLabels);
function render_chart(arr)
{
    const ctx = document.getElementById('myChart');//获取元素
//横坐标
const x=[0,1,2,3,4,5,6,7]
let hightTemp=[]
let lowTemp=[]
for(let i=0;i<arr.length;i++){
    hightTemp.push(arr[i].tempMax)
    lowTemp.push(arr[i].tempMin)
}
const data = {
    labels: x,
    datasets: [
        //高温
        {
            label: '',
            data: hightTemp,
            fill: false,
            borderColor: 'rgb(255, 208, 0)',
            pointBackgroundColor: 'rgb(255, 208, 0)',
            tension: 0.3,
            datalabels: {
                display: true,          // 一直显示
                align: 'top',           // 文字在点的上方
                anchor: 'end',          // 锚点到点的顶部
                offset: 4,              // 离点几像素
                color: (ctx) => ctx.dataIndex === 0 ? 'silver' : 'rgba(37, 35, 35, 0.85)',          // 文字颜色
                font: { size: 20 },
                formatter: (value) => `${value}°` // 显示原始数值
            }
        },
        //低温
        {
            label: '',
            data: lowTemp,
            fill: false,
            borderColor: 'rgb(105, 175, 255)',
            pointBackgroundColor: 'rgb(105, 175, 255)',
            tension: 0.3,
            datalabels: {
                display: true,          // 一直显示
                align: 'bottom',           // 文字在点的上方
                anchor: 'end',          // 锚点到点的顶部
                offset: 4,              // 离点几像素
                color: (ctx) => ctx.dataIndex === 0 ? 'silver' : 'rgba(37, 35, 35, 0.85)',          // 文字颜色
                font: { size: 20 },
                formatter: (value) => `${value}°` // 显示原始数值
            }

        }
    ]
}//数据

const config = {
    type: 'line',
    data: data,
    options: {
        plugins: {
            legend: { display: false }, // 去掉图例
            tooltip: { enabled: false } // 去掉悬停提示
        },
        layout: {
            padding: {
                top: 60,   // 上留白
                right: 60,   // 右留白
                bottom: 60,   // 下留白
                left: 60    // 左留白
            }
        },
        scales: {
            x: {
                display: false // 不显示横轴
            },
            y: {
                display: false // 不显示纵轴
            }
        },
        animation: false, // 禁用动画
        responsive: true,
        maintainAspectRatio: false
    }
};
//设置

//设立
const myChart = new Chart(ctx, config)
}


//以上为七日天气预报