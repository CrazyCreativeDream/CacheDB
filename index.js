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
    function CacheDB(namespace, prefix) {
        this.namespace = namespace || "CacheDBDefaultNameSpace";
        this.prefix = prefix || "CacheDBDefaultPrefix";
        this.read = async function (key, config) {
            config = config || { type: "text" };
            return new Promise((resolve, reject) => {
                caches.open(this.namespace).then(cache => {
                    cache.match(new Request(`https://${this.prefix}/${encodeURIComponent(key)}`))
                        .then(response => {
                            switch (config.type) {
                                case "json":
                                    resolve(response.json());
                                case "arrayBuffer":
                                    resolve(response.arrayBuffer());
                                case 'blob':
                                    resolve(response.blob());
                                default:
                                    resolve(response.text());
                            }
                        }).catch(err => { resolve(null); });
                })
            })
        }
        this.write = async function (key, value, config) {
            config = config || { type: "text" };
            return new Promise((resolve, reject) => {
                caches.open(this.namespace).then(cache => {
                    cache.put(
                        new Request(`https://${this.prefix}/${encodeURIComponent(key)}`),
                        new Response(value, {
                            headers: {
                                'Content-Type': (() => {
                                    switch (config.type) {
                                        case "json":
                                            return 'application/json';
                                        case "arrayBuffer":
                                            return 'application/octet-stream';
                                        case 'blob':
                                            return 'application/octet-stream';
                                        default:
                                            return 'text/plain';
                                    }
                                })()
                            }
                        }))
                        .then(resolve(true))
                        .catch(err => { resolve(false) });
                })
            })
        }
        this.delete = async function (key) {
            return new Promise((resolve, reject) => {
                caches.open(this.namespace).then(cache => {
                    cache.delete(new Request(`https://${this.prefix}/${encodeURIComponent(key)}`))
                        .then(resolve(true))
                        .catch(err => { resolve(false) });
                })
            })
        }
    }
    return CacheDB;
})

