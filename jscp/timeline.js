// Timeline (Memory Lane) Logic
// Triggered after the heart photos finish

function initTimeline() {
    // Check if timeline already exists
    if (document.getElementById('timeline-container')) return;

    // Create Timeline UI
    const timelineContainer = document.createElement('div');
    timelineContainer.id = 'timeline-container';
    timelineContainer.className = 'timeline-container hidden';

    // Some placeholder milestones
    const milestones = [
        { year: "2018", title: "The Beginning", desc: "Where it all started...", img: "./image/placeholder1.jpg" },
        { year: "2020", title: "Unforgettable Memories", desc: "A time of joy and laughter.", img: "./image/placeholder2.jpg" },
        { year: "2023", title: "Growing Stronger", desc: "Achieving milestones together.", img: "./image/placeholder3.jpg" },
        { year: "2024", title: "Happy Birthday Zahra!", desc: "Wishing you the absolute best today!", img: "./image/placeholder4.jpg" }
    ];

    let html = '<h2 class="timeline-title">Memory Lane</h2><div class="timeline">';
    milestones.forEach((m, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        html += `
            <div class="timeline-item ${side}">
                <div class="timeline-content">
                    <h3>${m.year} - ${m.title}</h3>
                    <p>${m.desc}</p>
                    <div class="timeline-img-placeholder">📸 Photo Space</div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Add a button to proceed to the Cake (Phase 4)
    html += '<button id="proceedToCakeBtn" class="timeline-btn">Make a Wish 🎂</button>';

    timelineContainer.innerHTML = html;
    document.body.appendChild(timelineContainer);

    // Fade in timeline and scroll to bottom button later
    setTimeout(() => {
        timelineContainer.classList.remove('hidden');
        timelineContainer.classList.add('fade-in-up');
        
        // Auto scroll down slowly to reveal the button after they read the timeline
        setTimeout(() => {
            const btn = document.getElementById('proceedToCakeBtn');
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
            
            // Highlight button
            btn.style.animation = 'pulse 2s infinite';
        }, 5000); // Scroll down after 5 seconds
    }, 500);

    // Event listener for next phase
    document.getElementById('proceedToCakeBtn').addEventListener('click', () => {
        timelineContainer.classList.remove('fade-in-up');
        timelineContainer.classList.add('fade-out-down');
        setTimeout(() => {
            timelineContainer.remove();
            if (typeof init3DCake === 'function') {
                init3DCake();
            }
        }, 1000);
    });
}
