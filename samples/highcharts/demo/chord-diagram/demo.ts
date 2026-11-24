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
        }
    },

    series: [{
        data: [{
            from: 'Germany',
            to: 'Denmark',
            weight: 512,
            weightTo: 5399
        }, {
            from: 'Germany',
            to: 'Netherlands',
            weight: 3066,
            weightTo: 3772
        }, {
            from: 'Germany',
            to: 'Norway',
            weight: 1102,
            weightTo: 5954
        }, {
            from: 'Germany',
            to: 'Sweden',
            weight: 109,
            weightTo: 881
        }, {
            from: 'Denmark',
            to: 'Netherlands',
            weight: 912,
            weightTo: 1318
        }, {
            from: 'Denmark',
            to: 'Norway',
            weight: 1397,
            weightTo: 1381
        }, {
            from: 'Denmark',
            to: 'Sweden',
            weight: 731,
            weightTo: 3377
        }, {
            from: 'Denmark',
            to: 'UK',
            weight: 1882,
            weightTo: 1049
        }, {
            from: 'Netherlands',
            to: 'Norway',
            weight: 583,
            weightTo: 487
        }, {
            from: 'Netherlands',
            to: 'UK',
            weight: 1666,
            weightTo: 261
        }, {
            from: 'Norway',
            to: 'Sweden',
            weight: 1296,
            weightTo: 3211
        }, {
            from: 'Norway',
            to: 'UK',
            weight: 1766,
            weightTo: 1201
        }],
        type: 'dependencywheel',
        name: 'Electricity flows',
        linkOpacity: 0.42,
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
        size: '94%',
        tooltip: {
            headerFormat: '',
            pointFormat:
                '{point.fromNode.name} \u2192 {point.toNode.name}: <b>' +
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
        }
    }]

} satisfies Highcharts.Options);
