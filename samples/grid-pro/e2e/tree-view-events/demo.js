const beforeToggleInput = document.getElementById('beforeTreeRowToggle');
const afterToggleInput = document.getElementById('afterTreeRowToggle');
const preventToggleInput = document.getElementById('preventToggle');

const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5],
            parentId: [null, 1, 1, 2, 2],
            name: ['Root', 'Sales', 'Marketing', 'EMEA', 'APAC'],
            budget: [1000, 600, 400, 350, 250]
        },
        idColumn: 'id',
        treeView: {
            treeColumn: 'name'
        }
    },
    header: ['name', 'budget'],
    events: {
        beforeTreeRowToggle: function (e) {
            beforeToggleInput.value = `${e.rowId}:${e.expanded}`;

            if (preventToggleInput.checked) {
                e.preventDefault();
            }
        },
        afterTreeRowToggle: function (e) {
            afterToggleInput.value = `${e.rowId}:${e.expanded}`;
        }
    }
});

window.grid = grid;
