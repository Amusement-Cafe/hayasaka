const mongoose  = require('mongoose')

const init = (ctx) => {
    mongoose.connection.on('error', err => {
        console.log(err)
    })
}

module.exports = {
    init,
}
