document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const maxIntensityRCell = document.getElementById('maxIntensityR');
    const maxRelativeIntensityCell = document.getElementById('maxRelativeIntensity');

    // Calcular Intensidad R y normalizar el valor más alto de R a 10
    calculateBtn.addEventListener('click', function() {
        const rows = document.querySelectorAll('#dataTable tbody tr');

        // Contar el número de columnas de `.value` en la primera fila
        const columnCount = rows[0].querySelectorAll('.value').length;
        
        const totalR = Array(columnCount).fill(0);  // Inicializar total de intensidades R por columna
        let maxRValue = 0;
        let maxRelativeIntensity = 0;

        // Iterar sobre cada fila
        rows.forEach(row => {
            const priority = parseInt(row.querySelector('.priority').value) || 0;  // Convertir prioridad a número o asignar 0
            const values = row.querySelectorAll('.value');
            const intensidadCells = row.querySelectorAll('.intensidadR');

            // Iterar sobre las celdas de valores de cada fila
            values.forEach((cell, index) => {
                const originalValue = parseInt(cell.value) || 0;  // Convertir valor a número o asignar 0
                const intensidadR = priority * originalValue;
                intensidadCells[index].textContent = isNaN(intensidadR) ? 0 : intensidadR;  // Evitar NaN

                // Sumar el valor de intensidad R al total de la columna correspondiente
                totalR[index] += intensidadR;
            });
        });

        // Encontrar el valor máximo en la fila de "Total Intensidad R"
        const totalCells = document.querySelectorAll('.totalR');
        totalR.forEach((sum, index) => {
            totalCells[index].textContent = isNaN(sum) ? 0 : sum;
            if (sum > maxRValue) maxRValue = sum;  // Actualizar el valor máximo de R
        });

        // Crear una nueva fila para "Intensidad Relativa" justo debajo de la fila de sumas
        let tfoot = document.querySelector('tfoot');
        let relativeRow = document.getElementById('relativeRow');

        // Si la fila ya existe, la eliminamos antes de agregar una nueva
        if (relativeRow) {
            relativeRow.remove();
        }

        // Crear la nueva fila para "Intensidad Relativa"
        relativeRow = document.createElement('tr');
        relativeRow.id = 'relativeRow';

        // Primera celda: Nombre de la fila
        let firstCell = document.createElement('td');
        firstCell.textContent = 'Intensidad Relativa';
        relativeRow.appendChild(firstCell);

        // Celda vacía para la prioridad
        let emptyCell = document.createElement('td');
        relativeRow.appendChild(emptyCell);

        // Calcular y agregar las celdas con la intensidad relativa para cada columna
        totalR.forEach((sum, index) => {
            let relativeCell = document.createElement('td');
            const relativeIntensity = maxRValue > 0 ? (sum / maxRValue) * 10 : 0;  // Escalar a un máximo de 10
            relativeCell.textContent = isNaN(relativeIntensity) ? 0 : relativeIntensity.toFixed(2);  // Mostrar con 2 decimales

            // Actualizar el valor máximo de Intensidad Relativa
            if (relativeIntensity > maxRelativeIntensity) {
                maxRelativeIntensity = relativeIntensity;
            }

            relativeRow.appendChild(relativeCell);

            // Agregar una celda vacía después de cada intensidad relativa para el espaciado
            let emptySpace = document.createElement('td');
            relativeRow.appendChild(emptySpace);
        });

        // Agregar la fila de "Intensidad Relativa" al tfoot
        tfoot.appendChild(relativeRow);

        // Actualizar la tabla de valores máximos
        maxIntensityRCell.textContent = maxRValue;
        maxRelativeIntensityCell.textContent = maxRelativeIntensity.toFixed(2);

        // Mensaje de confirmación
        resultContainer.textContent = 'Intensidad Relativa calculada y agregada. Valores máximos actualizados.';
    });
});
