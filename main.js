// ============================================
// 1. PERSISTENCIA DE IDIOMA
// ============================================
function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('fenya-lang', lang);

    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');

    if (btnEs && btnEn) {
        if (lang === 'es') {
            btnEs.classList.add('text-cal', 'border-b', 'border-dorado');
            btnEs.classList.remove('text-white/40', 'text-white/50');
            btnEn.classList.remove('text-cal', 'border-b', 'border-dorado');
            btnEn.classList.add('text-white/40', 'text-white/50');
        } else {
            btnEn.classList.add('text-cal', 'border-b', 'border-dorado');
            btnEn.classList.remove('text-white/40', 'text-white/50');
            btnEs.classList.remove('text-cal', 'border-b', 'border-dorado');
            btnEs.classList.add('text-white/40', 'text-white/50');
        }
    }
}

// ============================================
// 2. ANIMACIONES DE SCROLL (REVEAL)
// ============================================
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// ============================================
// 3. INICIALIZACIÓN AL CARGAR
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    // Restaurar idioma guardado
    const savedLang = localStorage.getItem('fenya-lang') || 'es';
    setLang(savedLang);

    // Trigger inicial de reveal animations
    setTimeout(reveal, 100);

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Manejo del formulario (si existe en la página)
    const form = document.getElementById('reserva-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const loadingMsg = document.querySelector('.loading-msg');
            if (loadingMsg) loadingMsg.style.display = 'block';

            const formData = new FormData(form);
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
                .then(() => {
                    const selectElement = document.getElementById('lectura');
                    const selectedValue = selectElement.value;

                    if (selectedValue.includes('stripe.com')) {
                        window.location.href = selectedValue;
                    } else {
                        const currentLang = document.documentElement.getAttribute('data-lang');
                        alert(currentLang === 'es' ?
                            "¡Solicitud recibida! Te contactaremos pronto para tu experiencia en el hotel." :
                            "Request received! We will contact you shortly regarding your hotel experience.");
                        window.location.href = "index.html";
                    }
                })
                .catch((error) => {
                    const currentLang = document.documentElement.getAttribute('data-lang');
                    alert(currentLang === 'es' ?
                        'Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.' :
                        'There was an error processing your request. Please try again.');
                    if (loadingMsg) loadingMsg.style.display = 'none';
                });
        });
    }
});
