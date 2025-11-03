let animationTime = 0;
const animationSpeed = 1;
let lanterns;
window.addEventListener('DOMContentLoaded', () => {
    scrollSide();
    initAutoAnimation();
    initScrollReveal();
    window.addEventListener('scroll', updateAutoAnimation);
    lanterns = new lantern();
});

window.addEventListener('scroll', () => {
    lanterns.update();
});

function initAutoAnimation() {    
    // 自動アニメーションループ
    function animate() {
        animationTime += animationSpeed;
        updateAutoAnimation();
        requestAnimationFrame(animate);
    }
    animate();
}

function updateAutoAnimation() {
    const scrollY = window.scrollY;

    const top1 = document.getElementById('top1');
    const top2 = document.getElementById('top2');
    const top3 = document.getElementById('top3');
    const top4 = document.getElementById('top4');
    
    // スクロール量に基づく移動量
    const scrollMoveAmount = scrollY * 0.3;
    const scrollMoveAmount2 = scrollY * 0.5;
    
    // 時間ベースの自動移動量（無限ループ）
    const autoMoveAmount = animationTime * 1; // ゆっくりとした速度
    const autoMoveAmount2 = animationTime * 1; // ゆっくりとした速度
    
    // 画像1と3は上に移動（スクロール + 自動）
    if (top1) {
        const totalMove1 = scrollMoveAmount + autoMoveAmount;
        top1.style.backgroundPosition = `center -${totalMove1}px`;
    }
    if (top3) {
        const totalMove3 = scrollMoveAmount + autoMoveAmount;
        top3.style.backgroundPosition = `center -${totalMove3}px`;
    }
    
    // 画像2と4は下に移動（スクロール + 自動）
    if (top2) {
        const totalMove2 = scrollMoveAmount2 + autoMoveAmount2;
        top2.style.backgroundPosition = `center ${totalMove2}px`;
    }
    if (top4) {
        const totalMove4 = scrollMoveAmount2 + autoMoveAmount2;
        top4.style.backgroundPosition = `center ${totalMove4}px`;
    }
}

function scrollSide(direction) {
    const transSide = document.getElementsByClassName('transition-side');
    Array.from(transSide).forEach((elm) => {
        elm.style.transform = 'translateX(0)';
    });
}

// スクロール表示アニメーション
function initScrollReveal() {
    const themeContent = document.querySelector('.theme-content');
    
    if (!themeContent) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2, // 要素の20%が見えたらトリガー
        rootMargin: '0px 0px -200px 0px' // 少し早めに発火
    });
    
    observer.observe(themeContent);
}

class lantern {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.lanternElements = [];
        this.lanternElem = null;
        this.initLanterns();
    }

    /**
     *  ランタンを作成・移動させる
     * @param {*} x : x座標(%) 
     * @param {*} yelem : y座標の要素ID
     * @param {*} dy : y座標のオフセット
     * @param {*} size : ランタンのサイズ
     * @param {*} blur : ブラー効果
     * @param {*} speed : 移動速度倍率 normal:1 faster: 1.3 slower:0.5
     * @param {*} rotate : 回転角度
     * @param pc: boolean : PCのみ表示か
     */
    makeLantern(x, lr, yelem, dy, size, blur, speed, rotate = 0, addClass = undefined) {
        if (this.lanternElem === null) console.error('Lantern element not initialized');
        const parentY = document.getElementById(yelem);
        const y = parentY.getBoundingClientRect().top + parentY.offsetHeight * dy / 100;
        const z = () => {
            switch (true) {
                case speed > 1:
                    return 1;
                case speed < 1:
                    return -1;
                default:
                    return 0;
            }
        };
        const lanternElem = document.createElement('img');
        lanternElem.src = '/asset/image/lantern.png';
        lanternElem.alt = '';
        lanternElem.style.cssText = `position:absolute;${lr==='l' ? 'left' : 'right'}:${x}%;top:${y}px;width:${size*0.7}px;filter:blur(${blur}px);pointer-events:none;rotate:${rotate}deg;z-index:${z()};`;
        if (addClass) {
            lanternElem.classList.add(addClass);
        }
        this.lanternElem.appendChild(lanternElem);
        this.lanternElements.push({elm: lanternElem, speed: speed});
    }

    update() {
        this.lanternElements.forEach((lantern) => {
            this.updatePosition(lantern.elm, lantern.speed);
        });
    }

    updatePosition(elm, speed) {
        const constRate = 300; // 調整用定数
        const elmHeight = elm.offsetHeight / 2;
        const yPos = window.scrollY + elmHeight;
        const displayHeight = window.innerHeight;
        const translateY = (yPos / (displayHeight / 2) - 1) * (speed - 1) * constRate;
        elm.style.transform = `translateY(${translateY}px)`;
    }

    initLanterns() {
        const lanternElem = document.createElement('div');
        lanternElem.id = 'lantern-container';
        lanternElem.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:90;overflow:hidden;';
        lanternElem.ariaHidden = true;
        this.lanternElem = lanternElem;
        document.body.appendChild(lanternElem);
        this.makeLantern(5, 'r', 'top', 8, 240, 3, 1.3, -8);
        this.makeLantern(23, 'l', 'top', 18, 60, 0, 0.7, 12);
        this.makeLantern(5, 'l', 'top', 40, 120, 1, 1, 15, 'pc');
        this.makeLantern(25, 'r', 'top', 65, 140, 1, 1, -6, 'pc');

        this.makeLantern(0, 'l', 'about', 0, 250, 3, 1.3, -8, 'pc');
        this.makeLantern(5, 'r', 'about', -30, 160, 1, 1, 15, 'pc');
        this.makeLantern(15, 'r', 'about', 100, 80, 0, 0.7, 12, 'pc');

        this.makeLantern(0, 'r', 'theme', -50, 250, 3, 1.3, 10, 'pc');
        this.makeLantern(5, 'l', 'theme', 80, 160, 1, 1, -5, 'pc');
        
        this.makeLantern(5, 'l', 'guest', 20, 70, 1, 0.8, -8, 'pc');
        this.makeLantern(5, 'r', 'guest', 50, 160, 1, 1, -15, 'pc');
        this.makeLantern(15, 'l', 'guest', 100, 80, 0, 0.8, 12, 'pc');

        this.makeLantern(0, 'l', 'timetable', -50, 250, 3, 1.3, -8, 'pc');
        this.makeLantern(5, 'r', 'timetable', 0, 160, 1, 1, 15, 'pc');
        this.makeLantern(15, 'l', 'timetable', 100, 80, 0, 0.7, 12, 'pc');
        this.update();
    }
}