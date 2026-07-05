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

    // Milestones data
    const milestones = [
        { year: "2018", title: "The Beginning ✨", desc: "Where it all started — a star was born! 🌟" },
        { year: "2020", title: "Unforgettable Memories 💫", desc: "A time filled with joy, laughter, and love." },
        { year: "2022", title: "Growing Stronger 🌸", desc: "Every day you grow more amazing and beautiful." },
        { year: "2023", title: "Shining Bright ⭐", desc: "Your kindness and warmth touched so many hearts." },
        { year: "2024", title: "Happy Birthday Zahra! 🎂", desc: "Wishing you the absolute best today and always!" }
    ];

    let html = '<h2 class="timeline-title">✨ Memory Lane ✨</h2><div class="timeline">';
    milestones.forEach((m, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        html += `
            <div class="timeline-item ${side}">
                <div class="timeline-content">
                    <span class="timeline-year">${m.year}</span>
                    <h3>${m.title}</h3>
                    <p>${m.desc}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Button - placed OUTSIDE the scrollable area at the bottom
    const btnHtml = `
        <div class="timeline-btn-wrapper">
            <button id="proceedToCakeBtn" class="timeline-btn">
                Make a Wish 🎂
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
            btn.innerText = '🎂 Loading Cake...';

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
