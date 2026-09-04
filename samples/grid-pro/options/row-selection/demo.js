const output = document.getElementById('selected');

function renderSelection(rowIds) {
    output.textContent = rowIds.length ? rowIds.join(', ') : '(none)';
}

Grid.grid('container', {
    data: {
        idColumn: 'id',
        columns: {
            id: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'],
            name: [
                'Northwind Systems',
                'Bluefin Group',
                'Summit Outfitters',
                'Nordic Manufacturing',
                'Luma Foods',
                'Mercury Sports',
                'Pacific Logistics',
                'Harbor Retail'
            ],
            owner: [
                'Anne', 'Luis', 'Mia', 'Ola',
                'Vera', 'Tom', 'Kenji', 'Sara'
            ],
            revenue: [128000, 98000, 74000, 112000, 68000, 54000, 88000, 62000]
        }
    },
    columns: [{
        id: 'id',
        enabled: false
    }, {
        id: 'revenue',
        cells: {
            format: '{value:,.0f}'
        }
    }],
    rowSelection: {
        enabled: true,
        mode: 'multiple',
        trigger: 'both',
        clickBehavior: 'toggle',
        checkbox: {
            enabled: true
        }
    },
    events: {
        afterRowSelectionChange: function (e) {
            renderSelection(e.selectedRowIds);
        }
    }
}, true).then(grid => {
    window.grid = grid;

    const controls = {
        mode: 'mode',
        trigger: 'trigger',
        clickBehavior: 'click-behavior'
    };

    Object.entries(controls).forEach(([option, id]) => {
        document.getElementById(id).addEventListener('change', e => {
            grid.update({
                rowSelection: { [option]: e.target.value }
            });
        });
    });

    document.getElementById('checkbox-column')
        .addEventListener('change', e => {
            const value = e.target.value;

            grid.update({
                rowSelection: {
                    checkbox: {
                        enabled: value !== 'none',
                        columnId: value === 'name' ? 'name' : undefined
                    }
                }
            });
        });

    document.getElementById('clear').addEventListener('click', () => {
        grid.rowSelection.clear();
        renderSelection(grid.rowSelection.getSelectedRowIds());
    });
});
