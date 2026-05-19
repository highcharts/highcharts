const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5, 6, 7, 8],
            path: [
                'Company',
                'CompanySales',
                'CompanyMarketing',
                'CompanyEngineering',
                'CompanySalesEMEA',
                'CompanySalesAPAC',
                'CompanyEngineeringFrontend',
                'CompanyEngineeringBackend'
            ],
            name: [
                'Company',
                'Sales',
                'Marketing',
                'Engineering',
                'EMEA',
                'APAC',
                'Frontend',
                'Backend'
            ],
            manager: [
                'Executive Board',
                'Lena',
                'Chris',
                'Alex',
                'Marta',
                'Kenji',
                'Pat',
                'Jordan'
            ],
            budget: [
                1000,
                360,
                240,
                400,
                170,
                190,
                210,
                190
            ]
        },
        idColumn: 'id',
        treeView: {
            input: {
                type: 'path',
                separator: /[A-Z]+(?![a-z])|[A-Z][a-z]*/
            },
            treeColumn: 'name',
            expandedRowIds: 'all'
        }
    },
    header: ['name', 'manager', 'budget', 'path']
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
