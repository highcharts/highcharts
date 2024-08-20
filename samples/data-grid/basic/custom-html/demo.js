DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            Id: [1, 2, 3],
            Header: ['Title 1', 'Title 2', 'Title 3'],
            Description: [
                'Loreum ipsum desc 1',
                'Loreum ipsum desc 2',
                'Loreum ipsum desc 3'
            ],
            List: ['item1, item2', 'item3, item4', 'item5, item6'],
            Image: [
                'https://www.highcharts.com/samples/graphics/sun.png',
                'https://www.highcharts.com/samples/graphics/snow.png',
                'https://www.highcharts.com/samples/graphics/sun.png'
            ],
            Link: [
                'https://domain.com',
                'https://domain2.com',
                'https://localhost:8080'
            ]
        }
    },
    defaults: {
        columns: {
            useHTML: true
        }
    },
    columns: {
        Header: {
            cellFormat: '<h3>{value}</h3>'
        },
        List: {
            cellFormatter: function () {
                const items = this.value.split(',');
                let list = '';

                items.forEach(el => {
                    list += '<li>' + el + '</li>';
                });

                return '<ul>' + list + '</ul>';
            }
        },
        Image: {
            cellFormatter: function () {
                return '<img src="' + this.value + '" />';
            }
        },
        Link: {
            cellFormatter: function () {
                return '<a href="' + this.value + '">URL</a>';
            }
        }
    }
});
