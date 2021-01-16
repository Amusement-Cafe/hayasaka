const init = (ctx) => {
    ctx.mcn.on('error', err => {
        console.log(err)
    })
}