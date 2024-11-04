(function() {
    // 组合三个动画效果并实现停止功能
    let animationId; // 用于存储动画帧的 ID，以便后续可以停止动画

    function startCombinedEffect(effect) {
        // 创建一个 canvas 画布并添加到页面中
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.style.cssText = "position: fixed; top: 0; left: 0; z-index: 2;"; // 设置 canvas 样式，使其覆盖整个页面
        const ctx = canvas.getContext('2d'); // 获取 2D 上下文用于绘制
        const W = canvas.width = window.innerWidth; // 设置 canvas 宽度为窗口宽度
        const H = canvas.height = window.innerHeight; // 设置 canvas 高度为窗口高度

        if (effect === 'matrix') {
            // Matrix 动画效果
            const fontSize = 30; // 设置字体大小
            let cols = Math.floor(W / fontSize); // 计算列数，每列宽度为字体大小
            let drops = new Array(cols).fill(Math.ceil(canvas.height / fontSize) + 1); // 初始化每列的下落起始位置
            let dropSpeed = 30; // 设置下落速度
            const str = "我们都是三脚猫俱乐部";
            function drawMatrix() {

                // 动画主循环
                animationId = requestAnimationFrame(drawMatrix); // 请求下一帧动画
                ctx.fillStyle = "rgba(0,0,0,0.1)"; // 设置背景色和透明度，制造字符尾部拖影效果
                ctx.fillRect(0, 0, W, H); // 绘制半透明的背景，覆盖整个画布
                ctx.font = `700 ${fontSize}px monospace`; // 设置字体样式
                ctx.fillStyle = "#00cc33"; // 设置字体颜色为绿色
                for (let i = 0; i < cols; i++) {
                    // 遍历每一列
                    const char = str[Math.floor(Math.random() * str.length)]; // 从字符集中随机选择一个字符
                    const x = i * fontSize; // 计算字符的 x 坐标
                    const y = drops[i] * fontSize; // 计算字符的 y 坐标
                    ctx.fillText(char, x, y); // 在指定位置绘制字符
                    if (y >= canvas.height && Math.random() > 0.96) {
                        // 如果字符到达画布底部，随机重置下落起始位置
                        drops[i] = 0;
                    }
                    drops[i]+=0.8; // 增加下落位置
                }
            }
            drawMatrix(); // 启动动画

        } else if (effect === 'yigo') {
            // Yigo 粒子效果
            const particles = []; // 存储粒子的数组
            const particleCount = 700; // 粒子数量

            for (let i = 0; i < particleCount; i++) {
                // 初始化每个粒子的位置、半径、颜色等属性
                particles.push({
    x: Math.random() * W, // 粒子的 x 坐标
    y: Math.random() * H, // 粒子的 y 坐标
    radius: Math.random() * 3 + 1, // 粒子的半径
    color: { 
        r: Math.floor(Math.random() * 256), // 随机生成红色值
        g: Math.floor(Math.random() * 256), // 随机生成绿色值
        b: Math.floor(Math.random() * 256)  // 随机生成蓝色值
    },
    phase: 0, // 相位，用于渐变
    opacity: 0 // 初始透明度
});

            }

            function drawYigo() {
                // 动画主循环
                animationId = requestAnimationFrame(drawYigo); // 请求下一帧动画
                ctx.fillStyle = "rgba(0,0,0,0.1)"; // 背景色和透明度，制造拖影效果
                ctx.fillRect(0, 0, W, H); // 绘制半透明背景
                particles.forEach(p => {
                    // 遍历每个粒子
                    if (p.y > 0 && p.y < H && p.x > 0 && p.x < W) {
                        // 更新粒子位置
                        p.x += (p.x - W / 2) / 120;
                        p.y += (p.y - H / 2) / 120;
                        p.phase++;
                        p.opacity = Math.min(1, p.phase / 200); // 逐渐增加透明度
                    } else {
                        // 如果粒子超出边界，则重置其位置
                        const theta = Math.random() * 2 * Math.PI; // 随机方向
                        p.x = W / 2 + 75 * Math.cos(theta) * Math.random(); // 设置新位置
                        p.y = H / 2 + 75 * Math.sin(theta) * Math.random();
                        p.phase = 0; // 重置相位
                        p.opacity = 0; // 重置透明度
                    }
                    ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.opacity})`; // 设置粒子的颜色和透明度
                    ctx.beginPath(); // 开始绘制路径
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); // 绘制粒子
                    ctx.fill(); // 填充粒子
                });
            }
            drawYigo(); // 启动动画

        } else if (effect === 'hexagon') {
            // Hexagon 六边形效果
            const opts = {
                len: 90, // 六边形边长
                count: 150, // 六边形数量
                baseTime: 10, // 基础时间
                addedTime: 10, // 附加时间，用于随机性
                dieChance: 0.05, // 死亡概率
                spawnChance: 1, // 生成概率
                sparkChance: 0.1, // 火花生成概率
                sparkDist: 10, // 火花距离
                sparkSize: 2, // 火花大小
                color: 'hsl(hue,100%,light%)', // 颜色模板，使用 HSL 颜色模式
                baseLight: 50, // 基础亮度
                addedLight: 10, // 附加亮度，用于随机性
                shadowToTimePropMult: 6, // 阴影模糊到时间的比例
                baseLightInputMultiplier: .01, // 基础亮度输入乘数
                addedLightInputMultiplier: .02, // 附加亮度输入乘数
                cx: W / 2, // 画布中心 x 坐标
                cy: H / 2, // 画布中心 y 坐标
                repaintAlpha: 0.04, // 重绘时的透明度
                hueChange: 0.1 // 色调变化量
            };
            let tick = 0; // 计时器
            const lines = []; // 存储线条的数组
            var dieX = W / 2 / opts.len; // 计算死亡边界 x
            var dieY = H / 2 / opts.len; // 计算死亡边界 y
            var baseRad = Math.PI * 2 / 6; // 基础弧度，用于绘制六边形
            ctx.fillStyle = 'black'; // 设置初始画布背景为黑色
            ctx.fillRect(0, 0, W, H); // 绘制初始背景

            function loop() {
                // 动画主循环
                animationId = requestAnimationFrame(loop); // 请求下一帧动画
                ++tick; // 增加计时器
                ctx.globalCompositeOperation = 'source-over'; // 设置组合操作为覆盖
                ctx.shadowBlur = 0; // 去除阴影模糊
                ctx.fillStyle = 'rgba(0,0,0,' + opts.repaintAlpha + ')'; // 设置背景色和透明度
                ctx.fillRect(0, 0, W, H); // 绘制半透明背景
                ctx.globalCompositeOperation = 'lighter'; // 设置组合操作为“变亮”
                if (lines.length < opts.count && Math.random() < opts.spawnChance) lines.push(new Line()); // 生成新的线条
                lines.forEach(function(line) {
                    line.step(); // 更新每条线条
                });
            }

            function Line() {
                // 线条对象构造函数
                this.reset(); // 重置线条状态
            }
            Line.prototype.reset = function() {
                // 重置线条的状态
                this.x = 0;
                this.y = 0;
                this.addedX = 0;
                this.addedY = 0;
                this.rad = 0;
                this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();
                this.color = opts.color.replace('hue', tick * opts.hueChange); // 根据 tick 更新颜色
                this.cumulativeTime = 0;
                this.beginPhase(); // 开始新的阶段
            }
            Line.prototype.beginPhase = function() {
                // 开始新的阶段
                this.x += this.addedX;
                this.y += this.addedY;
                this.time = 0;
                this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0; // 设置目标时间，增加随机性
                this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1); // 随机改变方向
                this.addedX = Math.cos(this.rad); // 计算新增的 x
                this.addedY = Math.sin(this.rad); // 计算新增的 y
                if (Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY) this.reset(); // 判断是否重置
            }
            Line.prototype.step = function() {
                // 更新线条状态
                ++this.time;
                ++this.cumulativeTime;
                if (this.time >= this.targetTime) this.beginPhase(); // 如果达到目标时间，则开始新的阶段
                let prop = this.time / this.targetTime; // 计算进度比例
                let wave = Math.sin(prop * Math.PI / 2); // 使用正弦波计算平滑运动
                let x = this.addedX * wave; // 计算当前 x 位置
                let y = this.addedY * wave; // 计算当前 y 位置
                ctx.shadowBlur = prop * opts.shadowToTimePropMult; // 设置阴影模糊程度
                ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier)); // 更新颜色和阴影
                ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2); // 绘制当前线条
                if (Math.random() < opts.sparkChance) ctx.fillRect(opts.cx + (this.x + x) * opts.len + Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) - opts.sparkSize / 2, opts.cy + (this.y + y) * opts.len + Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) - opts.sparkSize / 2, opts.sparkSize, opts.sparkSize); // 绘制火花
            }
            loop(); // 启动动画

            window.addEventListener('resize', function() {
                // 监听窗口大小变化，重新设置画布和参数
                //W = canvas.width = window.innerWidth;
                H = canvas.height = window.innerHeight;
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, W, H);
                opts.cx = W / 2;
                opts.cy = H / 2;
                dieX = W / 2 / opts.len;
                dieY = H / 2 / opts.len;
            });
        }
    }

    // 停止动画函数
    function stopAnimation() {
        // 取消当前动画帧
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // 导出全局函数以便调用
    window.startCombinedEffect = startCombinedEffect;
    window.stopAnimation = stopAnimation;
})();