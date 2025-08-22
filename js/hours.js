import {
    dom
} from './dom.js'

//渲染完后加过渡,防止初始化移动
requestAnimationFrame(() => {
    setTimeout(() => {
    dom.hours_move.classList.add('transition')
    }, 100)

})
//包含事件监听，防止污染
function hours_main(){

//当前位置
let now = 0;
//右按钮添加监听
dom.hours_rightBtn.addEventListener('click', function () {

    if (now + 1100 > dom.hours_move.clientWidth - 1200) {
        now = dom.hours_move.clientWidth - 1200
    }
    else {
        now = 1100 + now
    }
    dom.hours_move.style.transform = `translateX(-${now}px)`
    console.log(now);
    //: ;
})


dom.hours_leftBtn.addEventListener('click', function () {
    if (now - 1100 > 0) {
        now = now - 1100
    }
    else {
        now = 0
    }
    dom.hours_move.style.transform = `translateX(-${now}px)`
})
}
//调用
hours_main()
//处理数据
export function render_hours(resfh, resfs) {
    Promise.all([resfh, resfs]).then(([fh, fs]) => {
        // console.log(fh.data);
        // console.log(fs.data);
        let sun = [
            { fxTime: fs.data.daily[0].fxDate + 'T' + fs.data.daily[0].sunrise + '+08:00', icon: 'sunrise', temp: '日出' },
            { fxTime: fs.data.daily[0].fxDate + 'T' + fs.data.daily[0].sunset + '+08:00', icon: 'sunset', temp: '日落' },
            { fxTime: fs.data.daily[1].fxDate + 'T' + fs.data.daily[1].sunrise + '+08:00', icon: 'sunrise', temp: '日出' },
            { fxTime: fs.data.daily[1].fxDate + 'T' + fs.data.daily[1].sunset + '+08:00', icon: 'sunset', temp: '日落' },
        ]

        sun = sun.filter(item =>
            (new Date(item.fxTime)) >= (new Date(fh.data.hourly[0].fxTime)) && (new Date(item.fxTime)) <= (new Date(fh.data.hourly[23].fxTime))
        )
        let arr = mergeSorted(fh.data.hourly, sun)

        //渲染
        let str = ''
        for (let item of arr) {
            let temp
            if(item.icon!=='sunset'&&item.icon!=='sunrise')
            {
                temp=item.temp+'°'
            }
            else{
                temp=item.temp
            }
            str = str + `
                        <li>
                            <p class="text_time">${item.fxTime.slice(11, 16)}</p>
                            <img src="/data/img/small${item.icon}.png" alt="">
                            <p class="text_deg">${temp}</p>
                            </li>
                        `
           
        }

        dom.hours_move.innerHTML = str
    })
    

   
}
//插入排序好的数组
function mergeSorted(a, b) {
    const res = [];
    let i = 0, j = 0;

    while (i < a.length && j < b.length) {
        if (new Date(a[i].fxTime) <= new Date(b[j].fxTime)) {
            res.push(a[i++]);
        } else {
            res.push(b[j++]);
        }
    }

    // 把剩余部分一次性推入
    return res.concat(a.slice(i)).concat(b.slice(j));
}



// 渲染

//加入至ul
