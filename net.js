// ==================== NET.JS - کنترل وضعیت سایت ====================
// این فایل رو میتونی هر وقت خواستی ویرایش کنی

const SITE_STATUS = {
    // وضعیت کلی سایت
    status: "online", // "online" | "offline" | "maintenance" | "error"
    
    // پیام‌هایی که به کاربر نشون داده میشه
    messages: {
        offline: {
            title: "شما آفلاین هستید! 📡",
            desc: "اتصال اینترنتت رو چک کن و دوباره تلاش کن.",
            icon: "fa-wifi",
            color: "#e74c3c"
        },
        maintenance: {
            title: "سایت در حال بروزرسانی است 🔧",
            desc: "داریم سایت رو بهتر می‌کنیم. چند دقیقه دیگه برگرد!",
            icon: "fa-gear",
            color: "#ff9800"
        },
        error: {
            title: "مشکلی پیش اومده 🚨",
            desc: "تیم فنی در حال بررسی مشکل هستن.",
            icon: "fa-triangle-exclamation",
            color: "#e74c3c"
        },
        online: {
            title: "همه چی اوکیه! ✅",
            desc: "به BlockForge خوش اومدی.",
            icon: "fa-circle-check",
            color: "#2ecc71"
        }
    },
    
    // اطلاعات نسخه
    version: "2.0.0",
    lastUpdate: "2026-08-07",
    
    // لینک‌های مفید
    links: {
        rubika: "https://rubika.ir/zolbiao",
        youtube: "https://youtube.com",
        discord: "https://discord.gg/example"
    },
    
    // آیا کاربر رو به صفحه اصلی redirect کنه؟
    redirectToMain: true,
    
    // مدت زمان redirect (میلی‌ثانیه)
    redirectDelay: 3000,
    
    // شمارش معکوس
    countdown: true
};

// ==================== تنظیمات پیشرفته ====================
// می‌تونی اینارو تغییر بدی:

// اگه خواستی سایت رو موقتاً ببندی:
// SITE_STATUS.status = "maintenance";

// اگه خواستی پیام خطا نشون بده:
// SITE_STATUS.status = "error";

// اگه خواستی همه چی عادی باشه:
// SITE_STATUS.status = "online";

// اگه خواستی redirect غیرفعال بشه:
// SITE_STATUS.redirectToMain = false;
// SITE_STATUS.redirectDelay = 5000;
// SITE_STATUS.countdown = false;