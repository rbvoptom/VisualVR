document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exerciseType = document.getElementById('exercise-type');
    const speedInput = document.getElementById('speed');
    const speedVal = document.getElementById('speed-val');
    const sizeInput = document.getElementById('size');
    const sizeVal = document.getElementById('size-val');
    const durationInput = document.getElementById('duration');

    // Referencias a estadísticas e historial
    const lastPrecisionDisplay = document.getElementById('last-precision');
    const todaySessionsDisplay = document.getElementById('today-sessions');
    const historyList = document.getElementById('history-list');

    // Cargar estadísticas e historial
    function loadStats() {
        const stats = JSON.parse(localStorage.getItem('visualVR_stats') || '{"sessions": 0, "lastPrecision": 0, "history": []}');

        if (todaySessionsDisplay) todaySessionsDisplay.textContent = `${stats.sessions} / 5`;
        if (lastPrecisionDisplay) lastPrecisionDisplay.textContent = stats.lastPrecision > 0 ? `${stats.lastPrecision}%` : '--';

        if (historyList) {
            if (!stats.history || stats.history.length === 0) {
                historyList.innerHTML = '<p class="empty-msg">No hay sesiones registradas</p>';
            } else {
                historyList.innerHTML = stats.history.map(item => `
                    <div class="history-item ${item.complete ? '' : 'incomplete'}">
                        <div class="date">${item.date}</div>
                        <div class="details">
                            <span>${item.type.toUpperCase()}</span>
                            <span>${item.complete ? item.precision + '%' : 'INCOMPLETA'}</span>
                        </div>
                    </div>
                `).reverse().join('');
            }
        }
    }

    loadStats();

    // Sincronizar displays de valores
    if (speedInput) {
        speedInput.addEventListener('input', (e) => {
            speedVal.textContent = e.target.value;
        });
    }

    if (sizeInput) {
        sizeInput.addEventListener('input', (e) => {
            sizeVal.textContent = e.target.value;
        });
    }

    // Botón de Reinicio
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres borrar todo el progreso e historial?')) {
                localStorage.removeItem('visualVR_stats');
                loadStats();
            }
        });
    }

    if (startBtn) {
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

            // Registrar intento de sesión (antes de empezar por si no la termina)
            const stats = JSON.parse(localStorage.getItem('visualVR_stats') || '{"sessions": 0, "lastPrecision": 0, "history": []}');
            const newEntry = {
                date: new Date().toLocaleString(),
                type: type,
                complete: false,
                precision: 0
            };
            stats.history.push(newEntry);
            localStorage.setItem('visualVR_stats', JSON.stringify(stats));

            // Intentar activar pantalla completa
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log("Error intentando poner pantalla completa:", err);
                });
            }

            // Efecto visual de carga
            startBtn.textContent = "CARGANDO REALIDAD VIRTUAL...";
            startBtn.style.filter = "hue-rotate(90deg)";

            setTimeout(() => {
                const url = `vr.html?type=${type}&speed=${speed}&size=${size}&duration=${duration}&color=${encodeURIComponent(color)}&shape=${shape}&pattern=${pattern}&background=${background}&distractors=${distractors}`;
                window.location.href = url;
            }, 800);
        });
    }

    // Efectos de hover
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
