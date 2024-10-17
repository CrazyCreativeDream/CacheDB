# Cache-DB

A common Key/Value database working on both DOM/WebWorker with auto type convert, based on CacheStorage.


```md
> const DBWithNoAuto = new CacheDB("DB1","PREFIX1") //this instance will not auto convert type
< undefined

> const DBWithAuto = new CacheDB("DB1","PREFIX2",{auto:1}) //this instance will auto convert type
< undefined

< await DBWithNoAuto.write("key1","content1")
> 1

< await DBWithAuto.write("key1","content2")
> 1

< await DBWithNoAuto.read("key1")
> "content1"

< await DBWithAuto.read("key1")
> "content2"

< await DBWithNoAuto.write("key1",{"123":456}) //CacheDB instances without type conversion require manual type conversion when writing, otherwise they will be directly converted to a '[object object]' string
> 1

< await DBWithNoAuto.read("key1") //CacheDB instances without type conversion also need to manually convert the type when reading, otherwise they will be returned in string form
> '[object Object]' 

< await DBWithNoAuto.write("key1",{"123":456},{type:"json"}) //You can specify the type when writing to avoid manual conversion
> 1

< await DBWithNoAuto.read("key1",{type:"json"}) //You can also specify the type when reading to avoid manual conversion
> {123: 456}

< await DBWithAuto.write("key1",{"123":789}) //CacheDB instances with type conversion do not require manual type conversion when writing.It will automatically convert the type according to the content.
> 1

< await DBWithAuto.read("key1") //Auto-Convert worked in both reading and writing.
> {123: 789}

< await DBWithAuto.has("key1") //After V1.1.5, CacheDB has a new method to check if the key exists.
> true

< await DBWithAuto.read("key3",{default:"default value"}) //After V1.1.5, CacheDB can read with default value when the key does not exist.
> "default value"

< await DBWithAuto.read("key3",{default:"diff value"}) //Default value could only overwrite when the key does not exist.
> "default value"
```

You can import this script as:

```js
import '@chenyfan/cache-db' //WebWorker With Webpack
```

```js
importScripts('https://unpkg.com/@chenyfan/cache-db') //WebWorker With Unpkg CDN
//or
importScripts('https://registry.npmmirror.com/@chenyfan/cache-db/latest/files') //WebWorker With NPM Mirror CDN
```

```html
<script src="https://unpkg.com/@chenyfan/cache-db"></script> <!--In DOM-->
```

> ANY WAY,DO NOT USE `latest` IN PRODUCTION!

## Compatibility

> CacheStorage has much much much stronger compatibility than WebWorker. And CacheDB is designed for both WebWorker and DOM.

> **So CacheDB will never check if CacheStorage API in browser or not.**

> If you just want to find a simple Key/Value database in DOM, please use [localForge](https://github.com/localForage/localForage)

> CacheDB's compatibility is based on CacheStorage's compatibility.

![CacheDB's compatibility ](https://github.com/CrazyCreativeDream/CacheDB/assets/53730587/a7eb9eac-fa10-4635-9870-038460270e3e)

## LICENSE

MIT License