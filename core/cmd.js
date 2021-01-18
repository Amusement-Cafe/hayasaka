const tree = { }

const push = (...args) => {
    const callback = args.pop()
    const cursors = []

    args.map(alias => {
        let sequence = Array.isArray(alias) ? alias : [alias]
        let cursor = tree

        sequence.map(arg => {
            if (!cursor.hasOwnProperty(arg)) {
                cursor[arg] = {}
            }

            cursor = cursor[arg]
        })

        cursor._callback = callback

        cursors.push(cursor)
    })
}

const trigger = (ctx, user, args) => {
    let cursor = tree
    while (cursor.hasOwnProperty(args[0])) {
        cursor = cursor[args[0]]
        args.shift()
    }

    if (!cursor.hasOwnProperty('_callback')) {
        return ctx.err(`Unknown command \`${args.join(' ')}\``)
    }

    const newArgs = [ctx, user || { }].concat(args)
    return cursor._callback.apply({}, newArgs)
}

module.exports = {
    push,
    trigger,
}