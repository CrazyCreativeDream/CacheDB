# Cache-DB

A common front-end/Service Worker-based Key/Value database based on CacheStorage


```md
> const db = new CacheDB('ChenYFanDB')
< undefined
> await db.read('ChenYFan')
< null
> await db.write('ChenYFan','YYDS')
< true
> await db.read('ChenYFan')
< 'YYDS'
> await db.write('ChenYFan',new Blob([]))
< true
> await db.read('ChenYFan')
< ''
> await db.delete('ChenYFan')
< true
> await db.read('ChenYFan')
< null
```

You can import this script as:

```js
import CacheDB from '@chenyfan/cache-db' //ServiceWorker
```

```html
<script src="https://unpkg.com/@chenyfan/cache-db"></script>
```