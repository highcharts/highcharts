const grid = Grid.grid('container', {
    data: {
        columns: {
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
        treeView: {
            input: {
                type: 'path'
            }
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    },
    header: ['path', 'value', 'status', 'category']
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
