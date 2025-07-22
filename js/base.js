// APIhost： n44t2at2rv.re.qweatherapi.com
// KEY：0f78c7eacd1d4118822553781c889ca8
// https://n44t2at2rv.re.qweatherapi.com/v7/weather/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8
//格式   
//
//
//

export const oneDayUrl='../data/localData/1d.json'  //https://n44t2at2rv.re.qweatherapi.com/v7/indices/1d?type=0&location=101110101&key=0f78c7eacd1d4118822553781c889ca8
export const sevenDayUrl='../data/localData/7d.json'//https://n44t2at2rv.re.qweatherapi.com/v7/weather/7d?location=101110101&key=0f78c7eacd1d4118822553781c889ca8
export const allHourUrl='../data/localData/24h.json'//https://n44t2at2rv.re.qweatherapi.com/v7/weather/24h?location=101110101&key=0f78c7eacd1d4118822553781c889ca8
export const nowUrl='../data/localData/now.json'    //https://n44t2at2rv.re.qweatherapi.com/v7/weather/now?location=101110101&key=0f78c7eacd1d4118822553781c889ca8
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
