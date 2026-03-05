Grid.setOptions({
    lang: {
        locale: 'en-US',
        decimalPoint: '|',
        thousandsSep: '_'
    }
});

Grid.grid('container', {
    dataTable: {
        columns: {
            string: ['Apples', 'Pears', 'Plums', 'Bananas'],
            booleans: [true, false, null, false],
            boolNumber: [1, 0, null, 0],
            int: [1, 2, 3, 4],
            float: [1.5, 2.53, 5, 4.5],
            date: [
                Date.UTC(2023, 0, 1),
                Date.UTC(2023, 0, 2),
                null,
                Date.UTC(2023, 0, 4)
            ],
            thousands: [12452.4524, 6612.34444, 1234, 2345.6]
        }
    },
    columns: [{
        id: 'string',
        cells: {
            className: 'highlight_green',
            formatter: function () {
                return '';
            }
        }
    }, {
        id: 'booleans',
        cells: {
            className: 'highlight_green',
            formatter: function () {
                return null;
            }
        }
    }, {
        id: 'boolNumber',
        dataType: 'boolean'
    }, {
        id: 'date',
        dataType: 'datetime',
        header: {
            formatter: function () {
                return null;
            }
        }
    }, {
        id: 'thousands',
        dataType: 'number',
        header: {
            formatter: function () {
                return '';
            }
        }
    }]
});
