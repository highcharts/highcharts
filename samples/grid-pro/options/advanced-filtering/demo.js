const conditions = [{
    columnId: 'age',
    operator: 'greaterThan',
    value: 30
}, {
    logic: 'or',
    conditions: [{
        columnId: 'country',
        operator: 'equals',
        value: 'PL'
    }, {
        columnId: 'country',
        operator: 'equals',
        value: 'NO'
    }]
}];

const grid = Grid.grid('container', {
    data: {
        columns: {
            name: [
                'Anna', 'Bjørn', 'Carlos', 'Daria', 'Erik',
                'Fatima', 'Jan', 'Kari', 'Lena', 'Marek'
            ],
            country: [
                'PL', 'NO', 'ES', 'PL', 'NO',
                'FR', 'PL', 'NO', 'DE', 'PL'
            ],
            age: [19, 34, 28, 45, 22, 31, 17, 52, 26, 38]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    filtering: {
        conditions
    }
});

document.getElementById('logic').addEventListener('change', e => {
    grid.update({
        filtering: {
            logic: e.target.value,
            conditions
        }
    });
});
