const dataTable = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Cost: [11, 13, 12, 14],
        Revenue: [12, 15, 14, 18]
    }
});

const previewTable = () => {
    const columns = dataTable.getColumns(),
        keys = Object.keys(columns);
    let html = '<tr>' + keys
        .reduce((html, key) => {
            html += `<th>${key}</th>`;
            return html;
        }, '') + '</tr>';
    html += new Array((columns[keys[0]]).length)
        .fill(1)
        .reduce((html, _, rowNo) => {
            const row = dataTable.getRowObject(rowNo);
            html += '<tr>';
            Object.keys(row).forEach(key => {
                html += `<td>${row[key]}</td>`;
            });
            html += '</tr>';
            return html;
        }, '');
    document.getElementById('data-table').innerHTML = html;
};

previewTable();

Highcharts.chart('container', {
    dataTable,
    chart: {
        type: 'column'
    },
    title: {
        text: 'Common data table'
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Cost'
        }
    }, {
        dataMapping: {
            y: 'Revenue'
        }
    }]
});


document.getElementById('addrow').addEventListener('click', e => {
    dataTable.setRow({
        Year: 2024,
        Cost: 15,
        Revenue: 20
    });
    previewTable();
    (e.target as HTMLButtonElement).disabled = true;
});

document.getElementById('updaterow').addEventListener('click', () => {
    dataTable.setRow({
        Cost: Math.round(15 * Math.random()),
        Revenue: Math.round(10 * Math.random())
    }, 1);
    previewTable();
});

document.getElementById('deleterow').addEventListener('click', e => {
    dataTable.deleteRows(0);
    (e.target as HTMLButtonElement).disabled = true;
    previewTable();
});

document.getElementById('setcolumn').addEventListener('click', () => {
    dataTable.setColumn(
        'Revenue',
        dataTable.getColumns().Revenue.map(() => Math.round(10 * Math.random()))
    );
    previewTable();
});
