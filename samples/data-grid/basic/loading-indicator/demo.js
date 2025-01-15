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
    dg.showLoading('Loading data...');

    // Simulate a get request
    setTimeout(() => {
        dg.update({
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: Array.from({ length: 4 }, () =>
                        Math.round(Math.random() * 100)
                    ),
                    price: Array.from({ length: 4 }, () =>
                        Math.round(Math.random() * 10)
                    )
                }
            }
        });
        dg.hideLoading();
    }, 2000);
});
