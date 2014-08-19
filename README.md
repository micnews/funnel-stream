# funnel-stream

merge many streams into one output stream.

``` js
var funnel = require('funnel-stream')


var f = funnel()


var inputStream = f.createInput()

BIG_DATA.pipe(inputStream)

//later

f.createOutput().pipe(BIG_DATA_DUMP)

```
you should only create one dump at a time.

## License

MIT
