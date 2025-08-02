// APIhost： n44t2at2rv.re.qweatherapi.com
// KEY：0f78c7eacd1d4118822553781c889ca8
// https://n44t2at2rv.re.qweatherapi.com/v7/weather/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8
//格式   
//
//

//日期准备
//
function NowDate_1(){
    const date =new Date()
    date.setDate(date.getDate()-1)
    return[
        date.getFullYear(),
        String(date.getMonth()+1).padStart(2,'0'),
        String(date.getDate()).padStart(2,'0'),
    ].join('')
    }
 //https://api.map.baidu.com/location/ip?ip=26.113.47.173&ak=AtnHKBZzVyjYZEhY1QGHNfxnN86bg0Fu
export const cityUrl='https://n44t2at2rv.re.qweatherapi.com/geo/v2/city/lookup?location=北&range=cn&key=0f78c7eacd1d4118822553781c889ca8'
//https://n44t2at2rv.re.qweatherapi.com/geo/v2/city/lookup?location=北&range=cn&key=0f78c7eacd1d4118822553781c889ca8          '../data/localData/mohucitye.json'
export const oneDayUrl='https://n44t2at2rv.re.qweatherapi.com/v7/indices/1d?type=0&location=101110101&key=0f78c7eacd1d4118822553781c889ca8'  //https://n44t2at2rv.re.qweatherapi.com/v7/indices/1d?type=0&location=101110101&key=0f78c7eacd1d4118822553781c889ca8  '../data/localData/1d.json'
export const sevenDayUrl='https://n44t2at2rv.re.qweatherapi.com/v7/weather/7d?location=101110101&key=0f78c7eacd1d4118822553781c889ca8'//https://n44t2at2rv.re.qweatherapi.com/v7/weather/7d?location=101110101&key=0f78c7eacd1d4118822553781c889ca8         '../data/localData/7d.json'
export const allHourUrl='https://n44t2at2rv.re.qweatherapi.com/v7/weather/24h?location=101110101&key=0f78c7eacd1d4118822553781c889ca8'//https://n44t2at2rv.re.qweatherapi.com/v7/weather/24h?location=101110101&key=0f78c7eacd1d4118822553781c889ca8  '../data/localData/24h.json'
export const nowUrl='https://n44t2at2rv.re.qweatherapi.com/v7/weather/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8'    //https://n44t2at2rv.re.qweatherapi.com/v7/weather/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8     '../data/localData/now.json'
export const yesterdayUrl=`https://n44t2at2rv.re.qweatherapi.com/v7/historical/weather?location=101010100&date=${NowDate_1()}&key=0f78c7eacd1d4118822553781c889ca8`//https://n44t2at2rv.re.qweatherapi.com/v7/historical/weather?location=101010100&date=${NowDate_1()}&key=0f78c7eacd1d4118822553781c889ca8  '../data/localData/yesterday.json'
export const warningUrl=`https://n44t2at2rv.re.qweatherapi.com/v7/warning/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8`//https://n44t2at2rv.re.qweatherapi.com/v7/warning/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8  '../data/localData/warning.json'
export const airUrl=`https://n44t2at2rv.re.qweatherapi.com/v7/air/now?location=101010100&key=0f78c7eacd1d4118822553781c889ca8`//https://n44t2at2rv.re.qweatherapi.com/v7/air/now?location=101010100&key=0f78c7eacd1d4118822553781c889ca8 '../data/localData/air.json'
export function debounce(fn, t) {
    let timer
    return function () {
        // 重置定时器

        clearTimeout(timer)
        timer = setTimeout(function () {
            fn()
        }, t)

    }
}
//封装api请求得到data
export function getApiData(api){
    return axios({ url: api }) 
    .then(response => {
       return response
    })
    .catch(err => {
        console.error(err);
    });
}
//修改url的城市代码
export function changeLocation(url,location){
    if(url.startsWith("https")){
    let urlObj=new URL(url)
    urlObj.searchParams.set('location',location)
    return urlObj.href
    }
    else{
        return url
    }
}
