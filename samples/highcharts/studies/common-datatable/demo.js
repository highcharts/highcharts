const dataTable = new Highcharts.DataTableCore({
    columns: {
        year: [2020, 2021, 2022, 2023],
        cost: [11, 13, 12, 14],
        revenue: [12, 15, 14, 18]
    }
});

const previewTable = () => {
    let html = '<tr>' + Object.keys(dataTable.columns).reduce((html, key) => {
        html += `<th>${key}</th>`;
        return html;
    }, '') + '</tr>';
    html += new Array(dataTable.rowCount)
        .fill(1)
        .reduce((html, _, rowNo) => {
            const row = dataTable.getRow(rowNo);
            html += '<tr>';
            Object.keys(row).forEach(key => {
                html += `<td>${row[key]}</td>`;
            });
            html += '</tr>';
            return html;
        }, '');
    document.getElementById('data-table').innerHTML = html;
};


(({ addEvent, DataTableCore, Series, wrap }) => {

    let chartRedrawTimer;

    wrap(Series.prototype, 'init', function (proceed, chart, options) {
        const dataTable = chart.options.dataTable;

        const getTableSpecificColumns = () => [
            'x',
            ...(this.pointArrayMap || ['y'])
        ].reduce((acc, key) => {
            const assignment = options.columnAssignment.find(
                assignment => assignment.key === key
            );
            acc[key] = dataTable.getColumn(
                assignment?.columnName || key
            );
            return acc;
        }, {});

        if (dataTable) {

            // Create a new DataTable for each series. This is the simplest way
            // to handle aliases, and doesn't come with a memory cost if we copy
            // the columns by reference.
            // @todo Copy the columns by reference.
            this.table = new DataTableCore({
                columns: getTableSpecificColumns()
            });

            addEvent(this.table, 'afterSetColumns', () => {
                this.isDirtyData = true;
                clearTimeout(chartRedrawTimer);
                setTimeout(() => chart.redraw(), 0);
            });

            addEvent(dataTable, 'afterSetRows', () => {
                this.table.setColumns(getTableSpecificColumns());
                previewTable();
            });
        }

        proceed.apply(this, [].slice.call(arguments, 1));
    });

    wrap(Series.prototype, 'setData', function (
        proceed,
        data,
        redraw,
        animation,
        updatePoints
    ) {
        if (this.chart.options.dataTable) {
            return;
        }
        proceed.call(this, data, redraw, animation, updatePoints);
    });
})(Highcharts);

previewTable();

Highcharts.chart('container', {
    dataTable,
    chart: {
        type: 'column'
    },
    title: {
        text: 'Common data table'
    },
    series: [{
        name: 'Cost',
        columnAssignment: [{
            key: 'x',
            columnName: 'year'
        }, {
            key: 'y',
            columnName: 'cost'
        }]
    }, {
        name: 'Revenue',
        columnAssignment: [{
            key: 'x',
            columnName: 'year'
        }, {
            key: 'y',
            columnName: 'revenue'
        }]
    }]
});

/*
document.getElementById('updaterow').addEventListener('click', e => {
    dataTable.setRow({
        year: 2021,
        cost: Math.round(15 * Math.random()),
        revenue: Math.round(10 * Math.random())
    }, 1);
});
*/

document.getElementById('addrow').addEventListener('click', e => {
    dataTable.setRow({
        year: 2024,
        cost: 15,
        revenue: 20
    });
    e.target.disabled = true;
});
