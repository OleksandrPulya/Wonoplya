// ================================
// CURSOR GLOW
// ================================

const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (event) => {

    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";

});


// ================================
// MOBILE MENU
// ================================

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

});


// Закриваємо меню після натискання
document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

    });

});


// ================================
// SCROLL REVEAL
// ================================

const revealElements = document.querySelectorAll(
    ".about-card, .admin-card, .rule-block, .section-title, .join-section"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


// ================================
// 3D TILT TELEGRAM CARD
// ================================

const telegramPreview =
    document.querySelector(".telegram-preview");

if (telegramPreview) {

    telegramPreview.addEventListener("mousemove", (event) => {

        const rect = telegramPreview.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const rotateY =
            ((x / rect.width) - 0.5) * 8;

        const rotateX =
            ((y / rect.height) - 0.5) * -8;

        telegramPreview.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    });


    telegramPreview.addEventListener("mouseleave", () => {

        telegramPreview.style.transform =
            "perspective(1000px) rotate(2deg)";

    });

}

// ================================
// SLOW RULES ACCORDION
// ================================

const RULE_DURATION = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 800; // мс — збільш, якщо хочеш ще повільніше

document.querySelectorAll(".rule-block").forEach(block => {

    const summary = block.querySelector("summary");
    const content = block.querySelector(".rule-content");

    let heightAnim = null;
    let fadeAnim = null;
    let closing = false;

    function run(startH, endH, opacityFrom, opacityTo, onDone) {

        if (heightAnim) heightAnim.cancel();
        if (fadeAnim) fadeAnim.cancel();

        const easing = "cubic-bezier(.22, 1, .36, 1)";

        heightAnim = block.animate(
            { height: [startH + "px", endH + "px"] },
            { duration: RULE_DURATION, easing }
        );

        fadeAnim = content.animate(
            { opacity: [opacityFrom, opacityTo] },
            { duration: RULE_DURATION, easing }
        );

        heightAnim.onfinish = () => {
            heightAnim = null;
            fadeAnim = null;
            onDone();
        };
    }

    summary.addEventListener("click", (event) => {

        event.preventDefault();

        block.style.overflow = "hidden";

        const startH = block.offsetHeight;

        if (block.open && !closing) {

            // ЗАКРИВАЄМО
            closing = true;

            const borders = block.offsetHeight - block.clientHeight;
            const endH = summary.offsetHeight + borders;

            run(startH, endH, 1, 0, () => {
                block.open = false;
                block.style.overflow = "";
                closing = false;
            });

        } else {

            // ВІДКРИВАЄМО
            closing = false;
            block.open = true;

            block.style.height = "auto";
            const endH = block.offsetHeight;
            block.style.height = "";

            run(startH, endH, 0, 1, () => {
                block.style.overflow = "";
            });

        }

    });

});

// ================================
// ACTIVE NAV LINK (підсвітка розділу)
// ================================

const navLinks = document.querySelectorAll(".nav a, .mobile-menu a[href^='#']");

const spy = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });

        });

    },
    {
        // "лінія спрацювання" посередині екрана
        rootMargin: "-45% 0px -50% 0px"
    }
);

["about", "admins", "rules"].forEach(id => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
});

// на самому верху сайту підсвітка знімається
const home = document.getElementById("home");

if (home) {
    new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                navLinks.forEach(link => link.classList.remove("active"));
            }
        },
        { rootMargin: "-45% 0px -50% 0px" }
    ).observe(home);
}

// ================================
// ЗБЕРЕЖЕННЯ ПОЗИЦІЇ СКРОЛУ ПРИ ОНОВЛЕННІ
// ================================

(function () {

    const KEY = "wonoplya-scroll-y";
    let ready = false; // не зберігаємо, поки не відновили позицію
    let ticking = false;

    // вимикаємо "кривe" авто-відновлення браузера, робимо своє
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    function save() {
        if (!ready) return;
        try {
            sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
        } catch (e) {}
    }

    function restore() {
        let y = 0;
        try {
            y = parseInt(sessionStorage.getItem(KEY), 10) || 0;
        } catch (e) {}

        if (y > 0) {
            // "instant" — без плавної прокрутки зверху вниз
            window.scrollTo({ top: y, left: 0, behavior: "instant" });
        }
    }

    // зберігаємо під час скролу (через rAF, щоб не навантажувати)
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            save();
            ticking = false;
        });
    }, { passive: true });

    // і перед закриттям/оновленням сторінки
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);

    // відновлюємо одразу, а потім ще раз після повного завантаження
    // (шрифти й стилі можуть змінити висоту сторінки)
    restore();

    window.addEventListener("load", () => {
        restore();
        ready = true;
    });

})();

// ================================
// АНІМАЦІЯ БУРГЕРА (☰ → ✕)
// ================================

(function () {

    const btn = document.getElementById("menuButton");
    const menu = document.getElementById("mobileMenu");

    if (!btn || !menu) return;

    function sync() {
        const isOpen = menu.classList.contains("active");
        btn.classList.toggle("open", isOpen);
        btn.setAttribute("aria-expanded", String(isOpen));
    }

    // цей слухач додано після основного, тому клас "active" уже оновлено
    btn.addEventListener("click", sync);

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", sync);
    });

    // якщо вікно розтягнули до десктопу, закриваємо меню
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            menu.classList.remove("active");
            sync();
        }
    });

})();
