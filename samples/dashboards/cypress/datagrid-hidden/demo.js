const container = document.getElementById('container');

const dataGrid = DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    }
});

const btn = document.querySelector('#show');

btn.addEventListener('click', () => {
    container.style.display = 'block';
    dataGrid.renderViewport();
});
