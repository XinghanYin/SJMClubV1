(function() {
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.style.cssText = "position: fixed; top: 0; left: 0; z-index: 2;";
    
    var w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        fontSize = 16,
        cols = Math.floor(w / fontSize),
        drops = new Array(cols).fill(0),
        str = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890@#$%^&*()";
    
    var ctx = canvas.getContext('2d');

    function draw() {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";
        
        for (let i = 0; i < cols; i++) {
            const char = str[Math.floor(Math.random() * str.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            ctx.fillText(char, x, y);
            
            if (y > h && Math.random() > 0.99) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 33);

    window.addEventListener('resize', function() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cols = Math.floor(w / fontSize);
        drops = new Array(cols).fill(0);
    });
})();