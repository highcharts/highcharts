const sorter = (a, b) => {
    const isA40 = a === 40 || a === '40';
    const isB40 = b === 40 || b === '40';

    if (isA40 && !isB40) {
        return -1;
    }
    if (isB40 && !isA40) {
        return 1;
    }
    if (isA40 && isB40) {
        return 0;
    }

    const isNumA = typeof a === 'number';
    const isNumB = typeof b === 'number';

    if (isNumA && isNumB) {
        return a - b;
    }

    return isNumA ? -1 : 1;
};

Grid.grid('container', {
    data: {
        columns: {
            weight: [100, 40, 0.5, 200]
        }
    },
    columnDefaults: {
        sorting: {
            compare: sorter
        }
    },
    columns: [{
        id: 'weight',
        className: 'custom-column-class-name',
        cells: {
            format: '{value:,.1f} kg'
        }
    }]
});
