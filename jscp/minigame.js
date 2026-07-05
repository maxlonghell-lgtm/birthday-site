// Mini-game: Catch the Gifts!

function initEasterEgg() {
    // Spawn a hidden floating gift after 10 seconds
    setTimeout(() => {
        const secretGift = document.createElement('div');
        secretGift.innerText = '🎁';
        secretGift.style.position = 'fixed';
        secretGift.style.top = '10%';
        secretGift.style.right = '-50px';
        secretGift.style.fontSize = '40px';
        secretGift.style.cursor = 'pointer';
        secretGift.style.zIndex = '9999';
        secretGift.style.transition = 'transform 10s linear';
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
    const container = document.createElement('div');
    container.id = 'minigame-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0,0,0,0.9)';
    container.style.zIndex = '10000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    
    const title = document.createElement('h2');
    title.innerText = "Mini-Game: Catch 10 Gifts!";
    title.style.color = 'white';
    title.style.marginTop = '20px';
    title.style.fontFamily = 'Pacifico, cursive';
    container.appendChild(title);

    const scoreBoard = document.createElement('h3');
    scoreBoard.innerText = "Score: 0";
    scoreBoard.style.color = '#ff69b4';
    container.appendChild(scoreBoard);

    const gameArea = document.createElement('div');
    gameArea.style.position = 'relative';
    gameArea.style.width = '100%';
    gameArea.style.maxWidth = '400px';
    gameArea.style.height = '70%';
    gameArea.style.border = '2px solid #ff69b4';
    gameArea.style.overflow = 'hidden';
    container.appendChild(gameArea);

    const basket = document.createElement('div');
    basket.innerText = '🧺';
    basket.style.position = 'absolute';
    basket.style.bottom = '10px';
    basket.style.left = '50%';
    basket.style.fontSize = '40px';
    basket.style.transform = 'translateX(-50%)';
    gameArea.appendChild(basket);

    document.body.appendChild(container);

    let score = 0;
    let basketX = 50; // percentage
    let gameInterval;
    let gifts = [];

    // Move basket
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && basketX > 5) basketX -= 10;
        if (e.key === 'ArrowRight' && basketX < 95) basketX += 10;
        basket.style.left = basketX + '%';
    });
    
    // Touch support for mobile
    gameArea.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = gameArea.getBoundingClientRect();
        let x = ((touch.clientX - rect.left) / rect.width) * 100;
        if (x < 5) x = 5;
        if (x > 95) x = 95;
        basketX = x;
        basket.style.left = basketX + '%';
    });

    function spawnGift() {
        const gift = document.createElement('div');
        gift.innerText = '🎁';
        gift.style.position = 'absolute';
        gift.style.top = '0px';
        gift.style.left = Math.random() * 90 + 5 + '%';
        gift.style.fontSize = '30px';
        gameArea.appendChild(gift);
        gifts.push({ el: gift, y: 0 });
    }

    function gameLoop() {
        if (Math.random() < 0.05) spawnGift();

        const basketRect = basket.getBoundingClientRect();

        for (let i = gifts.length - 1; i >= 0; i--) {
            const giftObj = gifts[i];
            giftObj.y += 5;
            giftObj.el.style.top = giftObj.y + 'px';

            const giftRect = giftObj.el.getBoundingClientRect();

            // Check collision
            if (
                giftRect.bottom >= basketRect.top &&
                giftRect.top <= basketRect.bottom &&
                giftRect.right >= basketRect.left &&
                giftRect.left <= basketRect.right
            ) {
                giftObj.el.remove();
                gifts.splice(i, 1);
                score++;
                scoreBoard.innerText = "Score: " + score;

                if (score >= 10) {
                    winGame();
                }
            } 
            // Missed
            else if (giftObj.y > gameArea.clientHeight) {
                giftObj.el.remove();
                gifts.splice(i, 1);
            }
        }
    }

    gameInterval = setInterval(gameLoop, 30);

    function winGame() {
        clearInterval(gameInterval);
        gameArea.innerHTML = '';
        scoreBoard.innerText = "🎉 YOU WON! 🎉";
        
        const secretMsg = document.createElement('div');
        secretMsg.innerHTML = '<br><h3 style="color:white; text-align:center;">Secret Unlocked:<br><br>You are the most amazing person! 💖</h3>';
        gameArea.appendChild(secretMsg);
        
        const closeBtn = document.createElement('button');
        closeBtn.innerText = "Close";
        closeBtn.style.marginTop = "20px";
        closeBtn.style.padding = "10px 20px";
        closeBtn.addEventListener('click', () => {
            container.remove();
        });
        gameArea.appendChild(closeBtn);
    }
}

document.addEventListener('DOMContentLoaded', initEasterEgg);
