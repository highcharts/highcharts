/**
 * Highcharts plugin to add a rotation mode option to pie data labels.
 *
 * @todo
 * - Vertical writing mode
 * - Optionally rotated on the right half
 */
(({ merge, wrap }) => {

    wrap(
        Highcharts.seriesTypes.pie.prototype,
        'getDataLabelPosition',
        function (proceed) {
            const pos = proceed.apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );

            if (this.options.dataLabels.rotationMode === 'perpendicular') {
                pos.alignment = 'left';
            }
            return pos;
        }
    );

    // Wrap the placeDataLabels method to apply the rotation mode
    wrap(
        Highcharts.seriesTypes.pie.prototype,
        'placeDataLabels',
        function (proceed) {
            const seriesDLOptions = this.options.dataLabels;

            // Call the original placeDataLabels method
            proceed.apply(this);

            // Apply rotation mode if specified
            for (const point of this.points) {
                for (const dataLabel  of point.dataLabels || []) {
                    const options = merge(seriesDLOptions, dataLabel.options);
                    if (options.rotationMode === 'perpendicular') {
                        const radius = this.center[2] / 2,
                            { distance } = options,
                            vertical = options.style.writingMode ===
                                'vertical-rl',
                            halfHeight = vertical ?
                                0 :
                                dataLabel.bBox.height / 2,
                            attr = {
                                x: this.center[0] - radius - distance,
                                y: this.center[1] - halfHeight,
                                rotationOriginX: radius + distance,
                                rotationOriginY: halfHeight,
                                rotation: point.angle * (180 / Math.PI) + 180
                            };

                        // Right side
                        /*
                        if (!point.half) {
                            dataLabel.attr({ align: 'right' });
                            attr.x = this.center[0] + radius + distance;
                            attr.rotationOriginX = -radius - 2 * distance +
                                dataLabel.bBox.width;
                            attr.rotation -= 180;
                        }
                        */

                        // Avoid animating from far side of the circle
                        if (typeof dataLabel.rotation === 'number') {
                            if (attr.rotation > dataLabel.rotation + 180) {
                                attr.rotation -= 360;
                            } else if (
                                attr.rotation < dataLabel.rotation - 180
                            ) {
                                attr.rotation += 360;
                            }
                        }

                        if (vertical) {
                            attr.x = this.center[0];
                            attr.y = this.center[1] - radius + options.distance;
                            attr.rotationOriginX = 0;
                            attr.rotationOriginY = radius - options.distance;
                            attr.rotation -= 90;
                        }

                        dataLabel[
                            dataLabel.placedPerpendicular ? 'animate' : 'attr'
                        ](attr);

                        dataLabel.placedPerpendicular = true;

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
                    // writingMode: 'vertical-rl',
                    textOrientation: 'upright',
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
