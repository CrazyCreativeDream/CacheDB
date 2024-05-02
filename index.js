(function (factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof window === 'object') {
        window.CacheDB = factory();
    } else {
        self.CacheDB = factory();
    }

})(function () {
    const ifObjectisJSON = function (obj) {
        return (typeof obj === 'object' && obj !== null && obj.constructor === Object) || Array.isArray(obj)
    }
    function CacheDB(namespace, prefix, config) {
        this.config = config || { auto: 0 };
        this.config.auto = this.config.auto || 0
        this.namespace = namespace || "CacheDBDefaultNameSpace";
        this.prefix = prefix || "CacheDBDefaultPrefix";
        this.read = async function (key, config) {
            config = config || {};
            config.type = config.type || this.config.auto ? "auto" : "text";
            return new Promise((resolve, reject) => {
                caches.open(this.namespace)
                    .then(cache => {
                        cache.match(new Request(`https://${this.prefix}/${encodeURIComponent(key)}`))
                            .then(async response => {
                                if (config.type === 'auto') {
                                    switch (response.headers.get('Content-Type')) {
                                        case "application/json":
                                            config.type = "json";
                                            break;
                                        case "application/octet-stream":
                                            config.type = "arrayBuffer";
                                            break;
                                        case "application/octet-stream":
                                            config.type = "blob";
                                            break;
                                        case "text/number":
                                            config.type = "number";
                                            break;
                                        case "text/boolean":
                                            config.type = "boolean";
                                            break;
                                        default:
                                            config.type = "text";
                                            break;
                                    }
                                }
                                switch (config.type) {
                                    case "number":
                                        resolve(Number(await response.text()));
                                        return;
                                    case "json":
                                        resolve(response.json());
                                        return;
                                    case "arrayBuffer":
                                        resolve(response.arrayBuffer());
                                        return;
                                    case 'blob':
                                        resolve(response.blob());
                                        return;
                                    case 'text':
                                        resolve(response.text());
                                        return;
                                    case 'boolean':
                                        resolve(await response.text() == 1);
                                        return;
                                    default:
                                        resolve(response.body);
                                        return;
                                }
                            })
                    })
                    .catch(err => {
                        console.error('CacheDB Read Erorr:' + err);
                        reject(null);
                    });
            })
        }
        this.write = async function (key, value, config) {
            config = config || {};
            config.type = config.type || this.config.auto ? "auto" : "text";
            if (config.type === 'auto')
                config.type = ifObjectisJSON(value) ? 'json' : typeof value;
            switch (config.type) {
                case "json":
                    config.content_type = "application/json";
                    value = JSON.stringify(value);
                    break;
                case "arrayBuffer":
                    config.content_type = "application/octet-stream";
                    break;
                case 'blob':
                    config.content_type = "application/octet-stream";
                    break;
                case 'number':
                    config.content_type = "text/number";
                    value = value.toString();
                    break;
                case 'boolean':
                    config.content_type = "text/boolean";
                    value = value ? 1 : 0
                    break;
                default:
                    break;
            }
            return new Promise((resolve, reject) => {
                caches.open(this.namespace).then(cache => {
                    cache.put(
                        new Request(`https://${this.prefix}/${encodeURIComponent(key)}`),
                        new Response(value, {
                            headers: { 'Content-Type': config.content_type }
                        })).then(resolve(1))
                }).catch(err => {
                    console.error('CacheDB Write Erorr:' + err);
                    reject(0)
                });
            })
        }
        this.delete = async function (key) {
            return new Promise((resolve, reject) => {
                caches.open(this.namespace).then(cache => {
                    cache.delete(new Request(`https://${this.prefix}/${encodeURIComponent(key)}`))
                        .then(resolve(true))
                })
                    .catch(err => {
                        console.error('CacheDB Delete Erorr:' + err);
                        reject(false)
                    });
            })
        }
        this.list = async function () {
            return new Promise((resolve, reject) => {
                caches.open(this.namespace).then(cache => {
                    cache.keys().then(keys => {
                        resolve(keys.map(key => decodeURIComponent(key.url.split('/').pop())));
                    })
                }).catch(err => {
                    console.error('CacheDB List Erorr:' + err);
                    reject([])
                });
            })
        }
        this.all = async function () {
            const data = {};
            return new Promise(async (resolve, reject) => {
                this.list().then(async keys => {
                    await Promise.all(keys.map(async key => {
                        data[key] = await this.read(key);
                    }))
                    resolve(data);
                }).catch(err => {
                    console.error('CacheDB All Erorr:' + err);
                    reject([])
                });
            })
        }
        this.clear = async function () {
            return new Promise((resolve, reject) => {
                this.list().then(keys => {
                    keys.forEach(key => {
                        this.delete(key)
                    })
                    resolve(true);
                }).catch(err => {
                    console.error('CacheDB Clear Erorr:' + err);
                    reject(false)
                });
            })
        }
        this.destroy = async function () {
            return new Promise((resolve, reject) => {
                this.clear().then(() => {
                    caches.delete(this.namespace).then(resolve(true));
                }).catch(err => {
                    console.error('CacheDB Destroy Erorr:' + err);
                    reject(false)
                });
            })
        }
    }
    return CacheDB;
})

