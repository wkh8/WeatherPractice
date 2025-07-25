


//当前渲染
export function render_now(res){
    res.then(f => {
        let res = f.data
        localStorage.setItem('nowdata',JSON.stringify(res))
    })
}