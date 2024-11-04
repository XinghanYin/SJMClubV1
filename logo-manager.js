// logo-manager.js

window.LogoManager = class LogoManager {
    constructor() {
        this.clickCount = 0;
        this.areButtonsVisible = false;
        this.cornerButtons = [];
        this.ANIMATION_DURATION = 8000;
        this.lastAnimationStartTime = Date.now(); // 设置初始时间
        
        this.buttonConfigs = [
            { position: 'top-left', image: 'img/menu1.svg' },
            { position: 'top-right', image: 'img/menu2.svg' },
            { position: 'bottom-left', image: 'img/menu3.svg' },
            { position: 'bottom-right', image: 'img/menu4.svg' }
        ];
    }

    init() {
        // 初始化logo点击事件
        const logo = document.getElementById('logo');
        if (logo) {
            logo.addEventListener('click', () => this.handleLogoClick());
        }
        
        // 创建角落按钮
        this.createCornerButtons();

        // 监听canvas创建
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'CANVAS') {
                        console.log('Animation started'); // 调试日志
                        this.lastAnimationStartTime = Date.now();
                        this.hideAllButtons();
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    isAnimationActive() {
        const timeSinceStart = Date.now() - this.lastAnimationStartTime;
        console.log('Time since animation start:', timeSinceStart); // 调试日志
        return timeSinceStart < this.ANIMATION_DURATION;
    }

    handleLogoClick() {
        console.log('Logo clicked'); // 调试日志
        if (!this.isAnimationActive()) {
            console.log('Animation finished, toggling buttons'); // 调试日志
            this.toggleCornerButtons();
        } else {
            console.log('Animation still active, ignoring click'); // 调试日志
        }
    }

    hideAllButtons() {
        this.cornerButtons.forEach(button => {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        });
        this.areButtonsVisible = false;
    }

    createCornerButtons() {
        const container = document.getElementById('container');
        if (!container) {
            console.error('Container not found'); // 调试日志
            return;
        }

        this.buttonConfigs.forEach(config => {
            const button = document.createElement('div');
            button.className = `corner-button ${config.position}`;
            
            const img = document.createElement('img');
            img.src = config.image;
            img.style.cssText = `
                width: 60px;
                height: 60px;
                transition: transform 0.3s ease;
            `;
            button.appendChild(img);
            
            button.style.cssText = `
                position: fixed;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                opacity: 0;
                z-index: 1000;
                transition: opacity 0.3s ease;
            `;
            
            // 设置位置
            switch (config.position) {
                case 'top-left':
                    button.style.top = '20px';
                    button.style.left = '20px';
                    break;
                case 'top-right':
                    button.style.top = '20px';
                    button.style.right = '20px';
                    break;
                case 'bottom-left':
                    button.style.bottom = '20px';
                    button.style.left = '20px';
                    break;
                case 'bottom-right':
                    button.style.bottom = '20px';
                    button.style.right = '20px';
                    break;
            }
            
            // 悬停效果
            button.addEventListener('mouseover', () => {
                if (this.areButtonsVisible) {
                    img.style.transform = 'scale(1.2)';
                }
            });
            
            button.addEventListener('mouseout', () => {
                if (this.areButtonsVisible) {
                    img.style.transform = 'scale(1)';
                }
            });
            
            button.addEventListener('click', () => {
                if (this.areButtonsVisible) {
                    console.log(`Clicked ${config.position} button`); // 调试日志
                }
            });
            
            container.appendChild(button);
            this.cornerButtons.push(button);
            console.log(`Created button: ${config.position}`); // 调试日志
        });
    }

    toggleCornerButtons() {
        this.areButtonsVisible = !this.areButtonsVisible;
        console.log('Toggling buttons:', this.areButtonsVisible); // 调试日志
        
        this.cornerButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = this.areButtonsVisible ? '1' : '0';
                button.style.pointerEvents = this.areButtonsVisible ? 'auto' : 'none';
            }, index * 100);
        });
    }
};

// 等待页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing LogoManager'); // 调试日志
    const manager = new LogoManager();
    manager.init();
    window.logoManager = manager;
});