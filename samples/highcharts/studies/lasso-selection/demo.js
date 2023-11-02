(Highcharts => {
    const {
        addEvent,
        Chart
    } = Highcharts;

    const polygon = [];

    /*
    * Display a temporary label on the chart
    */
    const toast = (chart, text) => {
        const toast = chart.renderer.label(text, 100, 120)
            .attr({
                fill: Highcharts.getOptions().colors[0],
                padding: 10,
                r: 5,
                zIndex: 8
            })
            .css({
                color: '#FFFFFF'
            })
            .add();

        setTimeout(() => {
            toast.animate({ opacity: 0 }, {
                complete: () => {
                    toast.destroy();
                }
            });
        }, 2000);
    };

    /**
     * Point in polygon function borrowed from MapUtilities.ts
     */
    const pointInPolygon = (
        point,
        polygon
    ) => {
        const { x, y } = point;
        let i,
            j,
            rel1,
            rel2,
            c = false;

        for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            rel1 = polygon[i][1] > y;
            rel2 = polygon[j][1] > y;
            if (
                rel1 !== rel2 &&
                (
                    x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) /
                        (polygon[j][1] - polygon[i][1]) +
                        polygon[i][0]
                )
            ) {
                c = !c;
            }
        }

        return c;
    };

    /**
     * Perform the point selection by checking if each point is inside the
     * polygon
     */
    const selectPoints = chart => {
        // Select points
        chart.series.forEach(series => {
            if (series.options.custom?.lassoSelection) {
                series.points.forEach(point => {
                    const xy = {
                        x: chart.plotLeft + point.plotX,
                        y: chart.plotTop + point.plotY
                    };
                    if (pointInPolygon(xy, polygon)) {
                        point.select(true, true);
                    }
                });
            }
        });
    };

    /**
     * Convert the polygon to a path definition that the SVGRenderer can read
     */
    const polygonToPath = polygon => polygon.map(
        (p, i) => [i ? 'L' : 'M', p[0], p[1]]
    );

    /*
     * On click, unselect all points
     */
    addEvent(Chart, 'click', function () {
        const points = this.getSelectedPoints();
        if (points.length > 0) {
            points.forEach(point => point.select(false));
        }
    });

    /**
     * On chart load, set up the DOM event listeners
     */
    addEvent(Chart, 'load', function () {
        this.container.addEventListener('mousedown', e => {
            if (this.series.some(
                series => series.options.custom?.lassoSelection)
            ) {
                this.lasso = this.renderer.path()
                    .attr({
                        stroke: 'blue',
                        'stroke-width': 1,
                        'stroke-dasharray': '2,2'
                    })
                    .add();
                polygon.push([e.chartX, e.chartY]);
            }
        });
        this.container.addEventListener('mousemove', e => {
            if (this.lasso) {
                polygon.push([e.chartX, e.chartY]);
                this.lasso.attr({ d: polygonToPath(polygon) });
            }
        });
        this.container.addEventListener('mouseup', () => {
            const p0 = polygon[0],
                // Prevent sloppy clicks being interpreted as drag
                hasDragged = polygon.some(p =>
                    Math.pow(p0[0] - p[0], 2) + Math.pow(p0[1] - p[1], 2) > 10
                );

            if (hasDragged && this.lasso) {
                polygon.push(polygon[0]);
                this.lasso.attr({ d: polygonToPath(polygon) });
                selectPoints(this);
                polygon.length = 0;

                toast(
                    this,
                    `<b>${this.getSelectedPoints().length} points selected</b>
                    <br>Click on empty space to deselect`
                );

                const lasso = this.lasso;
                delete this.lasso;
                lasso.animate({ opacity: 0 }, {
                    complete: () => {
                        lasso.destroy();
                    }
                });
            } else if (this.lasso) {
                polygon.length = 0;
                this.lasso = this.lasso.destroy();
            }
        });
    });
})(Highcharts);

Highcharts.chart('container', {

    chart: {
        type: 'scatter'
    },

    title: {
        text: 'Select points by click-drag'
    },

    subtitle: {
        text: 'Points can also be selected and unselected individually'
    },

    series: [{
        custom: {
            lassoSelection: true
        },
        data: [
            [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0],
            [155.8, 53.6], [170.0, 59.0], [159.1, 47.6], [166.0, 69.8],
            [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2],
            [172.9, 62.5], [153.4, 42.0], [160.0, 50.0], [147.2, 49.8],
            [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8],
            [170.2, 72.8], [174.0, 54.5], [173.0, 59.8], [179.9, 67.3],
            [170.5, 67.8], [160.0, 47.0], [154.4, 46.2], [162.0, 55.0],
            [176.5, 83.0], [160.0, 54.4], [152.0, 45.8], [162.1, 53.6],
            [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2],
            [161.3, 60.3], [167.6, 58.3], [165.1, 56.2], [160.0, 50.2],
            [170.0, 72.9], [157.5, 59.8], [167.6, 61.0], [160.7, 69.1],
            [163.2, 55.9], [152.4, 46.5], [157.5, 54.3], [168.3, 54.8],
            [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1],
            [161.0, 80.0], [162.0, 54.7], [166.0, 53.2], [174.0, 75.7],
            [172.7, 61.1], [167.6, 55.7], [151.1, 48.7], [164.5, 52.3],
            [163.5, 50.0], [152.0, 59.3], [169.0, 62.5], [164.0, 55.7],
            [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6],
            [169.5, 52.8], [163.2, 59.8], [154.5, 49.0], [159.8, 50.0],
            [173.2, 69.2], [170.0, 55.9], [161.4, 63.4], [169.0, 58.2],
            [166.2, 58.6], [159.4, 45.7], [162.5, 52.2]
        ],
        showInLegend: false,
        allowPointSelect: true
    }]
});
