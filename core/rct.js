
const tree = { }

const push = (...args) => {
    const callback = args.pop()
    const cursor = tree

    args.map(alias => {
        if (!cursor.hasOwnProperty(alias))
            cursor[alias] = {}

        cursor[alias]._callback = callback
    })
}

const trigger = async (ctx, user, msg, reaction) => {
    let cursor = tree

    while (cursor.hasOwnProperty(reaction)) {
        cursor = cursor[reaction]
    }

    if (cursor.hasOwnProperty('_callback')) 
        await cursor._callback.apply({}, [ctx, user, msg])
}

module.exports = { push, trigger }
