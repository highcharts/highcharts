Highcharts.chart('container', {

    chart: {
        style: {
            fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'
        }
    },

    palette: {
        colorScheme: 'dark',
        colors: [
            '#fb7185', '#fbbf24', '#f97316',
            '#38bdf8', '#34d399', '#a78bfa'
        ],
        dark: {
            backgroundColor: '#0c1524'
        }
    },

    title: {
        text: 'Nordic electricity exchange',
        style: {
            color: '#e2e8f0',
            fontSize: '1.35rem',
            fontWeight: '600'
        }
    },

    subtitle: {
        text: 'Bidirectional cross-border flows (GWh), Norway and neighbours',
        style: {
            color: '#94a3b8',
            fontSize: '0.9rem'
        }
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.from} to {point.to}: ' +
                '{point.weight} GWh. ' +
                '{#if point.weightTo}{point.to} to {point.from}: ' +
                '{point.weightTo} GWh.{/if}'
        }
    },

    tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderColor: '#334155',
        borderRadius: 8,
        style: {
            color: '#f1f5f9'
        },
        headerFormat: '',
        pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: <b>' +
            '{#if (ge point.weight 1000)}' +
            '{(divide point.weight 1000):.2f} TWh' +
            '{else}{point.weight:,.0f} GWh{/if}</b><br/>' +
            '{#if point.weightTo}{point.toNode.name} \u2192 ' +
            '{point.fromNode.name}: <b>' +
            '{#if (ge point.weightTo 1000)}' +
            '{(divide point.weightTo 1000):.2f} TWh' +
            '{else}{point.weightTo:,.0f} GWh{/if}</b><br/>{/if}',
        nodeFormat: '<b>{point.name}</b><br/>' +
            'Import: <b>{#if (ge point.sumTo 1000)}' +
            '{(divide point.sumTo 1000):.2f} TWh' +
            '{else}{point.sumTo:,.0f} GWh{/if}</b><br/>' +
            'Export: <b>{#if (ge point.sum 1000)}' +
            '{(divide point.sum 1000):.2f} TWh' +
            '{else}{point.sum:,.0f} GWh{/if}</b>'
    },

    series: [{
        keys: ['from', 'to', 'weight', 'weightTo'],
        data: [
            ['Germany', 'Denmark', 512, 5399],
            ['Germany', 'Netherlands', 3066, 3772],
            ['Germany', 'Norway', 1102, 5954],
            ['Germany', 'Sweden', 109, 881],
            ['Denmark', 'Netherlands', 912, 1318],
            ['Denmark', 'Norway', 1397, 1381],
            ['Denmark', 'Sweden', 731, 3377],
            ['Denmark', 'UK', 1882, 1049],
            ['Netherlands', 'Norway', 583, 487],
            ['Netherlands', 'UK', 1666, 261],
            ['Norway', 'Sweden', 1296, 3211],
            ['Norway', 'UK', 1766, 1201]
        ],
        type: 'dependencywheel',
        name: 'Electricity flows',
        linkOpacity: 0.42,
        fillOpacity: 0.75,
        borderWidth: 0,
        borderRadius: '30%',
        nodes: [
            {
                id: 'Norway',
                dataLabels: {
                    style: {
                        fontWeight: '700',
                        fontSize: '0.95rem'
                    }
                }
            }
        ],
        dataLabels: {
            enabled: true,
            color: '#f8fafc',
            style: {
                fontSize: '0.8rem',
                fontWeight: '500',
                textOutline: '2px rgba(12, 21, 36, 0.85)'
            },
            textPath: {
                enabled: false
            },
            distance: 16
        },
        size: '94%'
    }]

});
