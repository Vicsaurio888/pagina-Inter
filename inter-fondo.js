(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvas = document.getElementById('inter-particulas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'inter-particulas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    var ctx = canvas.getContext('2d');
    var particulas = [];
    var w = 0;
    var h = 0;
    var animId = null;

    var CANTIDAD = 20;
    var ZONA_LATERAL = 0.15;

    function esZonaLateral(x) {
        return x < w * ZONA_LATERAL || x > w * (1 - ZONA_LATERAL);
    }

    function spawn() {
        var izquierda = Math.random() < 0.5;
        var x = izquierda
            ? Math.random() * w * ZONA_LATERAL
            : w - Math.random() * w * ZONA_LATERAL;

        return {
            x: x,
            y: Math.random() * h,
            r: Math.random() * 1.8 + 1,
            vy: (Math.random() - 0.5) * 0.25,
            vx: izquierda ? Math.random() * 0.08 : -Math.random() * 0.08,
            alpha: Math.random() * 0.25 + 0.35
        };
    }

    function crearParticulas() {
        particulas = [];
        var n = Math.min(CANTIDAD, Math.max(12, Math.floor(w / 85)));
        for (var i = 0; i < n; i++) {
            particulas.push(spawn());
        }
    }

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        crearParticulas();
    }

    function dibujar() {
        ctx.clearRect(0, 0, w, h);

        for (var i = 0; i < particulas.length; i++) {
            var p = particulas[i];
            p.y += p.vy;
            p.x += p.vx;

            if (p.y < -15 || p.y > h + 15) {
                particulas[i] = spawn();
                particulas[i].y = p.y < 0 ? h + 8 : -8;
                continue;
            }

            if (!esZonaLateral(p.x)) {
                var izq = p.x < w * 0.5;
                p.x = izq ? w * ZONA_LATERAL * 0.5 : w * (1 - ZONA_LATERAL * 0.5);
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(62, 175, 228, ' + p.alpha + ')';
            ctx.fill();
        }

        animId = requestAnimationFrame(dibujar);
    }

    function iniciar() {
        resize();
        if (animId) cancelAnimationFrame(animId);
        dibujar();
    }

    window.addEventListener('resize', resize);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();

(function () {
    'use strict';

    var UMBRAL_MOVIL = 768;

    function actualizarAlturaNav() {
        var header = document.querySelector('body.inter-site > header');
        if (!header) return;
        document.documentElement.style.setProperty('--altura-nav', header.offsetHeight + 'px');
    }

    function aplicarModoDispositivo() {
        var body = document.body;
        if (!body.classList.contains('inter-site')) return;

        var esMovil = window.innerWidth <= UMBRAL_MOVIL;
        body.classList.toggle('modo-movil', esMovil);
        body.classList.toggle('modo-escritorio', !esMovil);
        actualizarAlturaNav();
    }

    function initSitio() {
        aplicarModoDispositivo();
        window.addEventListener('resize', aplicarModoDispositivo);
        window.addEventListener('orientationchange', aplicarModoDispositivo);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSitio);
    } else {
        initSitio();
    }
})();
