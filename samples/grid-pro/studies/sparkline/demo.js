const numberOfRows = 10000;

Grid.grid('container', {
    dataTable: {
        columns: {
            a: Array.from({ length: numberOfRows }, (_, i) => `A${i}`),
            b: Array.from({ length: numberOfRows }, (_, i) => `B${i}`),
            c: Array.from({ length: numberOfRows }, (_, i) => `C${i}`),
            d: Array.from({ length: numberOfRows }, () =>
                Array.from({
                    length: 10
                }, () => Math.round(Math.random() * 100))
            )
        }
    },
    rendering: {
        rows: {
            strictHeights: true
        }
    },
    columns: [{
        id: 'd',
        cells: {
            renderer: {
                type: 'sparkline'
            }
        }
    }]
});
