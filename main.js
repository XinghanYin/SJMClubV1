// 获取Logo元素
const logo = document.getElementById('logo');

// 创建序列生成器实例
const logoSequence = new ShuffleSequence(CONFIG.alternatives);
const sentenceSequence = new CycleSequence(SENTENCES.alternatives);

// 标记当前是否为默认状态
let isDefaultState = true;
let textCycleInterval = null;

// 检测文本是否包含中文
function containsChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
}

// 更新标题文本
function updateTitleText(title, subtitle) {
    const titleText = document.querySelector('.title-text');
    
    // 创建新的元素
    const newTitle = document.createElement('div');
    newTitle.className = 'title-text';
    newTitle.innerHTML = `
        <span class="${containsChinese(title) ? 'chinese-text' : 'english-text'}">${title}</span>
        <span class="${containsChinese(subtitle.text) ? 'chinese-text' : 'english-text'}">${subtitle.text}</span>
    `;
    
    // 添加淡入淡出效果
    titleText.style.opacity = '0';
    setTimeout(() => {
        titleText.innerHTML = newTitle.innerHTML;
        titleText.style.opacity = '1';
    }, 300);
}

// 更新Logo
function updateLogo(logoPath) {
    const logoHover = document.querySelector('.logo-hover');
    return preloadAndFixPosition(logoPath).then(() => {
        logoHover.style.backgroundImage = `url('${logoPath}')`;
    });
}

// 周期性更新标题文本
function cycleText() {
    if (isDefaultState) {
        const nextSentence = sentenceSequence.next();
        updateTitleText(nextSentence.title, nextSentence.subtitle);
    }
}

// 开始文本循环
function startTextCycle() {
    if (!textCycleInterval) {
        textCycleInterval = setInterval(cycleText, TEXT_CYCLE_INTERVAL);
    }
}

// 停止文本循环
function stopTextCycle() {
    if (textCycleInterval) {
        clearInterval(textCycleInterval);
        textCycleInterval = null;
    }
}

// 设置文本循环间隔（5秒）
const TEXT_CYCLE_INTERVAL = 5000;

// 动画管理器
const AnimationManager = {
    currentAnimation: null,
    effects: ['matrix', 'hexagon', 'yigo'],
    clearTimer: null,
    isClearing: false,

    loadRandomEffect() {
        if (!window.startCombinedEffect) {
            console.error('Animation script not loaded');
            return;
        }

        if (this.clearTimer) {
            clearTimeout(this.clearTimer);
        }

        if (this.currentAnimation) {
            if (typeof stopAnimation === 'function') {
                stopAnimation();
            }
        }

        this.isClearing = true;

        const effect = this.effects[Math.floor(Math.random() * this.effects.length)];
        startCombinedEffect(effect);
        this.currentAnimation = effect;

        this.isClearing = false;
        updateMask();
        
        requestAnimationFrame(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.style.backgroundColor = 'transparent';
            }
        });

        this.clearTimer = setTimeout(() => {
            if (!this.isClearing) {
                clearEffect();
            }
        }, 8000);
    }
};

// 事件监听器设置
window.addEventListener('resize', updateMask);
document.addEventListener("mousemove", throttledUpdateShadow);

// Logo事件监听
logo.addEventListener('mouseenter', async () => {
    isDefaultState = false;
    stopTextCycle();
    
    const alternative = logoSequence.next();
    await updateLogo(alternative.logo);
    updateTitleText(alternative.title, alternative.subtitle);
});

logo.addEventListener('mouseleave', async () => {
    isDefaultState = true;
    await updateLogo(CONFIG.defaultLogo);
    updateTitleText(SENTENCES.defaultText.title, SENTENCES.defaultText.subtitle);
    
    // 恢复文本循环
    startTextCycle();
});

// 页面加载初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 预加载所有图片
    const allLogos = [CONFIG.defaultLogo, ...CONFIG.alternatives.map(alt => alt.logo)];
    await Promise.all(allLogos.map(logo => preloadAndFixPosition(logo)));
    
    // 初始化各个独立的功能
    updateLogo(CONFIG.defaultLogo);
    updateTitleText(SENTENCES.defaultText.title, SENTENCES.defaultText.subtitle);
    GradientBackground.init(); // 独立的背景渐变
    AnimationManager.loadRandomEffect();

    // 启动文本循环
    startTextCycle();
});