// ============================================================
// BlockForge - Bedrock Servers
// فایل اطلاعات سرورهای Minecraft Bedrock
// ============================================================
//
// هر سرور می‌تواند این اطلاعات را داشته باشد:
//
// name        = نام سرور
// ip          = آدرس IP یا دامنه
// port        = پورت Bedrock
// online      = وضعیت سرور (true = آنلاین / false = آفلاین)
// players     = تعداد بازیکنان فعلی
// maxPlayers  = ظرفیت سرور
// version     = نسخه Minecraft
// country     = کشور سرور
// language    = زبان اصلی
// type        = نوع/سبک اصلی سرور
// tags        = تگ‌های سرور
// description = توضیحات کامل
// icon        = لینک آیکن سرور
// website     = سایت سرور (اختیاری)
// discord     = لینک دیسکورد (اختیاری)
// vip         = نمایش VIP بودن سرور
//
// نکته:
// اگر website یا discord ندارید، مقدار آن را خالی بگذارید: ""
//
// ============================================================


// const BEDROCK_SERVERS = [

    // ========================================================
    // 🥇 سرور اول
    // ========================================================
    {
        name: "🏆 مگا سرور ایران",

        // آدرس اتصال
        ip: "play.mega-ir.ir",

        // پورت Bedrock
        port: 19132,

        // وضعیت
        online: true,

        // تعداد بازیکنان
        players: 87,

        // ظرفیت
        maxPlayers: 200,

        // نسخه Minecraft
        version: "1.21.x",

        // کشور
        country: "ایران",

        // زبان
        language: "فارسی",

        // نوع اصلی
        type: "Survival",

        // تگ‌ها
        tags: [
            "Survival",
            "SkyBlock",
            "BedWars",
            "PvP",
            "Economy"
        ],

        // توضیحات
        description:
            "یک سرور بزرگ Minecraft Bedrock با چندین گیم‌مود مختلف. " +
            "در این سرور می‌توانید Survival بازی کنید، جزیره خودتان را بسازید، " +
            "در BedWars با بازیکنان دیگر رقابت کنید و در سیستم اقتصادی سرور فعالیت کنید.",

        // آیکن
        // اگر لینک تصویر دارید اینجا قرار دهید.
        icon: "",

        // سایت
        website: "",

        // دیسکورد
        discord: "",

        // VIP
        vip: true
    },


    // ========================================================
    // 🥈 سرور دوم
    // ========================================================
    {
        name: "⚔️ جنگجویان",

        ip: "mc.jangjoyan.ir",

        port: 25565,

        online: true,

        players: 54,

        maxPlayers: 120,

        version: "1.21.x",

        country: "ایران",

        language: "فارسی",

        type: "PvP",

        tags: [
            "PvP",
            "KitPvP",
            "Duels",
            "Ranked",
            "Events"
        ],

        description:
            "سرور مخصوص بازیکنانی که به مبارزه و PvP علاقه دارند. " +
            "در حالت‌های مختلف KitPvP و Duels با بازیکنان دیگر مبارزه کنید، " +
            "رتبه خود را افزایش دهید و در رویدادهای دوره‌ای شرکت کنید.",

        icon: "",

        website: "",

        discord: "",

        vip: true
    },


    // ========================================================
    // 🥉 سرور سوم
    // ========================================================
    {
        name: "🌍 دنیای بقا",

        ip: "play.donaye-bagha.ir",

        port: 19132,

        online: true,

        players: 32,

        maxPlayers: 80,

        version: "1.20.x",

        country: "ایران",

        language: "فارسی",

        type: "Survival",

        tags: [
            "Survival",
            "Economy",
            "Jobs",
            "Towny",
            "Trading"
        ],

        description:
            "یک تجربه کلاسیک و آرام از Survival با سیستم اقتصادی پیشرفته. " +
            "می‌توانید منابع جمع کنید، شغل انتخاب کنید، آیتم‌های خود را بفروشید، " +
            "با بازیکنان دیگر معامله کنید و دنیای خودتان را توسعه دهید.",

        icon: "",

        website: "",

        discord: "",

        vip: false
    },


    // ========================================================
    // سرور چهارم
    // ========================================================
    {
        name: "🏗️ بدراک بیلدرز",

        ip: "bedrock-builders.ir",

        port: 19132,

        online: false,

        players: 0,

        maxPlayers: 50,

        version: "1.21.x",

        country: "ایران",

        language: "فارسی",

        type: "Creative",

        tags: [
            "Creative",
            "Build",
            "Plots",
            "Building"
        ],

        description:
            "سروری مخصوص سازندگان Minecraft. " +
            "با استفاده از Plot اختصاصی خود می‌توانید ساختمان‌ها و سازه‌های مختلف بسازید " +
            "و خلاقیت خود را بدون محدودیت‌های Survival اجرا کنید.",

        icon: "",

        website: "",

        discord: "",

        vip: false
    }

];


// ============================================================
// توابع کمکی
// ============================================================
//
// این بخش اختیاری است ولی باعث می‌شود index سرورها بتواند
// راحت‌تر اطلاعات را دریافت کند.
//
// ============================================================


/**
 * پیدا کردن سرور با IP
 */
function getServerByIP(ip) {
    return BEDROCK_SERVERS.find(server => server.ip === ip);
}


/**
 * فقط سرورهای آنلاین
 */
function getOnlineServers() {
    return BEDROCK_SERVERS.filter(server => server.online);
}


/**
 * فقط سرورهای آفلاین
 */
function getOfflineServers() {
    return BEDROCK_SERVERS.filter(server => !server.online);
}


/**
 * تعداد کل بازیکنان آنلاین
 */
function getTotalPlayers() {
    return BEDROCK_SERVERS.reduce(
        (total, server) => total + (server.players || 0),
        0
    );
}


/**
 * تعداد کل سرورها
 */
function getTotalServers() {
    return BEDROCK_SERVERS.length;
}


/**
 * تعداد سرورهای آنلاین
 */
function getOnlineServerCount() {
    return BEDROCK_SERVERS.filter(server => server.online).length;
}