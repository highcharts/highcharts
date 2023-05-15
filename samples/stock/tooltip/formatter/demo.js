(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());
    Highcharts.stockChart('container', {
        tooltip: {
            formatter() {
                let s = '<b>' + Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '</b>';

                this.points.forEach(point => {
                    s += '<br/>1 USD = ' + point.y + ' EUR';
                });

                return s;
            }
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
})();