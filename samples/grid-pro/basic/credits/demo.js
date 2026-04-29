const noDataToggle = document.getElementById('no-data-toggle');

const populatedDataTable = new Grid.DataTable({
    columns: {
        product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes'],
        weight: [100, 40, 0.5, 200, 150, 75],
        price: [1.5, 2.53, 5, 4.5, 1.2, 2.1],
        metaData: ['a', 'b', 'c', 'd', 'e', 'f']
    }
});

const emptyDataTable = new Grid.DataTable({
    columns: {}
});

const grid = Grid.grid('container', {
    data: {
        dataTable: populatedDataTable
    },
    credits: {
        enabled: true,
        text: '',
        href: 'https://www.highcharts.com',
        position: 'bottom'
    }
});

noDataToggle.addEventListener('change', event => {
    grid.update({
        data: {
            dataTable: event.target.checked ?
                emptyDataTable :
                populatedDataTable
        }
    });
});
