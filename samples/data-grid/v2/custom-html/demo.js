DataGrid.dataGrid2('container', {
    table: {
        columns: {
            Id: [1, 2, 3],
            Header: ['Loreum ipsum', 'Loreum ipsum', 'Loreum ipsum'],
            Description: ['Loreum ipsum', 'Loreum ipsum', 'Loreum ipsum'],
            List: ['item1, item2', 'item1, item2'],
            Image: [
                'https://www.highcharts.com/samples/graphics/sun.png',
                'https://www.highcharts.com/samples/graphics/sun.png',
                'https://www.highcharts.com/samples/graphics/sun.png'
            ],
            Link: [
                'https://domain.com',
                'https://domain2.com',
                'https://localhost:8080'
            ]
        }
    },
    columns: {
        // Id: {},
        Header: {
            cellFormatter: function () {
                console.log('aaa');
                return '<input type="checkbox" />';
            }
        }
        // Description: {
            
        // },
        // List: {

        // },
        // Image: {

        // },
        // Link: {

        // }
    }
});
