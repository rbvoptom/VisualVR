document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exerciseType = document.getElementById('exercise-type');
    const speedInput = document.getElementById('speed');
    const sizeInput = document.getElementById('size');
    const speedVal = document.getElementById('speed-val');
    const sizeVal = document.getElementById('size-val');

    // Referencias a estadísticas
    const lastPrecisionDisplay = document.getElementById('last-precision');
    const todaySessionsDisplay = document.getElementById('today-sessions');
    const historyList = document.getElementById('history-list');

    function loadStats() {
        let stats;
        try {
            stats = JSON.parse(localStorage.getItem('visualVR_stats'));
            if (!stats || !stats.history) throw new Error();
        } catch (e) {
            stats = { sessions: 0, lastPrecision: 0, history: [] };
        }

        if (todaySessionsDisplay) todaySessionsDisplay.textContent = `${stats.sessions} / 5`;
        if (lastPrecisionDisplay) lastPrecisionDisplay.textContent = stats.lastPrecision > 0 ? `${stats.lastPrecision}%` : '--';

        if (historyList) {
            if (stats.history.length === 0) {
                historyList.innerHTML = '<p class="empty-msg">No hay sesiones registradas</p>';
            } else {
                // Ordenamos por fecha más reciente
                const sortedHistory = [...stats.history].reverse().slice(0, 10);
                historyList.innerHTML = sortedHistory.map(item => `
                    <div class="history-item ${item.complete ? '' : 'incomplete'}">
                        <div class="date">${item.date}</div>
                        <div class="details">
                            <span>${item.type.toUpperCase()}</span>
                            <span>${item.complete ? item.precision + '%' : 'INCOMPLETA'}</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    loadStats();

    // Sincronización de sliders
    if (speedInput) speedInput.addEventListener('input', (e) => speedVal.textContent = e.target.value);
    if (sizeInput) sizeInput.addEventListener('input', (e) => sizeVal.textContent = e.target.value);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres borrar todo el progreso?')) {
                localStorage.removeItem('visualVR_stats');
                loadStats();
            }
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const type = exerciseType.value;
            const stats = JSON.parse(localStorage.getItem('visualVR_stats') || '{"sessions": 0, "lastPrecision": 0, "history": []}');

            // Si por alguna razón los datos antiguos no tenían historial, lo creamos
            if (!stats.history) stats.history = [];

            // Registrar intento
            stats.history.push({
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
                type: type,
                complete: false,
                precision: 0
            });
            localStorage.setItem('visualVR_stats', JSON.stringify(stats));

            // Feedback visual
            startBtn.textContent = "CARGANDO VR...";

            setTimeout(() => {
                const params = new URLSearchParams({
                    type: type,
                    speed: speedInput.value,
                    size: sizeInput.value,
                    duration: document.getElementById('duration').value,
                    color: document.getElementById('color').value,
                    shape: document.getElementById('shape').value,
                    pattern: document.getElementById('pattern').value,
                    background: document.getElementById('background').value,
                    distractors: document.getElementById('distractors').value
                });
                window.location.href = `vr.html?${params.toString()}`;
            }, 500);
        });
    }
});
