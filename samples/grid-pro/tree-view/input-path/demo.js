const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            path: [
                'Root',
                'Root/Sales',
                'Root/Marketing',
                'Root/Engineering',
                'Root/Sales/EMEA',
                'Root/Sales/APAC',
                'Root/Sales/EMEA/Germany',
                'Root/Sales/EMEA/France',
                'Root/Marketing/Campaigns',
                'Root/Marketing/Analytics',
                'Root/Engineering/Frontend',
                'Root/Engineering/Backend',
                'Root/Engineering/DevOps',
                'Root/Engineering/Frontend/React',
                'Root/Engineering/Frontend/Vue',
                'Root/Engineering/Backend/API',
                'Root/Engineering/Backend/Database',
                'Root/Engineering/DevOps/Infrastructure'
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
            input: {
                type: 'path'
            },
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
    header: ['name', 'value', 'status', 'category', 'id', 'path']
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
