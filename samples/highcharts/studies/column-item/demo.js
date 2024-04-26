(({ seriesType }) => {

    seriesType(
        'columnitem',
        'column',
        null,
        {
            drawPoints: function () {
                const total = this.points.reduce(
                        (acc, point) => acc + point.y,
                        0
                    ),
                    totalHeight = this.points.reduce(
                        (acc, point) => acc + point.shapeArgs.height,
                        0
                    ),
                    columnWidth = this.points[0].shapeArgs.width;

                let slotsPerColumn = 1,
                    slotWidth = columnWidth;
                while (slotsPerColumn < total) {
                    if (
                        total / slotsPerColumn <
                        (totalHeight / slotWidth) * 1.2
                    ) {
                        break;
                    }
                    slotsPerColumn++;
                    slotWidth = columnWidth / slotsPerColumn;
                }

                const slotHeight = (totalHeight * slotsPerColumn) / total;

                if (this.options.allowOverflow) {
                    slotWidth = slotHeight;
                }

                const radius = Math.min(slotWidth, slotHeight) / 2;

                for (const point of this.points) {
                    const shapeArgs = point.shapeArgs,
                        graphics = point.graphics = point.graphics || [],
                        startX = shapeArgs.x + (
                            shapeArgs.width -
                            slotsPerColumn * slotWidth +
                            slotWidth
                        ) / 2;

                    let x = startX,
                        y = shapeArgs.y + shapeArgs.height - slotHeight / 2,
                        slotColumn = 0;

                    if (!point.graphic) {
                        point.graphic = this.chart.renderer.g('point')
                            .add(this.group);
                    }

                    for (let val = 0; val < point.y || 0; val++) {

                        const attr = {
                            x,
                            y,
                            r: radius,
                            ...this.pointAttribs(point)
                        };

                        let graphic = graphics[val];
                        if (graphic) {
                            graphic.animate(attr);
                        } else {
                            graphic = this.chart.renderer
                                .circle(x, y, radius)
                                .attr(attr)
                                .add(point.graphic);
                        }
                        graphic.isActive = true;
                        graphics[val] = graphic;

                        x += slotWidth;
                        slotColumn++;
                        if (slotColumn >= slotsPerColumn) {
                            slotColumn = 0;
                            x = startX;
                            y -= slotHeight;
                        }
                    }
                }
            }
        }
    );
})(Highcharts);

Highcharts.chart('container', {
    chart: {
        type: 'columnitem'
    },
    title: {
        text: 'Stortinget'
    },
    xAxis: {
        type: 'category',
        offset: 5
    },
    yAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },
    series: [
        /*
        {
            data: [
                ['R', 1],
                ['SV', 11],
                ['AP', 49],
                ['SP', 19],
                ['MDG', 1],
                ['KrF', 8],
                ['V', 8],
                ['H', 45],
                ['FrP', 27]
            ],
            type: 'column',
            color: 'transparent',
            borderColor: 'black',
            dashStyle: 'dot',
            name: 'Target boxes'
        },
        // */
        {
            data: [
                ['R', 1],
                ['SV', 11],
                ['AP', 49],
                ['SP', 19],
                ['MDG', 1],
                ['KrF', 8],
                ['V', 8],
                ['H', 45],
                ['FrP', 27]
            ],
            name: 'Delegates',
            colorByPoint: true,
            allowOverflow: true,
            dataLabels: {
                enabled: true,
                y: -10,
                style: {
                    fontSize: '1em',
                    fontWeight: 'normal'
                }
            }
        }
    ]
});
