//渲染完后加过渡
requestAnimationFrame(()=>{
    setTimeout(()=>{
        document.querySelector('.see ul').classList.add('transition')
    },100)
    
})
//当前位置
let now=0;

//获取btn
const rightbtn=document.querySelector(`.two_btn .right`)
rightbtn.addEventListener('click',function(){
    const move=document.querySelector('.see ul')
    if(now+1100>move.clientWidth-1200){
        now=move.clientWidth-1200
    }
    else{
        now=1100+now
    }
    
    move.style.transform=`translateX(-${now}px)`
    console.log(now);
    
    //: ;
})
const leftbtn=document.querySelector(`.two_btn .left`)
leftbtn.addEventListener('click',function(){
    const move=document.querySelector('.see ul')
    if(now-1100>0){
        now=now-1100
    }
    else{
        now=0
    }
     move.style.transform=`translateX(-${now}px)`
})
//逐小时播放
export function render_hours(res){
     let str=''
    res.then(f=>{
        for(let item of f.data.hourly){
            let time=item.fxTime.slice(11,16)
            let url=item.icon
            let temp=item.temp
            str= str+`
            <li>
                <p class="text_time">${time}</p>
                <img src="/data/img/small${url}.png" alt="">
                <p class="text_deg">${temp}°</p>
            </li>
            `
        }
        //加入至ul
        const aimul=document.querySelector('.see ul')
        aimul.innerHTML=str
    })

   
}