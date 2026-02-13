document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const exerciseType = document.getElementById('exercise-type');
    const speedInput = document.getElementById('speed');
    const speedVal = document.getElementById('speed-val');
    const sizeInput = document.getElementById('size');
    const sizeVal = document.getElementById('size-val');
    const durationInput = document.getElementById('duration');

    // Sincronizar displays de valores
    speedInput.addEventListener('input', (e) => {
        speedVal.textContent = e.target.value;
    });

    sizeInput.addEventListener('input', (e) => {
        sizeVal.textContent = e.target.value;
    });

    startBtn.addEventListener('click', () => {
        const type = exerciseType.value;
        const speed = speedInput.value;
        const size = sizeInput.value;
        const duration = durationInput.value;
        const color = document.getElementById('color').value;
        const shape = document.getElementById('shape').value;
        const pattern = document.getElementById('pattern').value;
        const background = document.getElementById('background').value;
        const distractors = document.getElementById('distractors').value;

        // Intentar activar pantalla completa
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log("Error intentando poner pantalla completa:", err);
            });
        }

        // Efecto visual de carga antes de entrar
        startBtn.textContent = "CARGANDO REALIDAD VIRTUAL...";
        startBtn.style.filter = "hue-rotate(90deg)";

        setTimeout(() => {
            const url = `vr.html?type=${type}&speed=${speed}&size=${size}&duration=${duration}&color=${encodeURIComponent(color)}&shape=${shape}&pattern=${pattern}&background=${background}&distractors=${distractors}`;
            window.location.href = url;
        }, 800);
    });

    // Efectos de hover en las tarjetas de estadísticas
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
