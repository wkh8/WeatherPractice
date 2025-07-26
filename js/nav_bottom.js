


//当前渲染
export function render_now(res){
    res.then(f => {
        let res = f.data
        // localStorage.setItem('nowdata',JSON.stringify(res))
        console.log('当前实况');
        console.log(f.data);
        //当前温度
        const nowtemp=document.querySelector('.now_temp')
        nowtemp.innerHTML=`${f.data.now.temp}°`
        //当前天气
        const weathername=document.querySelector(`.weather_name`)
        weathername.innerHTML=`${f.data.now.text}`

        //天气图标
        const nowicon=document.querySelector('.now_icon')
        nowicon.style.background=`url(/data/img/big${f.data.now.icon}.png)`

        //nowaqi

        //旋转风也许要写在逐天中？
        const windIcon=document.querySelector('.wind_before')
        windIcon.style.rotate=`${f.data.now.wind360}deg`
        //湿度
        const humi=document.querySelector('.humidity')
        humi.innerHTML=`湿度 ${f.data.now.humidity}%`
        //气压
        const kPa=document.querySelector('.kPa')
        kPa.innerHTML=`气压 ${f.data.now.pressure}hPa`
        
        
    })
}