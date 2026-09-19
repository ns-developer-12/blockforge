/* =========================================================
   MINECRAFT LAND
   Professional Service Worker
   ========================================================= */

'use strict';

/* =========================================================
   CONFIG
   ========================================================= */

const SW_VERSION = '1.1.0';

const CACHE_PREFIX = 'minecraft-land';

const STATIC_CACHE =
    `${CACHE_PREFIX}-static-${SW_VERSION}`;

const DYNAMIC_CACHE =
    `${CACHE_PREFIX}-dynamic-${SW_VERSION}`;

const IMAGE_CACHE =
    `${CACHE_PREFIX}-images-${SW_VERSION}`;

/*
   کش مخصوص فونت‌ها و آیکون‌های خارجی
*/
const EXTERNAL_ASSET_CACHE =
    `${CACHE_PREFIX}-external-assets-${SW_VERSION}`;

/*
   سرویس‌های خارجی که فایل فونت / CSS از آن‌ها دریافت می‌شود
*/
const EXTERNAL_ASSET_HOSTS = new Set([
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com'
]);

const OFFLINE_PAGE =
    './index.html';


/* =========================================================
   PRECACHE
   ========================================================= */

const PRECACHE_FILES = [
    './',
    './index.html',

    './css/main.css',
    './css/components.css',
    './css/responsive.css',

    './data/content.js',
    './data/servers.js',
    './data/config.js',
    './data/rewards.js'
];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener(
    'install',
    event => {

        console.log(
            `[SW ${SW_VERSION}] Installing...`
        );

        event.waitUntil(

            caches
                .open(STATIC_CACHE)

                .then(cache => {

                    return cache.addAll(
                        PRECACHE_FILES
                    );

                })

                .then(() => {

                    console.log(
                        `[SW ${SW_VERSION}] Static files cached.`
                    );

                    return self.skipWaiting();

                })

                .catch(error => {

                    console.error(
                        '[SW] Precache error:',
                        error
                    );

                })

        );

    }
);


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener(
    'activate',
    event => {

        console.log(
            `[SW ${SW_VERSION}] Activating...`
        );

        event.waitUntil(

            Promise.all([

                cleanupOldCaches(),

                self.clients.claim()

            ])

        );

    }
);


/* =========================================================
   CLEAN OLD CACHES
   ========================================================= */

async function cleanupOldCaches() {

    const cacheNames =
        await caches.keys();

    const validCaches = [
        STATIC_CACHE,
        DYNAMIC_CACHE,
        IMAGE_CACHE,
        EXTERNAL_ASSET_CACHE
    ];

    await Promise.all(

        cacheNames

            .filter(
                cacheName =>

                    cacheName.startsWith(
                        CACHE_PREFIX
                    )

                    &&

                    !validCaches.includes(
                        cacheName
                    )
            )

            .map(
                cacheName => {

                    console.log(
                        '[SW] Removing old cache:',
                        cacheName
                    );

                    return caches.delete(
                        cacheName
                    );

                }
            )

    );

}


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener(
    'fetch',
    event => {

        const request =
            event.request;

        /*
           فقط GET
        */
        if (
            request.method !== 'GET'
        ) {
            return;
        }


        /*
           درخواست‌های غیر HTTP
        */
        if (
            !request.url.startsWith('http')
        ) {
            return;
        }


        const url =
            new URL(
                request.url
            );


        /*
           درخواست‌های خارجی
        */
        if (
            url.origin !==
            self.location.origin
        ) {

            /*
               Google Fonts
               Font Awesome
               فایل‌های CSS فونت
               فایل‌های WOFF / WOFF2 / TTF / OTF
            */
            if (
                EXTERNAL_ASSET_HOSTS.has(
                    url.hostname
                )

                &&

                isExternalAssetRequest(
                    request
                )
            ) {

                event.respondWith(
                    externalAssetStrategy(
                        request
                    )
                );

                return;
            }


            /*
               تصاویر خارجی
            */
            if (
                isImageRequest(
                    request
                )
            ) {

                event.respondWith(
                    imageStrategy(
                        request
                    )
                );

            }

            return;
        }


        /*
           HTML
        */
        if (
            request.mode === 'navigate'
        ) {

            event.respondWith(
                navigationStrategy(
                    request
                )
            );

            return;
        }


        /*
           CSS / JS / Font / Static
        */
        if (
            isStaticRequest(
                request
            )
        ) {

            event.respondWith(
                staticStrategy(
                    request
                )
            );

            return;
        }


        /*
           تصاویر
        */
        if (
            isImageRequest(
                request
            )
        ) {

            event.respondWith(
                imageStrategy(
                    request
                )
            );

            return;
        }


        /*
           سایر درخواست‌ها
        */
        event.respondWith(
            dynamicStrategy(
                request
            )
        );

    }
);


/* =========================================================
   EXTERNAL FONT / ICON ASSETS
   Cache First
   ========================================================= */

function isExternalAssetRequest(
    request
) {

    const destination =
        request.destination;

    /*
       مرورگر معمولاً برای این فایل‌ها
       destination را مشخص می‌کند.
    */
    if (
        destination === 'font' ||
        destination === 'style'
    ) {

        return true;

    }


    /*
       fallback بر اساس پسوند فایل
    */
    const url =
        new URL(
            request.url
        );

    return /\.(woff2?|ttf|otf|css)$/i
        .test(
            url.pathname
        );

}


/* =========================================================
   EXTERNAL ASSET STRATEGY
   Cache First
   ========================================================= */

async function externalAssetStrategy(
    request
) {

    const cache =
        await caches.open(
            EXTERNAL_ASSET_CACHE
        );


    /*
       اگر قبلاً کش شده:
       فوراً نسخه کش‌شده را برگردان
    */
    const cached =
        await cache.match(
            request
        );


    if (cached) {

        /*
           در پس‌زمینه نسخه جدید را بررسی می‌کنیم.
           کاربر منتظر دانلود نمی‌ماند.
        */
        updateCacheInBackground(
            request,
            EXTERNAL_ASSET_CACHE
        );

        return cached;
    }


    /*
       اگر در کش نبود، از اینترنت بگیر
    */
    try {

        const response =
            await fetch(
                request
            );


        /*
           هم response معمولی و هم opaque
           قابل ذخیره هستند.
        */
        if (
            response &&

            (
                response.ok ||
                response.type === 'opaque'
            )
        ) {

            await cache.put(
                request,
                response.clone()
            );

        }


        return response;

    }

    catch (error) {

        console.warn(
            '[SW] External asset unavailable:',
            request.url
        );


        /*
           اگر اینترنت قطع باشد ولی نسخه کش‌شده‌ای
           وجود داشته باشد، همان را استفاده کن.
        */
        if (cached) {
            return cached;
        }


        return new Response(
            '',
            {
                status: 503
            }
        );

    }

}


/* =========================================================
   NAVIGATION STRATEGY
   Network First
   ========================================================= */

async function navigationStrategy(
    request
) {

    try {

        const response =
            await fetch(
                request
            );


        if (
            response &&
            response.ok
        ) {

            const cache =
                await caches.open(
                    DYNAMIC_CACHE
                );

            cache.put(
                request,
                response.clone()
            );

        }


        return response;

    }

    catch (error) {

        console.warn(
            '[SW] Network unavailable.'
        );


        const cached =
            await caches.match(
                request
            );


        if (cached) {
            return cached;
        }


        const offline =
            await caches.match(
                OFFLINE_PAGE
            );


        if (offline) {
            return offline;
        }


        return new Response(
            offlineHTML(),
            {
                status: 503,

                headers: {
                    'Content-Type':
                        'text/html; charset=utf-8'
                }
            }
        );

    }

}


/* =========================================================
   STATIC STRATEGY
   Cache First
   ========================================================= */

async function staticStrategy(
    request
) {

    const cached =
        await caches.match(
            request
        );


    if (cached) {

        /*
           کاربر بلافاصله فایل کش‌شده را می‌گیرد.
           نسخه جدید در پس‌زمینه دریافت می‌شود.
        */
        updateCacheInBackground(
            request,
            STATIC_CACHE
        );


        return cached;

    }


    try {

        const response =
            await fetch(
                request
            );


        if (
            response &&
            response.ok
        ) {

            const cache =
                await caches.open(
                    STATIC_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }


        return response;

    }

    catch (error) {

        console.error(
            '[SW] Static request failed:',
            error
        );


        return new Response(
            '',
            {
                status: 503
            }
        );

    }

}


/* =========================================================
   IMAGE STRATEGY
   Cache First
   ========================================================= */

async function imageStrategy(
    request
) {

    const cached =
        await caches.match(
            request
        );


    if (cached) {
        return cached;
    }


    try {

        const response =
            await fetch(
                request
            );


        if (
            response &&

            (
                response.ok ||
                response.type === 'opaque'
            )
        ) {

            const cache =
                await caches.open(
                    IMAGE_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }


        return response;

    }

    catch (error) {

        console.warn(
            '[SW] Image unavailable:',
            request.url
        );


        return new Response(
            '',
            {
                status: 404
            }
        );

    }

}


/* =========================================================
   DYNAMIC STRATEGY
   Network First
   ========================================================= */

async function dynamicStrategy(
    request
) {

    try {

        const response =
            await fetch(
                request
            );


        if (
            response &&
            response.ok
        ) {

            const cache =
                await caches.open(
                    DYNAMIC_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }


        return response;

    }

    catch (error) {

        const cached =
            await caches.match(
                request
            );


        if (cached) {
            return cached;
        }


        return new Response(
            JSON.stringify({

                offline: true,

                message:
                    'در حال حاضر اتصال به اینترنت وجود ندارد.'

            }),

            {
                status: 503,

                headers: {
                    'Content-Type':
                        'application/json; charset=utf-8'
                }
            }
        );

    }

}


/* =========================================================
   BACKGROUND UPDATE
   ========================================================= */

async function updateCacheInBackground(
    request,
    cacheName
) {

    try {

        const response =
            await fetch(
                request,
                {
                    cache: 'no-store'
                }
            );


        if (
            response &&

            (
                response.ok ||
                response.type === 'opaque'
            )
        ) {

            const cache =
                await caches.open(
                    cacheName
                );


            await cache.put(
                request,
                response.clone()
            );

        }

    }

    catch (error) {

        /*
           خطای background update
           نباید روی سایت اثر بگذارد.
        */

    }

}


/* =========================================================
   REQUEST TYPE HELPERS
   ========================================================= */

function isImageRequest(
    request
) {

    const destination =
        request.destination;


    if (
        destination === 'image'
    ) {

        return true;

    }


    const url =
        new URL(
            request.url
        );


    return /\.(png|jpg|jpeg|gif|webp|svg|avif|ico)$/i
        .test(
            url.pathname
        );

}


function isStaticRequest(
    request
) {

    const destination =
        request.destination;


    return [

        'style',
        'script',
        'font',
        'manifest',
        'worker'

    ].includes(
        destination
    );

}


/* =========================================================
   OFFLINE FALLBACK
   ========================================================= */

function offlineHTML() {

    return `
<!DOCTYPE html>

<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
Minecraft Land
</title>

<style>

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    min-height: 100vh;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #0b0b0f;

    color: #fff;

    font-family:
        Arial,
        sans-serif;

    text-align: center;

}

.box {

    width: min(
        90%,
        420px
    );

    padding: 35px 25px;

    border-radius: 20px;

    background: #15151c;

    border: 1px solid #292933;

}

.icon {

    font-size: 50px;

    margin-bottom: 15px;

}

h1 {

    margin: 0 0 10px;

}

p {

    color: #999;

    line-height: 1.8;

}

button {

    border: 0;

    border-radius: 12px;

    padding: 12px 25px;

    background: #f2c94c;

    color: #111;

    font-weight: bold;

    cursor: pointer;

}

</style>

</head>

<body>

<div class="box">

    <div class="icon">
        📡
    </div>

    <h1>
        اتصال برقرار نیست
    </h1>

    <p>
        اینترنت خود را بررسی کنید
        و دوباره تلاش کنید.
    </p>

    <button
        onclick="location.reload()"
    >
        تلاش دوباره
    </button>

</div>

</body>

</html>
`;

}


/* =========================================================
   MESSAGE API
   ========================================================= */

self.addEventListener(
    'message',
    event => {

        if (
            !event.data
        ) {
            return;
        }


        /*
           فعال‌سازی فوری
        */
        if (
            event.data.type ===
            'SKIP_WAITING'
        ) {

            self.skipWaiting();

            return;
        }


        /*
           پاک کردن تمام cacheها
        */
        if (
            event.data.type ===
            'CLEAR_CACHE'
        ) {

            event.waitUntil(

                caches
                    .keys()

                    .then(
                        names =>

                            Promise.all(

                                names

                                    .filter(
                                        name =>
                                            name.startsWith(
                                                CACHE_PREFIX
                                            )
                                    )

                                    .map(
                                        name =>
                                            caches.delete(
                                                name
                                            )
                                    )

                            )

                    )

            );

            return;
        }


        /*
           دریافت نسخه SW
        */
        if (
            event.data.type ===
            'GET_VERSION'
        ) {

            if (
                event.source
            ) {

                event.source.postMessage({

                    type:
                        'SW_VERSION',

                    version:
                        SW_VERSION

                });

            }

        }

    }
);


/* =========================================================
   PERIODIC CLEANUP
   ========================================================= */

async function cleanupImageCache() {

    const cache =
        await caches.open(
            IMAGE_CACHE
        );


    const requests =
        await cache.keys();


    /*
       حداکثر 150 تصویر
    */
    const MAX_IMAGES = 150;


    if (
        requests.length <=
        MAX_IMAGES
    ) {

        return;

    }


    const removeCount =
        requests.length -
        MAX_IMAGES;


    for (
        let i = 0;
        i < removeCount;
        i++
    ) {

        await cache.delete(
            requests[i]
        );

    }

}


/* =========================================================
   PERIODIC SYNC
   ========================================================= */

self.addEventListener(
    'sync',
    event => {

        if (
            event.tag ===
            'minecraft-land-sync'
        ) {

            event.waitUntil(
                cleanupImageCache()
            );

        }

    }
);
