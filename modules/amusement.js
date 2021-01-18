const MongoClient = require('mongodb').MongoClient;
var amusementDB

const getAmusementUser = async (ctx, userId) => {
    try {
        if(!amusementDB) {
            amusementDB = (await MongoClient.connect(ctx.config.amusement, { 
                useUnifiedTopology: true 
            })).db('amusement2')
        }

        const collection = amusementDB.collection('users')
        const amusementUser = await collection.findOne({ discord_id: userId })
        return amusementUser

    } catch(e) { }
}

module.exports = {
    getAmusementUser,
}
