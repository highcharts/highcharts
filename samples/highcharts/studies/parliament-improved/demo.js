Highcharts.addEvent(Highcharts.Series, 'afterRender', function () {
    this.points
        .forEach(point => {
            if (point.visible && !point.isNull) {

                // First improvement, create padding between groups
                const pointPadding = (this.options.pointPadding || 0) *
                    this.itemSize,
                    translateX = Math.cos(point.angle) * pointPadding,
                    translateY = Math.sin(point.angle) * pointPadding;

                point.graphic.translate(translateX, translateY);

                // Second improvement, create a backdrop for each group
                if (window.hull) {
                    const polygon = window.hull(
                        Object.keys(point.graphics)
                            .map(key => point.graphics[key]),
                        10,
                        ['.x', '.y']
                    );

                    const d = polygon
                        .map((p, i) => [
                            i === 0 ? 'M' : 'L',
                            p.x + point.graphics[i].width / 2,
                            p.y + point.graphics[i].height / 2
                        ]);
                    d.push(['z']);

                    if (point.backdrop) {
                        point.backdrop.animate({ d });
                    } else {
                        point.backgrop = this.chart.renderer
                            .path(d)
                            .attr({
                                stroke: point.color,
                                'stroke-width': this.itemSize,
                                'stroke-linejoin': 'round',
                                fill: point.color,
                                opacity: 0.2
                            })
                            .add(point.graphic);
                    }
                }
            } else if (point.backdrop) {
                point.backdrop = point.backdrop.destroy();
            }
        });
});


Highcharts.chart('container', {

    chart: {
        type: 'item',
        plotBorderWidth: 1
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'Parliament visualization'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: [
            ['The Left', 69, '#BE3075', 'DIE LINKE'],
            ['Social Democratic Party', 153, '#EB001F', 'SPD'],
            ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
            ['Free Democratic Party', 80, '#FFED00', 'FDP'],
            ['Christian Democratic Union', 200, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
            ['Alternative for Germany', 94, '#009EE0', 'AfD']
        ],
        dataLabels: {
            enabled: true,
            format: '{point.label}'
        },

        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100,
        pointPadding: 1
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            chartOptions: {
                series: [{
                    dataLabels: {
                        distance: -30
                    }
                }]
            }
        }]
    }
});
