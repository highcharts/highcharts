Grid.grid('matrix', {
    data: {
        columns: {
            a: ['A1', 'A2'],
            b: ['B1', 'B2']
        }
    },
    rendering: {
        table: {
            layout: 'matrix'
        }
    }
}, true).then(function (grid) {
    window.matrixGrid = grid;
});

Grid.grid('cards', {
    data: {
        columns: {
            a: ['A1', 'A2'],
            b: ['B1', 'B2']
        }
    },
    rendering: {
        header: {
            enabled: false
        },
        table: {
            layout: 'cards'
        }
    }
}, true).then(function (grid) {
    window.cardsGrid = grid;
});
