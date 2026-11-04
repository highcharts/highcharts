/**
 * Stack-aware minPointLength.
 *
 * Highcharts applies `minPointLength` to each point in isolation, so in a
 * stack the inflated points end up on top of each other, or grow into the
 * neighbour below. This plugin lays out the stack as a whole: every point
 * that is too short is given its minimum length, and those pixels are taken
 * from the points that have height to spare. The stack keeps its total
 * height, so the axis and the stack labels stay correct.
 *
 * It reads the stack cache and reuses `crispCol`, so it follows the internals
 * of the column series rather than the public API.
 */
(function (H) {

    // Every series in a stack needs the same layout, so it is computed once
    // per draw and reused by the rest
    let drawPass = 0;

    ['beforeRender', 'predraw'].forEach(function (event) {
        H.addEvent(H.Chart, event, function () {
            drawPass++;
        });
    });

    // Locate the stack a point belongs to. Positive and negative values live
    // in separate stacks, and a stack keeps the entries of series that have
    // since crossed the threshold, so match on the point's own stack value.
    function getStackItem(point, series) {
        const stacks = series.yAxis.stacking.stacks;

        for (const key of Object.keys(stacks)) {
            const stackItem = stacks[key][point.x];

            if (stackItem?.points[series.index]?.[1] === point.stackY) {
                return stackItem;
            }
        }
    }

    // The entry a series leaves behind when it crosses the threshold is
    // indistinguishable from a live one, so count the stacks holding an entry
    // for the series. More than one means the cache cannot be trusted.
    function countStackEntries(stacks, index, x) {
        let count = 0;

        for (const key of Object.keys(stacks)) {
            if (stacks[key][x]?.points[index]) {
                count++;
            }
        }

        return count;
    }

    // Give every point that is too short its minimum length, and take those
    // pixels from the points that have height to spare. Returns the segments
    // in stacking order, or nothing when the stack is left to the core.
    function computeLayout(stackItem, series) {
        const yAxis = series.yAxis,
            stacks = yAxis.stacking.stacks,
            segments = [];

        let deficit = 0,
            totalSpare = 0,
            misread = false;

        series.chart.series.forEach(function (otherSeries) {
            const extremes = stackItem.points[otherSeries.index];

            // A stack keeps the entries of series that have since been
            // hidden, and those must not take part in the layout
            if (!extremes || !otherSeries.reserveSpace()) {
                return;
            }

            if (countStackEntries(stacks, otherSeries.index, stackItem.x) > 1) {
                misread = true;
            }

            // The stack keeps the values in cumulative order, so in a
            // negative stack the first one is the larger
            const from = Math.min(extremes[0], extremes[1]),
                to = Math.max(extremes[0], extremes[1]);

            // A zero value takes up no room and is not rendered
            if (from === to) {
                return;
            }

            const height = Math.abs(
                    yAxis.toPixels(to, true) - yAxis.toPixels(from, true)
                ),
                minPointLength = otherSeries.options.minPointLength || 0,
                segment = { from, to, target: height, series: otherSeries };

            if (height < minPointLength) {
                segment.grant = minPointLength - height;
                deficit += segment.grant;
            } else {
                // Never shrink a point out of existence
                segment.spare = Math.max(
                    height - Math.max(minPointLength, 1),
                    0
                );
                totalSpare += segment.spare;
            }

            segments.push(segment);
        });

        // Leave the stack to the core when it holds an entry we cannot read,
        // when nothing is too short, or when a single point has nothing to
        // overlap in the first place.
        if (misread || !deficit || segments.length < 2) {
            return;
        }

        segments.sort(function (a, b) {
            return a.from - b.from;
        });

        const stackFrom = segments[0].from,
            stackTo = segments[segments.length - 1].to,
            anchor = yAxis.toPixels(stackFrom, true),
            far = yAxis.toPixels(stackTo, true),
            // On a reversed axis the stack grows downwards in pixels
            sign = anchor >= far ? 1 : -1,
            // A stack too short to satisfy every minimum hands out the same
            // fraction of what each point asked for
            scale = Math.min(1, totalSpare / deficit),
            share = deficit * scale / totalSpare;

        let cursor = anchor;

        // Move the borrowed pixels, walking from the lower edge outwards
        segments.forEach(function (segment) {
            if (segment.grant) {
                segment.target += segment.grant * scale;
            } else if (segment.spare) {
                segment.target -= segment.spare * share;
            }

            const end = cursor - sign * segment.target;

            segment.y = Math.min(cursor, end);
            cursor = end;
        });

        return segments;
    }

    // The layout is shared by the whole stack, so it is computed by the first
    // series that asks for it and read by the others
    function getStackLayout(stackItem, series) {
        const cached = stackItem.minPointLengthLayout;

        if (cached && cached.pass === drawPass) {
            return cached.segments;
        }

        const segments = computeLayout(stackItem, series);

        stackItem.minPointLengthLayout = { pass: drawPass, segments };

        return segments;
    }

    H.addEvent(H.Series, 'afterColumnTranslate', function () {
        const series = this;

        if (!series.options.stacking || !series.yAxis.stacking) {
            return;
        }

        series.points.forEach(function (point) {
            const shapeArgs = point.shapeArgs;

            if (!shapeArgs) {
                return;
            }

            // A zero value has nothing to show, and drawing it as a
            // minPointLength bar would misrepresent the stack. Collapse it
            // onto its place in the stack, so a data label still lands where
            // the value belongs.
            if (point.y === 0) {
                shapeArgs.height = 0;
                if (H.isNumber(point.stackY)) {
                    shapeArgs.y = series.yAxis.toPixels(point.stackY, true);
                }
                point.borderWidth = 0;
                return;
            }

            const stackItem = getStackItem(point, series),
                segments = stackItem && getStackLayout(stackItem, series),
                segment = segments?.find(function (candidate) {
                    return candidate.series === series;
                });

            if (segment) {
                const box = series.crispCol(
                    shapeArgs.x,
                    segment.y,
                    shapeArgs.width,
                    segment.target
                );

                shapeArgs.y = box.y;
                shapeArgs.height = box.height;
            }

            // A point thinner than its own border is all border and no fill.
            // In styled mode the border comes from CSS and this has no effect.
            if (shapeArgs.height < 2 * (series.borderWidth || 0)) {
                point.borderWidth = 0;
            }
        });
    });

}(Highcharts));

Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Support tickets by severity'
    },

    subtitle: {
        text: 'Critical tickets stay visible without inflating the stack'
    },

    accessibility: {
        description: 'A stacked column chart of support tickets per week, ' +
            'split by severity. The severities with very few tickets are ' +
            'given a minimum height so that they remain visible next to the ' +
            'much larger low-severity counts.'
    },

    xAxis: {
        categories: ['Week 1', 'Week 2', 'Week 3']
    },

    yAxis: {
        title: {
            text: 'Tickets'
        },
        stackLabels: {
            enabled: true
        }
    },

    plotOptions: {
        series: {
            stacking: 'normal',
            minPointLength: 4
        }
    },

    series: [{
        name: 'Low',
        data: [820, 932, 901]
    }, {
        name: 'Medium',
        data: [210, 180, 260]
    }, {
        name: 'High',
        data: [12, 6, 9]
    }, {
        name: 'Critical',
        data: [2, 0, 1]
    }]
});
