Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'gs-conn',
            type: 'GoogleSheets',
            options: {
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                // eslint-disable-next-line max-len
                googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw',
                firstRowAsNames: true
            },
            beforeParse: data => {
                data.forEach(row => {
                    // row.age = row.age + 10;
                    console.log(row);
                });
                return data;
            }
        }]
    },
    components: [
        {
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'gs-conn'
            },
            type: 'DataGrid',
            title: 'Google Sheets Data',
            dataGridOptions: {
                editable: false
            }
        }
    ]
});
