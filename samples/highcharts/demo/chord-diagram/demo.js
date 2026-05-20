const countryColors = {
    Norway: '#38bdf8',
    Germany: '#fb7185',
    Denmark: '#fbbf24',
    Netherlands: '#f97316',
    Sweden: '#34d399',
    UK: '#a78bfa'
};

Highcharts.chart('container', {

    chart: {
        backgroundColor: '#0c1524',
        style: {
            fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'
        },
        spacingTop: 24,
        spacingBottom: 16
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
        pointFormatter: function () {
            const point = this;
            const formatEnergy = function (value) {
                if (value >= 1000) {
                    return (value / 1000).toFixed(2) + ' TWh';
                }
                return value + ' GWh';
            };
            let output = point.fromNode.name + ' \u2192 ' +
                point.toNode.name + ': <b>' + formatEnergy(point.weight) +
                '</b><br/>';

            if (point.weightTo) {
                output += point.toNode.name + ' \u2192 ' +
                    point.fromNode.name + ': <b>' +
                    formatEnergy(point.weightTo) + '</b><br/>';
            }

            return output;
        },
        nodeFormatter: function () {
            const node = this;
            const linksFrom = node.linksFrom || [];
            const linksTo = node.linksTo || [];

            const exportGWh =
                linksFrom.reduce((sum, link) => sum + (link.weight || 0), 0) +
                linksTo.reduce((sum, link) => sum + (link.weightTo || 0), 0);

            const importGWh =
                linksTo.reduce((sum, link) => sum + (link.weight || 0), 0) +
                linksFrom.reduce((sum, link) => sum + (link.weightTo || 0), 0);

            const toTWh = function (value) {
                return (value / 1000).toFixed(2) + ' TWh';
            };

            return (
                '<b>' + node.name + '</b><br/>' +
                'Import: <b>' + toTWh(importGWh) + '</b><br/>' +
                'Export: <b>' + toTWh(exportGWh) + '</b>'
            );
        }
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
        nodes: Object.keys(countryColors).map(id => ({
            id,
            color: countryColors[id],
            dataLabels: id === 'Norway' ? {
                style: {
                    fontWeight: '700',
                    fontSize: '0.95rem'
                }
            } : undefined
        })),
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
