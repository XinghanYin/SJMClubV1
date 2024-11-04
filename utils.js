// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 预加载和位置修正函数
function preloadAndFixPosition(svgPath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve();
        };
        img.src = svgPath;
    });
}

// 生成随机颜色
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 随机序列生成器类
class ShuffleSequence {
    constructor(array) {
        this.originalArray = [...array];
        this.currentArray = [];
        this.reset();
    }

    reset() {
        this.currentArray = [...this.originalArray];
        this.shuffle(this.currentArray);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    next() {
        if (this.currentArray.length === 0) {
            this.reset();
        }
        return this.currentArray.pop();
    }
}

// 创建循环序列生成器
class CycleSequence {
    constructor(array) {
        this.array = [...array];
        this.currentIndex = Math.floor(Math.random() * this.array.length);
    }

    next() {
        const item = this.array[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.array.length;
        return item;
    }
}