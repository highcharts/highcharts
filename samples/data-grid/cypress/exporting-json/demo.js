const jsonBtn = document.querySelector('#json'),
    result = document.querySelector('#result');

/**
 * DataGrid init
 */
const dataGrid = DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    columnDefaults: {
        cells: {
            editable: true
        }
    },
    columns: [{
        id: 'metaData',
        enabled: false
    }]
});

/**
 * DataGrid init
 */
jsonBtn.addEventListener('click', () => {
    result.innerHTML = dataGrid.getJSON();
});
