const 
    {resolve, join} = require('path'),
    rootFolder = __dirname,
    testFolder = resolve(rootFolder, "test"),
    fixturesFolder = resolve(testFolder, "fixtures");
Object.assign(
    global,
    {
        Subscriber: require("./dist/subscriber.0.0.0.evergreen.umd.js")
    }
)