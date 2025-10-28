Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    events: {
        beforeLoad: function () {
            document.getElementById('beforeLoad').value = 'beforeLoad';
        },
        afterLoad: function () {
            document.getElementById('afterLoad').value = 'afterLoad';
        }
    }
});
