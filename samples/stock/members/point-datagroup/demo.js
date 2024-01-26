(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    const click = e => {
        const point = e.point;
        console.log('dataGroup', point.dataGroup);

        if (point.dataGroup) {
            const raw = data.slice(
                point.dataGroup.start,
                point.dataGroup.start + point.dataGroup.length
            );

            document.getElementById('output').innerHTML = `
            <h4>Raw data points</h4>
            <table class="data-table">
            <tr>
                <th>x</th>
                <td>y</td>
            </tr>` +
            raw.map(p => {
                const date = Highcharts.dateFormat(undefined, p[0]);
                return `<tr>
                    <td>${date}</td>
                    <td>${p[1]}</td>
                </tr>`;
            }).join('') +
            '</table>';
        } else {
            document.getElementById('output').innerHTML = '';
        }
    };

    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            width: 600
        },

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'Click to see raw data points'
        },

        series: [{
            name: 'AAPL Stock Price',
            data,
            dataGrouping: {
                groupPixelWidth: 20
            },
            point: {
                events: {
                    click
                }
            }
        }]
    });
})();