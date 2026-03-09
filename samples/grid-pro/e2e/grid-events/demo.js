Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    },
    events: {
        beforeLoad: function () {
            document.getElementById('beforeLoad').value = 'beforeLoad';
        },
        afterLoad: function () {
            document.getElementById('afterLoad').value = 'afterLoad';
        },
        beforeUpdate: function (e) {
            if (e.scope === 'grid') {
                document.getElementById('beforeUpdate').value = 'beforeUpdate';
            } else if (e.scope === 'column') {
                document.getElementById('beforeUpdateColumn').value =
                    'beforeUpdateColumn';
            }
        },
        afterUpdate: function (e) {
            if (e.scope === 'grid') {
                document.getElementById('afterUpdate').value = 'afterUpdate';
            } else if (e.scope === 'column') {
                document.getElementById('afterUpdateColumn').value =
                    'afterUpdateColumn';
            }
        },
        beforeRedraw: function () {
            document.getElementById('beforeRedraw').value = 'beforeRedraw';
        },
        afterRedraw: function () {
            document.getElementById('afterRedraw').value = 'afterRedraw';
        }
    }
}, true).then(async grid => {
    await grid.update({
        columns: [{
            id: 'price',
            sorting: {
                order: 'desc'
            }
        }]
    });

    await grid.viewport.getColumn('weight').update({
        filtering: {
            condition: 'greaterThan',
            value: 50
        }
    });
});
