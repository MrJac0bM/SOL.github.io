document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const maxIntensityRCell = document.getElementById('maxIntensityR');
    const maxRelativeIntensityCell = document.getElementById('maxRelativeIntensity');

    // Calcular Intensidad R y normalizar el valor más alto de R a 10
    calculateBtn.addEventListener('click', function() {
        const rows = document.querySelectorAll('#dataTable tbody tr');
        const totalR = Array(7).fill(0);  // Sumar intensidades R
        let maxRValue = 0;  // Almacenar el valor máximo de la fila de "Total Intensidad R"
        let maxRelativeIntensity = 0; // Almacenar el valor máximo de la Intensidad Relativa

        // Iterar sobre cada fila
        rows.forEach(row => {
            const priority = parseInt(row.querySelector('.priority').value) || 0;
            const values = row.querySelectorAll('.value');
            const intensidadCells = row.querySelectorAll('.intensidadR');

            // Iterar sobre las celdas de valores de cada fila
            values.forEach((cell, index) => {
                const originalValue = parseInt(cell.value) || 0;
                const intensidadR = priority * originalValue;
                intensidadCells[index].textContent = intensidadR;

                // Sumar el valor de intensidad R al total de la columna correspondiente
                totalR[index] += intensidadR;
            });
        });

        // Encontrar el valor máximo en la fila de "Total Intensidad R"
        maxRValue = Math.max(...totalR);

        // Insertar las sumas en la fila de "Total Intensidad R"
        const totalCells = document.querySelectorAll('.totalR');
        totalR.forEach((sum, index) => {
            totalCells[index].textContent = sum;  // Mostrar las sumas
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

        // Celdas vacías para la prioridad y los espacios entre las columnas
        let emptyCell = document.createElement('td');
        relativeRow.appendChild(emptyCell);

        // Calcular y agregar las celdas con la intensidad relativa
        totalR.forEach((sum, index) => {
            let relativeCell = document.createElement('td');
            const relativeIntensity = maxRValue > 0 ? (10 * sum) / maxRValue : 0;  // Normalizar con el máximo de R
            relativeCell.textContent = relativeIntensity.toFixed(2);  // Mostrar con 2 decimales

            // Actualizar el valor máximo de Intensidad Relativa
            if (relativeIntensity > maxRelativeIntensity) {
                maxRelativeIntensity = relativeIntensity;
            }

            relativeRow.appendChild(relativeCell);

            // Agregar una celda vacía después de cada intensidad relativa
            let emptySpace = document.createElement('td');
            relativeRow.appendChild(emptySpace);
        });

        // Agregar la fila de "Intensidad Relativa" al tfoot
        tfoot.appendChild(relativeRow);

        // Actualizar la tabla de valores máximos
        maxIntensityRCell.textContent = maxRValue;
        maxRelativeIntensityCell.textContent = maxRelativeIntensity.toFixed(2);

        resultContainer.textContent = 'Intensidad Relativa calculada y agregada. Valores máximos actualizados.';
    });
});
