const dg = DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [],
            price: []
        }
    }
});

document.getElementById('load').addEventListener('click', () => {
    // Show the loading indicator
    dg.showLoading('Loading...');

    // Simulate a get request
    setTimeout(() => {
        dg.update({
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            }
        });
    }, 1000);
});
