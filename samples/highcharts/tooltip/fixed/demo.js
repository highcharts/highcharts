(async () => {

    const ohlc = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    const data = ohlc.map(d => [
        d[0], // the date
        d[4] // close
    ]);

    // Create the chart
    const chart = Highcharts.chart('container', {

        chart: {
            zooming: {
                type: 'x'
            }
        },

        title: {
            text: 'Fixed tooltip'
        },

        tooltip: {
            fixed: true
        },

        xAxis: {
            type: 'datetime',
            crosshair: true
        },

        series: [{
            name: 'AAPL',
            data
        }]
    });

    // Update the chart with the options from the form
    document.querySelectorAll('#options-table input, #options-table select')
        .forEach(input => {
            input.addEventListener('change', () => {
                const key = input.id,
                    value = input.type === 'checkbox' ?
                        input.checked :
                        input.type === 'number' ?
                            parseFloat(input.value) :
                            input.value;

                // Convert the dot-notation string to a deep object
                const optionsObject = key.split('.').reverse().reduce(
                    (acc, key, i) => (
                        i === 0 ? { [key]: value } : { [key]: acc }
                    ),
                    {}
                );

                chart.update(optionsObject);
            });
        });

})();
