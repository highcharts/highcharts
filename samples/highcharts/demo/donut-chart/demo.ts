Highcharts.chart('container', {
    chart: {
        type: 'pie',
        events: {
            render() {
                // Center the caption based on the center of the pie
                const centerXChart = this.plotWidth / 2,
                    centerXPie = this.series[0].center[0];
                this.caption.update({
                    // Set x offset from chart center
                    x: centerXPie - centerXChart
                });
            }
        }
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: '2023 Norway car registrations'
    },
    subtitle: {
        text: 'Source: <a href="https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport">SSB</a>'
    },
    caption: {
        text: 'Total<br/><strong>2 877 820</strong>',
        align: 'center',
        verticalAlign: 'middle',
        style: {
            color: 'var(--highcharts-neutral-color-100, #000)',
            fontSize: '1.5em'
        },
        y: 40
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Registrations',
        colorByPoint: true,
        innerSize: '75%',
        data: [{
            name: 'EV',
            y: 23.9
        }, {
            name: 'Hybrids',
            y: 12.6
        }, {
            name: 'Diesel',
            y: 37.0
        }, {
            name: 'Petrol',
            y: 26.4
        }],
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 8,
        dataLabels: [{
            enabled: true,
            distance: 20,
            format: '{point.name}'
        }, {
            enabled: true,
            backgroundColor: 'contrast',
            distance: -18,
            format: '{point.percentage:.0f}%',
            style: {
                fontSize: '0.9em'
            }
        }],
        showInLegend: true
    }]
} satisfies Highcharts.Options);
