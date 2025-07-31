window.grid = Grid.grid('container', {
    dataTable: {
        columns: {
            ID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            Name: [
                'John',
                'Michael',
                'Alex',
                'Alex',
                'Tom',
                'Jane',
                'Jane',
                'Chris',
                'Michael',
                'Tom'
            ],
            Department: [
                'HR',
                'Engineering',
                'Sales',
                'Marketing',
                'Finance',
                'HR',
                'Engineering',
                'Sales',
                'Marketing',
                'Finance'
            ]
        }
    },
    pagination: {
        enabled: true,
        itemsPerPage: 6,
        events: {
            beforePageChange: function (pg) {
                document.getElementById('beforePageChange').value =
                    pg.currentPage;
            },
            afterPageChange: function (pg) {
                document.getElementById('afterPageChange').value =
                    pg.currentPage;
            }
        }
    }
});
