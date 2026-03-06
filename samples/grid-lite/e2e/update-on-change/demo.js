async function createGrid(containerId, updateOnChange) {
    return await Grid.grid(containerId, {
        data: {
            providerType: 'local',
            columns: {
                product: ['Apples', 'Pears', 'Plums'],
                weight: [100, 40, 0.5]
            },
            updateOnChange
        }
    }, true);
}

function attachUpdateRowsCounter(grid, inputEl) {
    const viewport = grid.viewport;
    const originalUpdateRows = viewport.updateRows.bind(viewport);
    let count = 0;

    viewport.updateRows = async function () {
        count += 1;
        inputEl.value = count.toString();
        return await originalUpdateRows();
    };

    return {
        getCount: () => count,
        reset: () => {
            count = 0;
            inputEl.value = '0';
        }
    };
}

(async () => {
    const gridAuto = await createGrid('container-auto', true);
    const gridManual = await createGrid('container-manual', false);

    const counters = {
        auto: attachUpdateRowsCounter(
            gridAuto,
            document.getElementById('auto-update-count')
        ),
        manual: attachUpdateRowsCounter(
            gridManual,
            document.getElementById('manual-update-count')
        )
    };

    document.getElementById('auto-set-cell').addEventListener('click', () => {
        gridAuto.dataTable.setCell('weight', 0, 123);
    });

    document
        .getElementById('auto-edit-cell')
        .addEventListener('click', async () => {
            await gridAuto.viewport.rows[0].cells[1].editValue(200);
        });

    document
        .getElementById('auto-reset-counter')
        .addEventListener('click', () => {
            counters.auto.reset();
        });

    document.getElementById('manual-set-cell').addEventListener('click', () => {
        gridManual.dataTable.setCell('weight', 0, 321);
    });

    document
        .getElementById('manual-update-rows')
        .addEventListener('click', () => {
            gridManual.viewport.updateRows();
        });

    document.getElementById(
        'manual-reset-counter'
    ).addEventListener('click', () => {
        counters.manual.reset();
    });

})();
