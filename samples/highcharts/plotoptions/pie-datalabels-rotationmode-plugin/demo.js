/**
 * Highcharts plugin to add a rotation mode option to pie data labels. This
 * plugin adds a `dataLabels.rotationMode` option to pie series, which can be
 * set to either `perpendicular` or `perpendicular-fixed`. When set to
 * `perpendicular`, the data labels will be rotated to be perpendicular to the
 * pie slice. When set to `perpendicular-fixed`, the data labels will be rotated
 * to be perpendicular to the pie slice, but will always be left-aligned, and
 * rendered upside down on the left hemisphere, for better consistency in an
 * animated wheel of fortune setup.
 *
 * Updated 2026-09-27
 */
(({ animate, animObject, merge, wrap }) => {

    // Wrap the placeDataLabels method to apply the rotation mode
    wrap(
        Highcharts.seriesTypes.pie.prototype,
        'placeDataLabels',
        function (proceed) {
            const seriesDLOptions = this.options.dataLabels,
                animation = animObject(this.chart.renderer.globalAnimation);

            // Call the original placeDataLabels method
            proceed.apply(this);

            // Apply rotation mode if specified
            for (const point of this.points) {
                for (const dataLabel  of point.dataLabels || []) {
                    const options = merge(seriesDLOptions, dataLabel.options);
                    if (
                        options.rotationMode === 'perpendicular' ||
                        options.rotationMode === 'perpendicular-fixed'
                    ) {
                        const radius = this.center[2] / 2,
                            { distance } = options,
                            lastAngle = dataLabel.lastPerpendicularAngle,
                            vertical = options.style.writingMode ===
                                'vertical-rl',
                            halfHeight = vertical ?
                                0 :
                                dataLabel.bBox.height / 2;

                        const getAttr = angle => {
                            const attr = {
                                align: 'left',
                                x: this.center[0] - radius - distance,
                                y: this.center[1] - halfHeight,
                                rotationOriginX: radius + distance,
                                rotationOriginY: halfHeight,
                                rotation: angle * (180 / Math.PI) + 180
                            };

                            // Right side
                            if (
                                options.rotationMode === 'perpendicular' &&
                                angle > -Math.PI / 2 &&
                                angle < Math.PI / 2
                            ) {
                                attr.align = 'right';
                                attr.x = this.center[0] + radius + distance;
                                attr.rotationOriginX = -radius - 2 * distance +
                                    dataLabel.bBox.width;
                                attr.rotation -= 180;
                            }

                            return attr;
                        };

                        if (typeof lastAngle !== 'number') {
                            dataLabel.attr(getAttr(point.angle));
                        } else {
                            animate(undefined, undefined, {
                                ...animation,
                                step: (now, fx) => {
                                    let fromAngle = lastAngle;

                                    // Avoid animating from far side of circle
                                    if (point.angle > fromAngle + Math.PI) {
                                        fromAngle += 2 * Math.PI;
                                    } else if (
                                        point.angle < fromAngle - Math.PI
                                    ) {
                                        fromAngle -= 2 * Math.PI;
                                    }

                                    dataLabel.attr(
                                        getAttr(
                                            fromAngle +
                                            (point.angle - fromAngle) * fx.pos
                                        )
                                    );
                                }
                            });
                        }

                        dataLabel.lastPerpendicularAngle = point.angle;

                    }
                }
            }
        }
    );

})(Highcharts);


Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Pie data label rotation mode plugin'
    },

    plotOptions: {
        pie: {
            dataLabels: {
                allowOverlap: true,
                align: 'left',
                // backgroundColor: 'contrast',
                distance: -5,
                rotationMode: 'perpendicular', // Plugin option
                style: {
                    fontSize: '1em',
                    textOutline: 'none'
                }
            },
            innerSize: '10%'
        }
    },

    series: [{
        data: [
            ['Alicja', 1],
            ['Andreas', 1],
            ['Anne Jorunn', 1],
            ['Bengisu', 1],
            ['Bengt', 1],
            ['Elida', 1],
            ['Elise', 1],
            ['Gjertrud', 1],
            ['Gøran', 1],
            ['Guro', 1],
            ['Helga', 1],
            ['Joakim R.', 1],
            ['Johan', 1],
            ['Jon', 1],
            ['Jørgen', 1],
            ['Julia', 1],
            ['Linda', 1],
            ['Monika', 1],
            ['Nikita', 1],
            ['Pawel', 1],
            ['Ronny', 1],
            ['Sarah', 1],
            ['Sigrid L.', 1],
            ['Silje', 1],
            ['Stian', 1]
        ]
    }]
});
