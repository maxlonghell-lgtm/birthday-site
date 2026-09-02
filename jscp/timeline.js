// Timeline (Memory Lane) Logic
// Triggered after the heart photos finish

function initTimeline() {
    // Check if timeline already exists
    if (document.getElementById('timeline-container')) return;

    // Create Timeline UI - full screen overlay
    const timelineContainer = document.createElement('div');
    timelineContainer.id = 'timeline-container';
    timelineContainer.className = 'timeline-container';
    timelineContainer.style.opacity = '0';
    timelineContainer.style.transition = 'opacity 1s ease';

    // Milestones data - agrega "image: './image/Birthday!/TUFOTO.jpg'" en cualquiera para poner una foto
    const milestones = [
        { year: "2004", title: "El Comienzo ✨", desc: "Donde todo empezó — ¡nació una estrella! 🌟", image: "" },
        { year: "2010", title: "Momentos Inolvidables 💫", desc: "Una época llena de alegría, risas y amor.", image: "" },
        { year: "2018", title: "Cada Día Más Fuerte 🌸", desc: "Cada día creces más increíble y hermosa.", image: "" },
        { year: "2022", title: "Un Nuevo Camino 📚", desc: "Comenzaste tu camino para ser maestra de educación inicial y primaria.", image: "" },
        { year: "2026", title: "¡Feliz Cumpleaños Sharon! 🎂", desc: "22 años y con un futuro hermoso por delante. ¡Te deseamos lo mejor hoy y siempre!", image: "" }
    ];

    let html = '<h2 class="timeline-title">✨ Recuerdos ✨</h2><div class="timeline">';
    milestones.forEach((m, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        const photoHtml = m.image
            ? `<img src="${m.image}" alt="${m.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
            : '📷 Photo Space';
        html += `
            <div class="timeline-item ${side}">
                <div class="timeline-content">
                    <span class="timeline-year">${m.year}</span>
                    <h3>${m.title}</h3>
                    <p>${m.desc}</p>
                    <div class="timeline-photo-box" style="margin-top:15px;min-height:150px;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);border:1px dashed rgba(255,105,180,0.4);">
                        ${photoHtml}
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Button - placed OUTSIDE the scrollable area at the bottom
    const btnHtml = `
        <div class="timeline-btn-wrapper">
            <button id="proceedToCakeBtn" class="timeline-btn">
                Pide un Deseo 🎂
            </button>
        </div>
    `;

    timelineContainer.innerHTML = html + btnHtml;
    document.body.appendChild(timelineContainer);

    // Fade in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            timelineContainer.style.opacity = '1';
        });
    });

    // Attach click — do NOT use scrollIntoView (it causes scroll lock bug)
    const btn = document.getElementById('proceedToCakeBtn');
    if (btn) {
        // Pulse animation via class, not inline style that overrides transform
        btn.classList.add('timeline-btn-pulse');

        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.innerText = '🎂 Cargando pastel...';

            // Fade out the whole container
            timelineContainer.style.opacity = '0';
            timelineContainer.style.transform = 'translateY(60px)';
            timelineContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

            setTimeout(() => {
                timelineContainer.remove();
                if (typeof init3DCake === 'function') {
                    init3DCake();
                } else {
                    console.error('init3DCake function not found!');
                }
            }, 900);
        });
    }
}
