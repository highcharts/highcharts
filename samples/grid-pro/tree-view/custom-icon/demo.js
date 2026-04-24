const customTriangleRight = {
    width: 12,
    height: 12,
    viewBox: '0 0 12 12',
    children: [{
        d: 'M 3 2.25 L 9 6 L 3 9.75 Z'
    }]
};

Grid.grid('container', {
    data: {
        columns: {
            path: ['Alone', 'Root/Child 1', 'Root/Child 2'],
            value: [100, 24, 76],
            id: [1, 2, 3]
        },
        treeView: {
            input: {
                type: 'path'
            }
        },
        idColumn: 'id'
    },
    rendering: {
        icons: {
            chevronRight: customTriangleRight
        }
    }
});
