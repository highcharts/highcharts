const jsonBtn = document.querySelector('#json'),
    result = document.querySelector('#result');

/**
 * DataGrid init
 */
const dataGrid = DataGrid.dataGrid2('container', {
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    columns: {
        product: {
            editable: true,
            // cellFormatter: function () {
            //     return 'Name: ' + this.value;
            // }
            cellFormat: 'Name: {value}'
        },
        weight: {
            editable: true,
            cellFormat: '{value} kg'
            // cellFormatter: function () {
            //     return 'KG: ' + this.value;
            // }
        },
        metaData: {
            enabled: false
        }
    }
});

/**
 * DataGrid init
 */
jsonBtn.addEventListener('click', () => {
    result.innerHTML = dataGrid.getJSON();
});
