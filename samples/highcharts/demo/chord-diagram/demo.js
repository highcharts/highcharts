Highcharts.chart('container', {

    title: {
        text:
        'Cross border electricity trading of Norway with its neighbours in 2026'
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
            ['Germany', 'Denmark', 3678, 5476],
            ['Germany', 'Netherlands', 3066, 3772],
            ['Germany', 'Norway', 1302, 1954],
            ['Germany', 'Sweden', 109, 281],
            ['Denmark', 'Netherlands', 908, 1537],
            ['Denmark', 'Norway', 1399, 1584],
            ['Denmark', 'Sweden', 737, 3475],
            ['Denmark', 'United Kingdom', 1982, 1250],
            ['Netherlands', 'Norway', 571, 488],
            ['Netherlands', 'United Kingdom', 1788, 1267],
            ['Norway', 'Sweden', 1324, 3300],
            ['Norway', 'United Kingdom', 1937, 1135]
        ],
        type: 'dependencywheel',
        name: 'Dependency wheel series',
        dataLabels: {
            color: 'var(--highcharts-neutral-color-80, #333)',
            style: {
                textOutline: 'none'
            },
            textPath: {
                enabled: true
            },
            distance: 10
        },
        size: '95%'
    }]

});
