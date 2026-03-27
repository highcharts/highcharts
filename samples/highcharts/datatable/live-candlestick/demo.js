const dataTable = new Highcharts.Data({
    csv: document.getElementById('csv').innerText
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
                y: 'close'
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
        }
    }]
});

// Emulate getting point from backend
function getNewRow(i, lastRow) {
    // Return new row
    if (i === 0 || i % 10 === 0) {
        return {
            x: lastRow.x + 60000,
            open: lastRow.close,
            high: lastRow.close,
            low: lastRow.close,
            close: lastRow.close
        };
    }
    const newClose = Highcharts.correctFloat(
        lastRow.close + Highcharts.correctFloat(Math.random() - 0.5, 2),
        4
    );

    // Modify last row
    lastRow.high = newClose >= lastRow.high ? newClose : lastRow.high;
    lastRow.low = newClose <= lastRow.low ? newClose : lastRow.low;
    lastRow.close = newClose;

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
            lastRow.x !== newRow.x ? lastIndex + 1 : lastIndex
        );
        i++;
    }, 100);
})();
