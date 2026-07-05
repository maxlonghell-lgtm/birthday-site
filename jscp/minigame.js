// Mini-game: Catch the Gifts! (Premium Edition)

function initEasterEgg() {
    // Spawn a hidden floating gift after 15 seconds
    setTimeout(() => {
        const secretGift = document.createElement('div');
        secretGift.innerText = '🎁';
        secretGift.style.position = 'fixed';
        secretGift.style.top = '10%';
        secretGift.style.right = '-50px';
        secretGift.style.fontSize = '45px';
        secretGift.style.cursor = 'pointer';
        secretGift.style.zIndex = '9999';
        secretGift.style.transition = 'transform 12s linear';
        secretGift.style.filter = 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.8))';
        document.body.appendChild(secretGift);

        // Float across screen
        setTimeout(() => {
            secretGift.style.transform = `translate(-${window.innerWidth + 100}px, 200px) rotate(360deg)`;
        }, 100);

        secretGift.addEventListener('click', () => {
            secretGift.remove();
            startMiniGame();
        });

    }, 15000);
}

function startMiniGame() {
    // Premium Glassmorphism Modal Background
    const overlay = document.createElement('div');
    overlay.id = 'minigame-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(10, 5, 20, 0.8)';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.WebkitBackdropFilter = 'blur(10px)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.animation = 'fadeInUp 0.5s ease';

    // Premium Container
    const container = document.createElement('div');
    container.style.width = '90%';
    container.style.maxWidth = '450px';
    container.style.height = '75%';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    container.style.border = '1px solid rgba(255, 105, 180, 0.4)';
    container.style.borderRadius = '20px';
    container.style.boxShadow = '0 15px 45px rgba(255, 20, 147, 0.3)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '20px';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    overlay.appendChild(container);
    
    // Header
    const title = document.createElement('h2');
    title.innerText = "Catch 10 Gifts! 🎁";
    title.style.color = '#fff';
    title.style.margin = '0';
    title.style.fontFamily = 'Pacifico, cursive';
    title.style.textShadow = '0 0 10px #ff69b4';
    container.appendChild(title);

    const scoreBoard = document.createElement('h3');
    scoreBoard.innerText = "Score: 0";
    scoreBoard.style.color = '#ffb6c1';
    scoreBoard.style.fontFamily = 'Dancing Script, cursive';
    scoreBoard.style.fontSize = '2rem';
    scoreBoard.style.margin = '10px 0 20px 0';
    container.appendChild(scoreBoard);

    // Game Canvas Area
    const gameArea = document.createElement('div');
    gameArea.style.position = 'relative';
    gameArea.style.width = '100%';
    gameArea.style.flexGrow = '1';
    gameArea.style.border = '2px dashed rgba(255, 105, 180, 0.5)';
    gameArea.style.borderRadius = '15px';
    gameArea.style.overflow = 'hidden';
    gameArea.style.background = 'linear-gradient(to bottom, rgba(255,105,180,0.05), rgba(255,20,147,0.1))';
    container.appendChild(gameArea);

    // Basket
    const basket = document.createElement('div');
    basket.innerText = '🧺';
    basket.style.position = 'absolute';
    basket.style.bottom = '10px';
    basket.style.left = '50%';
    basket.style.fontSize = '45px';
    basket.style.transform = 'translateX(-50%)';
    basket.style.transition = 'left 0.1s ease-out';
    basket.style.filter = 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))';
    gameArea.appendChild(basket);

    document.body.appendChild(overlay);

    let score = 0;
    let basketX = 50; // percentage
    let gameInterval;
    let gifts = [];
    let isGameOver = false;

    // Movement Physics
    document.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        if (e.key === 'ArrowLeft' && basketX > 8) basketX -= 8;
        if (e.key === 'ArrowRight' && basketX < 92) basketX += 8;
        basket.style.left = basketX + '%';
    });
    
    // Smooth Touch support
    gameArea.addEventListener('touchmove', (e) => {
        if (isGameOver) return;
        e.preventDefault(); // Prevent scrolling
        const touch = e.touches[0];
        const rect = gameArea.getBoundingClientRect();
        let x = ((touch.clientX - rect.left) / rect.width) * 100;
        if (x < 8) x = 8;
        if (x > 92) x = 92;
        basketX = x;
        basket.style.left = basketX + '%';
    }, { passive: false });

    // Mouse control support
    gameArea.addEventListener('mousemove', (e) => {
        if (isGameOver) return;
        const rect = gameArea.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        if (x < 8) x = 8;
        if (x > 92) x = 92;
        basketX = x;
        basket.style.left = basketX + '%';
    });

    function spawnGift() {
        const gift = document.createElement('div');
        gift.innerText = '🎁';
        gift.style.position = 'absolute';
        gift.style.top = '-40px';
        gift.style.left = Math.random() * 80 + 10 + '%';
        gift.style.fontSize = '35px';
        gift.style.filter = 'drop-shadow(0 0 8px rgba(255,105,180,0.8))';
        gift.style.cursor = 'pointer'; // Make it look clickable
        
        // Add direct click/touch listener for cursor catching
        const catchGift = (e) => {
            if (isGameOver) return;
            e.preventDefault();
            e.stopPropagation();
            
            // Catch animation
            gift.style.transform = 'scale(0)';
            gift.style.transition = 'transform 0.2s';
            setTimeout(() => gift.remove(), 200);
            
            // Remove from array safely
            const index = gifts.findIndex(g => g.el === gift);
            if (index > -1) {
                gifts.splice(index, 1);
            }
            
            score++;
            scoreBoard.innerText = "Score: " + score;
            scoreBoard.style.transform = 'scale(1.2)';
            setTimeout(() => scoreBoard.style.transform = 'scale(1)', 150);

            if (score >= 10) {
                winGame();
            }
        };
        
        gift.addEventListener('mousedown', catchGift);
        gift.addEventListener('touchstart', catchGift, { passive: false });
        
        gameArea.appendChild(gift);
        gifts.push({ el: gift, y: -40, isCaught: false });
    }

    function gameLoop() {
        if (isGameOver) return;
        
        // Dynamic spawn rate
        if (Math.random() < 0.04 + (score * 0.002)) spawnGift();

        const basketRect = basket.getBoundingClientRect();

        for (let i = gifts.length - 1; i >= 0; i--) {
            const giftObj = gifts[i];
            giftObj.y += 4 + (score * 0.2); // gets faster
            giftObj.el.style.top = giftObj.y + 'px';

            const giftRect = giftObj.el.getBoundingClientRect();

            // Refined collision detection
            if (
                giftRect.bottom >= basketRect.top + 10 &&
                giftRect.top <= basketRect.bottom &&
                giftRect.right - 15 >= basketRect.left &&
                giftRect.left + 15 <= basketRect.right
            ) {
                // Catch animation
                giftObj.el.style.transform = 'scale(0)';
                giftObj.el.style.transition = 'transform 0.2s';
                setTimeout(() => giftObj.el.remove(), 200);
                
                gifts.splice(i, 1);
                score++;
                scoreBoard.innerText = "Score: " + score;
                scoreBoard.style.transform = 'scale(1.2)';
                setTimeout(() => scoreBoard.style.transform = 'scale(1)', 150);

                if (score >= 10) {
                    winGame();
                }
            } 
            // Missed
            else if (giftObj.y > gameArea.clientHeight + 20) {
                giftObj.el.remove();
                gifts.splice(i, 1);
            }
        }
    }

    gameInterval = setInterval(gameLoop, 30);

    function winGame() {
        isGameOver = true;
        clearInterval(gameInterval);
        gameArea.innerHTML = '';
        
        scoreBoard.innerText = "🎉 YOU WON! 🎉";
        scoreBoard.style.fontSize = '2.5rem';
        
        const secretMsg = document.createElement('div');
        secretMsg.style.textAlign = 'center';
        secretMsg.style.padding = '20px';
        secretMsg.style.animation = 'fadeInUp 1s ease';
        secretMsg.innerHTML = '<h3 style="color:#fff; font-family:\'Pacifico\', cursive; font-size: 1.8rem; line-height: 1.5; text-shadow: 0 0 10px #ff69b4;">Secret Unlocked:<br><br>You are absolutely amazing, and today is all about YOU! 💖</h3>';
        gameArea.appendChild(secretMsg);
        
        const closeBtn = document.createElement('button');
        closeBtn.innerText = "Close";
        closeBtn.className = "timeline-btn"; // Reuse our premium button class from CSS
        closeBtn.style.marginTop = "30px";
        closeBtn.addEventListener('click', () => {
            overlay.style.animation = 'fadeOutDown 0.5s ease';
            setTimeout(() => overlay.remove(), 500);
        });
        
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'center';
        btnContainer.appendChild(closeBtn);
        
        gameArea.appendChild(btnContainer);
    }
}

document.addEventListener('DOMContentLoaded', initEasterEgg);
