module.exports = {
    init: (ctx) => {
        require('./bot').init(ctx)
        require('./mongoose').init(ctx)
    }
}