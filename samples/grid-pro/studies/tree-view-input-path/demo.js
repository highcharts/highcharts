const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5, 6],
            path: [
                'Root',
                'Root/A',
                'Root/B',
                'Root/A/A.1',
                'Root/A/A.2',
                'Root/B/B.1'
            ],
            name: ['Root', 'A', 'B', 'A.1', 'A.2', 'B.1'],
            value: [100, 20, 30, 5, 15, 10]
        },
        idColumn: 'id',
        treeView: {
            input: {
                type: 'path'
            },
            treeColumn: 'name',
            initiallyExpanded: true
        }
    },
    header: ['name', 'value', 'id', 'path']
});

document.getElementById('tree-view-enabled').addEventListener('change', e => {
    grid.update({
        data: {
            treeView: {
                enabled: e.target.checked
            }
        }
    });
});
