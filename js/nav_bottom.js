import {
    dom
} from './dom.js'


//当前渲染
export function render_now(res){
    res.then(f => {
        // console.log(f.data);
        //发布时间
         dom.bot_push.innerHTML=`中央气象台${f.data.now.obsTime.slice(11, 16)}发布`   
        // localStorage.setItem('nowdata',JSON.stringify(res))
        //当前温度
        dom.bot_nowTemp.innerHTML=`${f.data.now.temp}°`
        //当前天气
        dom.bot_weather.innerHTML=`${f.data.now.text}`
        //天气图标
        dom.bot_icon.style.background=`url(/data/img/big${f.data.now.icon}.png)`
        //湿度
        dom.bot_humi.innerHTML=`湿度 ${f.data.now.humidity}%`
        //气压
        dom.bot_kPa.innerHTML=`气压 ${f.data.now.pressure}hPa`
    })
}

export function render_warning(res){
    res.then(f=>{
        let warningArr=f.data.warning
        let str=''

        for(let item of warningArr){
            let color;
            switch(item.level){
                case "蓝色":
                    color='#86c5f7'
                    break
                case "黄色":
                    color='#f5d271'
                    break
                case '橙色':
                    color='#ef8c6b'
                    break
                case '红色':
                    color='#ec807c'
                    break
                default:
                    color='#86c5f7'
                    break
            }

            str=str+`<li style="background-color: ${color};">
            ${item.typeName.slice(-2)}预警
                            <div class="cotain">
                                <div class="title" style="background-color: ${color};">${item.typeName}${item.level}预警</div>
                                <p>${item.text}
                                </p>
                            </div>
                        </li>
                        `
        }
       dom.bot_warning.innerHTML=str
    })
}


export function render_air(res){
    res.then(f=>{
        // console.log(f.data);

        let color
        let im
        switch(f.data.now.category){
            case '优':
            color='#a3d765'
            im='../data/img/you.png'
            break
            case '良':
            color='#f0cc35'
            im='../data/img/liang.png'
            break
            case "轻度污染":
            color='#f1ab62'
            im='../data/img/qingduwuran.png'
            break
            case '中度污染':
             color='#ad788a'
             im='../data/img/yanzhongwuran.png'
            break
            case '重度污染':
                 color='#ad788a'
             im='../data/img/yanzhongwuran.png'
            break
            case '严重污染':
            color='#ad788a'
             im='../data/img/yanzhongwuran.png'
            break
            default:
                color='#f0cc35'
                 im='../data/img/liang.png'
                break
        }

        dom.bot_addStyle.textContent=`
        .now_aqi {
         background-color: ${color};
        }
        .airtitle{
        background-color: ${color};
        }
        .ct_main .now_aqi::before{
                background-image: url(${im});
                background-color: #fff;
                
        }
        `
       
        dom.bot_nowAQI.innerHTML=`${f.data.now.aqi} ${f.data.now.category}`
        dom.bot_head.innerHTML=`空气质量指数 ${f.data.now.aqi} ${f.data.now.category}`
        dom.bot_pm25.innerHTML=`${f.data.now.pm2p5}`
        dom.bot_pm10.innerHTML=`${f.data.now.pm10}`
        dom.bot_so2.innerHTML=`${f.data.now.so2}`
        dom.bot_no2.innerHTML=`${f.data.now.no2}`
        dom.bot_o3.innerHTML=`${f.data.now.o3}`
        dom.bot_co.innerHTML=`${f.data.now.co}`
        document.head.appendChild(dom.bot_addStyle);
    })

}