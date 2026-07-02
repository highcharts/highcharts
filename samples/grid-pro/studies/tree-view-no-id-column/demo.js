const grid = Grid.grid('container', {
    data: {
        columns: {
            parentId: [null, 0, 0, 1, 1, 4, 4, 2, 2],
            name: [
                'Root',
                'Sales',
                'Marketing',
                'EMEA',
                'APAC',
                'Germany',
                'France',
                'Campaigns',
                'Analytics'
            ],
            budget: [1200, 430, 370, 220, 210, 110, 110, 180, 190],
            sortKey: ['Z', 'B', 'A', 'D', 'C', 'F', 'E', 'H', 'G'],
            status: [
                'Active',
                'Active',
                'Active',
                'Active',
                'Draft',
                'Active',
                'Draft',
                'Active',
                'Archived'
            ]
        },
        treeView: {
            enabled: true,
            treeColumn: 'name',
            expandedRowIds: 'all'
        }
    },
    columns: [{
        id: 'sortKey',
        header: {
            format: 'Sort key'
        },
        sorting: {
            order: 'asc'
        }
    }],
    header: ['name', 'budget', 'status', 'sortKey', 'parentId']
});

document.getElementById('expand-all').addEventListener('click', () => {
    grid.treeView?.expandAll();
});

document.getElementById('collapse-all').addEventListener('click', () => {
    grid.treeView?.collapseAll();
});

window.grid = grid;
window.getVisibleTreeRowIds = function () {
    return Array.from(document.querySelectorAll('tbody .hcg-row')).map(
        row => row.getAttribute('data-row-id')
    );
};
