Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'gs-conn',
            type: 'GoogleSheets',
            options: {
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                // eslint-disable-next-line max-len
                googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw',
                beforeParse: data => {
                    // Postfix header items with '*'
                    data.forEach(row => {
                        row[0] += '*';
                    });

                    // Special label from first header item
                    data[0][0] = '-';

                    // Supply Jane with additional pears
                    data[2][3] += 20;

                    // Deprive Joe of his bananas
                    data[3][4] = 0;

                    return data;
                }
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
