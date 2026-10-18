document.addEventListener('DOMContentLoaded', () => {
    // Configuración inicial de límites
    const MAX_CREDITS = 22;

    // Referencias del DOM
    const availableTableBody = document.querySelector('.data-table tbody');
    const selectedList = document.querySelector('.selected-list');
    const searchInput = document.querySelector('.search-input');
    const selectTurno = document.querySelector('.select-input');
    const btnConfirm = document.querySelector('.checkout-summary .btn-primary');

    // Elementos de resumen / métricas
    const totalCreditsStat = document.querySelectorAll('.card-info h3')[1]; // Créditos seleccionados
    const summarySelectedCount = document.querySelectorAll('.summary-row strong')[0];
    const summaryTotalCredits = document.querySelectorAll('.summary-row strong')[1];

    // Estado de la aplicación
    let selectedCourses = [
        { code: 'ASI902', name: 'Arquitectura Empresarial', credits: 4 },
        { code: 'ASI905', name: 'Desarrollo Web Avanzado', credits: 4 },
        { code: 'ASI906', name: 'Seguridad de la Información', credits: 4 }
    ];

    // 1. Renderizar cursos seleccionados y actualizar interfaz
    function updateSelectedUI() {
        // Limpiar lista del DOM
        selectedList.innerHTML = '';

        let totalCredits = 0;

        selectedCourses.forEach((course) => {
            totalCredits += course.credits;

            const li = document.createElement('li');
            li.className = 'selected-item';
            li.innerHTML = `
                <div class="course-details">
                    <strong>${course.name}</strong>
                    <span>${course.code} • ${course.credits} Créditos</span>
                </div>
                <button class="btn-danger-icon" title="Quitar curso" data-code="${course.code}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            selectedList.appendChild(li);
        });

        // Actualizar métricas del resumen
        totalCreditsStat.textContent = totalCredits;
        summarySelectedCount.textContent = selectedCourses.length;
        summaryTotalCredits.textContent = `${totalCredits} / ${MAX_CREDITS}`;

        // Actualizar estado de botones en la tabla disponible
        updateTableButtons();
    }

    // 2. Sincronizar el estado de los botones "Agregar / Inscrito" en la tabla
    function updateTableButtons() {
        const rows = availableTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const code = row.children[0].textContent.trim();
            const btn = row.querySelector('.btn');
            if (!btn) return;

            const isAlreadyAdded = selectedCourses.some(c => c.code === code);

            if (isAlreadyAdded) {
                btn.className = 'btn btn-outline';
                btn.disabled = true;
                btn.style.opacity = '0.6';
                btn.innerHTML = 'Inscrito';
            } else {
                btn.className = 'btn btn-primary';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar';
            }
        });
    }

    // 3. Evento: Agregar curso desde la tabla
    availableTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || btn.disabled) return;

        const row = btn.closest('tr');
        const code = row.children[0].textContent.trim();
        const fullTitleText = row.children[1].childNodes[0].textContent.trim();
        const credits = parseInt(row.children[2].textContent.trim(), 10);

        // Calcular créditos actuales
        const currentCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);

        if (currentCredits + credits > MAX_CREDITS) {
            alert(`No puedes superar el límite de ${MAX_CREDITS} créditos permitidos.`);
            return;
        }

        // Agregar al arreglo de seleccionados
        selectedCourses.push({
            code: code,
            name: fullTitleText,
            credits: credits
        });

        updateSelectedUI();
    });

    // 4. Evento: Quitar curso del panel lateral
    selectedList.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-danger-icon');
        if (!btn) return;

        const codeToRemove = btn.getAttribute('data-code');
        selectedCourses = selectedCourses.filter(c => c.code !== codeToRemove);

        updateSelectedUI();
    });

    // 5. Filtro de Búsqueda (por Código o Nombre de Asignatura)
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const rows = availableTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const code = row.children[0].textContent.toLowerCase();
            const courseName = row.children[1].textContent.toLowerCase();

            if (code.includes(term) || courseName.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // 6. Confirmación de Matrícula
    btnConfirm.addEventListener('click', () => {

        if (selectedCourses.length === 0) {
            alert('Debes seleccionar al menos un curso para confirmar tu matrícula.');
            return;
        }

        const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);

        // Nueva validación
        if (totalCredits < 12) {
            alert('Debes registrar al menos 12 créditos para confirmar tu matrícula.');
            return;
        }

        const confirmation = confirm(
            `¿Deseas registrar oficialmente tu matrícula con ${selectedCourses.length} cursos (${totalCredits} créditos)?`
        );

        if (confirmation) {
            alert('¡Matrícula confirmada con éxito!');
        }
    });

    // Inicializar la interfaz con los datos por defecto
    updateSelectedUI();
});