
const SITE_STATUS = {
    status: "maintenance", // "online" | "offline" | "maintenance" | "error"
    
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
    version: "0.1",
    lastUpdate: "2026-08-07",
    
    // لینک‌های مفید
    links: {
        rubika: "https://rubika.ir/zolbiao",
        youtube: "https://youtube.com",
        discord: ""
    },
    
    // آیا کاربر رو به صفحه اصلی redirect کنه؟
    redirectToMain: true,
    
    // مدت زمان redirect (میلی‌ثانیه)
    redirectDelay: 3000,
    
    // شمارش معکوس
    countdown: true
};
