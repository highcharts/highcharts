const { correctFloat, Data } = Highcharts;

const dataTable = new Data({
    csv: document.getElementById('csv').innerText,
    parseDate: false
}).getDataTable();

Highcharts.stockChart('container', {
    dataTable,

    chart: {
        animation: false
    },

    lang: {
        locale: 'en-GB'
    },

    title: {
        text: 'Dynamic DataTable in Highcharts Stock'
    },

    xAxis: {
        overscroll: 500000,
        range: 4 * 200000,
        gridLineWidth: 1
    },

    rangeSelector: {
        buttons: [{
            type: 'minute',
            count: 15,
            text: '15m'
        }, {
            type: 'hour',
            count: 1,
            text: '1h'
        }, {
            type: 'all',
            count: 1,
            text: 'All'
        }],
        selected: 1,
        inputEnabled: false
    },

    navigator: {
        series: {
            dataMapping: {
                x: 'Time',
                y: 'Close'
            },
            color: 'var(--highcharts-neutral-color-80)'
        }
    },

    series: [{
        type: 'candlestick',
        color: '#FF7F7F',
        upColor: '#90EE90',
        lastPrice: {
            enabled: true,
            label: {
                enabled: true,
                backgroundColor: '#FF7F7F'
            }
        },
        dataMapping: {
            x: 'Time',
            open: 'Open',
            high: 'High',
            low: 'Low',
            close: 'Close'
        }
    }]
});

// Emulate getting point from backend
const time = Highcharts.charts[0].time;
function getNewRow(i, lastRow) {
    // Return new row
    if (i === 0 || i % 10 === 0) {
        return {
            // Add one minute
            Time: time.dateFormat(
                '%Y-%m-%d %H:%M:%S',
                time.parse(lastRow.Time) + 60000
            ),
            Open: lastRow.Close,
            High: lastRow.Close,
            Low: lastRow.Close,
            Close: lastRow.Close
        };
    }
    const newClose = correctFloat(
        lastRow.Close + correctFloat(Math.random() - 0.5, 2),
        4
    );

    // Modify last row
    lastRow.High = newClose >= lastRow.High ? newClose : lastRow.High;
    lastRow.Low = newClose <= lastRow.Low ? newClose : lastRow.Low;
    lastRow.Close = newClose;

    return lastRow;
}

// Start the interval that adds rows to the data table
(() => {
    let i = 0;
    setInterval(() => {
        const lastIndex = dataTable.rowCount - 1,
            lastRow = dataTable.getRowObject(lastIndex),
            newRow = getNewRow(i, lastRow);

        dataTable.setRow(
            newRow,
            lastRow.Time !== newRow.Time ? lastIndex + 1 : lastIndex
        );
        i++;
    }, 100);
})();
