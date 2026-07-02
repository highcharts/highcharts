const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            parentId: [
                null, 1, 1, 1, 2, 2, 5, 5, 3,
                3, 4, 4, 4, 11, 11, 12, 12, 13
            ],
            name: [
                'Root', 'Sales', 'Marketing', 'Engineering',
                'EMEA', 'APAC', 'Germany', 'France',
                'Campaigns', 'Analytics',
                'Frontend', 'Backend', 'DevOps',
                'React', 'Vue', 'API', 'Database', 'Infrastructure'
            ],
            value: [
                1000, 350, 280, 370, 180, 170, 90, 90, 140,
                140, 120, 130, 120, 60, 60, 70, 60, 60
            ],
            status: [
                'Active', 'Active', 'Archived', 'Active',
                'Active', 'Active', 'Active', 'Draft',
                'Active', 'Archived',
                'Active', 'Active', 'Active',
                'Active', 'Draft', 'Active', 'Active', 'Archived'
            ],
            category: [
                'Organization', 'Department', 'Department', 'Department',
                'Region', 'Region', 'Country', 'Country',
                'Team', 'Team',
                'Team', 'Team', 'Team',
                'Project', 'Project', 'Project', 'Project', 'Project'
            ]
        },
        idColumn: 'id',
        treeView: {
            treeColumn: 'name',
            expandedRowIds: 'all'
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    },
    header: ['name', 'value', 'status', 'category', 'id', 'parentId']
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

document.getElementById('expand-all').addEventListener('click', () => {
    grid.treeView?.expandAll();
});

document.getElementById('collapse-all').addEventListener('click', () => {
    grid.treeView?.collapseAll();
});
