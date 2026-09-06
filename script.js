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
