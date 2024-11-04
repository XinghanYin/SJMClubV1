// 更新遮罩效果
function updateMask() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const logoRect = logo.getBoundingClientRect();
    const maskRadius = 135;
    const maskY = logoRect.top + logoRect.height / 2;
    
    const maskImage = `radial-gradient(circle at 50% ${maskY}px, transparent ${maskRadius}px, black ${maskRadius}px)`;
    canvas.style.webkitMaskImage = maskImage;
    canvas.style.maskImage = maskImage;
}

// 更新阴影效果
function updateShadow(e) {
    if (!logo) return;
    
    const rect = logo.getBoundingClientRect();
    const logoCenterX = rect.left + rect.width / 2;
    const logoCenterY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - logoCenterX;
    const deltaY = e.clientY - logoCenterY;
    
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (length === 0) return;
    
    const normalizedX = -deltaX / length;
    const normalizedY = -deltaY / length;
    
    const maxShadowLength = 30;
    const shadowLength = Math.min(length * 0.2, maxShadowLength);
    
    const shadowX = normalizedX * shadowLength;
    const shadowY = normalizedY * shadowLength;
    
    const maxBlur = 20;
    const blur = Math.min(shadowLength, maxBlur);
    const opacity = Math.min(0.8, shadowLength / maxShadowLength);
    
    requestAnimationFrame(() => {
        logo.style.filter = `drop-shadow(${shadowX}px ${shadowY}px ${blur}px rgba(0, 0, 0, ${opacity}))`;
    });
}

const throttledUpdateShadow = throttle(updateShadow, 1000 / 60);

// 渐变背景管理器
// 渐变背景管理器
const GradientBackground = {
    color1: null,
    color2: null,
    targetColor1: null,
    targetColor2: null,
    animationFrame: null,
    startTime: null,
    transitionDuration: 2000, // 颜色过渡时间（毫秒）
    updateInterval: 1500,      // 颜色更新间隔（毫秒）
    updateTimeout: null,

    // 缓动函数
    easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },

    // 将十六进制颜色转换为RGB数组
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    },

    // 将RGB数组转换为十六进制颜色
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },

    // 在两个颜色之间进行插值
    interpolateColor(color1, color2, factor) {
        if (!color1 || !color2) return '#000000';
        
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        const r = rgb1[0] + (rgb2[0] - rgb1[0]) * factor;
        const g = rgb1[1] + (rgb2[1] - rgb1[1]) * factor;
        const b = rgb1[2] + (rgb2[2] - rgb1[2]) * factor;
        
        return this.rgbToHex(r, g, b);
    },

    // 更新渐变
    update(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
        }

        const elapsed = timestamp - this.startTime;
        const progress = Math.min(elapsed / this.transitionDuration, 1);
        const easedProgress = this.easeInOut(progress);
        
        const currentColor1 = this.interpolateColor(this.color1, this.targetColor1, easedProgress);
        const currentColor2 = this.interpolateColor(this.color2, this.targetColor2, easedProgress);
            
        const gradientBg = document.getElementById('gradient-bg');
        gradientBg.style.background = `linear-gradient(45deg, ${currentColor1}, ${currentColor2})`;
        
        if (progress < 1) {
            this.animationFrame = requestAnimationFrame(this.update.bind(this));
        } else {
            this.color1 = this.targetColor1;
            this.color2 = this.targetColor2;
            this.startTime = null;
            
            // 设置下一次颜色更新
            this.updateTimeout = setTimeout(() => {
                this.setNewTargetColors();
            }, this.updateInterval);
        }
    },

    // 生成优雅的随机颜色
    generateElegantColor() {
        // 使用更柔和的颜色范围
        const hue = Math.random() * 360;
        const saturation = 30 + Math.random() * 30; // 30-60%
        const lightness = 30 + Math.random() * 40;  // 30-70%
        
        // 转换 HSL 到 RGB
        function hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [
                Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255)
            ];
        }

        const [r, g, b] = hslToRgb(hue, saturation, lightness);
        return this.rgbToHex(r, g, b);
    },

    // 设置新的目标颜色
    setNewTargetColors() {
        this.targetColor1 = this.generateElegantColor();
        this.targetColor2 = this.generateElegantColor();
        this.startTime = null;
        this.animationFrame = requestAnimationFrame(this.update.bind(this));
    },

    // 初始化渐变背景
    init() {
        this.color1 = this.generateElegantColor();
        this.color2 = this.generateElegantColor();
        this.targetColor1 = this.generateElegantColor();
        this.targetColor2 = this.generateElegantColor();
        
        const gradientBg = document.getElementById('gradient-bg');
        gradientBg.style.background = `linear-gradient(45deg, ${this.color1}, ${this.color2})`;
        
        this.animationFrame = requestAnimationFrame(this.update.bind(this));
    },

    // 停止动画
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
    }
};

// 创建渐变背景
function createGradientBackground() {
    GradientBackground.init();
}

// 清除特效
function clearEffect() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    if (typeof stopAnimation === 'function') {
        stopAnimation();
    }

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const logoRect = logo.getBoundingClientRect();
    const centerX = W / 2;
    const centerY = logoRect.top + logoRect.height / 2;
    let radius = 135;
    
    function expand() {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        
        const gradient = ctx.createRadialGradient(
            centerX, centerY, radius - 50,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        radius += 15;
        
        if (radius < Math.sqrt(W * W + H * H) * 1.5) {
            requestAnimationFrame(expand);
        } else {
            setTimeout(() => {
                canvas.remove();
                AnimationManager.currentAnimation = null;
            }, 100);
        }
    }
    
    expand();
}

// 页面卸载时清理动画
window.addEventListener('unload', () => {
    GradientBackground.stop();
});