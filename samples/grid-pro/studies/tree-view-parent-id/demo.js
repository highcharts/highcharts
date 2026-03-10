const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5, 6],
            parentId: [null, 1, 1, 2, 2, 3],
            name: ['Root', 'A', 'B', 'A.1', 'A.2', 'B.1'],
            value: [100, 20, 30, 5, 15, 10]
        },
        idColumn: 'id',
        treeView: {
            treeColumn: 'name',
            initiallyExpanded: true
        }
    },
    header: ['name', 'value', 'id', 'parentId']
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
