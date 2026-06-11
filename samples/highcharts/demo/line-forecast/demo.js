(async () => {
    const json = await fetch(
            'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=64.128288&lon=-21.827774'
        ).then(response => response.json()),
        data = json.properties.timeseries.slice(0, 10).map(el =>
            [
                new Date(el.time).getTime(),
                el.data.instant.details.air_temperature
            ]),
        todayDate = new Date(),
        today = todayDate.getTime() - todayDate.getTimezoneOffset() * 60 * 1000;

    Highcharts.chart('container', {

        title: {
            text: 'Hourly forecast temperatures in Reykjavík, Iceland'
        },

        subtitle: {
            text: 'Dotted line typically signifies prognosis'
        },

        xAxis: {
            type: 'datetime',
            plotLines: [{
                color: '#4840d6',
                width: 2,
                value: today,
                zIndex: 2,
                dashStyle: 'Dash',
                label: {
                    text: 'Current time',
                    rotation: 0,
                    y: 20,
                    style: {
                        color: 'var(--highcharts-neutral-color-60)'
                    }
                }
            }]
        },

        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },

        legend: {
            enabled: false
        },

        tooltip: {
            valueSuffix: '°C'
        },

        series: [{
            name: 'Temperature in Reykjavík',
            data: data,
            zoneAxis: 'x',
            lineWidth: 4,
            marker: {
                lineWidth: 2,
                lineColor: void 0,
                fillColor: 'var(--highcharts-background-color)'
            },
            color: 'light-dark(#5897ff, #fa4fed)',
            zones: [{
                value: today
            }, {
                dashStyle: 'Dot'
            }]
        }]

    });
})();
