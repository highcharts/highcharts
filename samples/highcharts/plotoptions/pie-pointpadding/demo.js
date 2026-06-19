// Pie point padding plugin
//
// `oldArc` and `applyBorderRadius` below are forked from Highcharts core
// (ts/Core/Renderer/SVG/Symbols.ts `arc` and ts/Extensions/BorderRadius.ts
// `applyBorderRadius`) and extended to thread per-point `padding` through the
// internal angle and corner-radius math. The base arc is private to the
// BorderRadius module, so it can't be reused via the wrap's `proceed`; this
// copy will need to be re-synced if those core modules change.
(function (H) {
    if (H.SVGElement.symbolCustomAttribs.indexOf('padding') === -1) {
        H.SVGElement.symbolCustomAttribs.push('padding');
    }

    function oldArc(cx, cy, w, h, options) {
        const arc = [];

        if (options) {
            const rawStart = options.start || 0,
                rawEnd = options.end || 0,
                radianRange = Math.abs(rawEnd - rawStart),
                padding = options.padding || 0,
                radius = options.r || 0,
                innerRadius = options.innerR,
                minArcRange = 0.05,
                // Subtract a small number to prevent cos and sin of start and
                // end from becoming equal on 360 arcs (#1561).
                // See "Arc proximity" tests at
                // samples/unit-tests/svgrenderer/symbol/demo.js
                proximity = 0.0001;

            const paddingRadius = radius > 0 ?
                radius : (innerRadius && innerRadius > 0 ? innerRadius : 0);
            const paddingInRadiansRaw =
                paddingRadius > 0 ? (padding / paddingRadius) : 0;
            const paddingInRadians =
                Math.min(paddingInRadiansRaw, radianRange - proximity);

            let start = rawStart + paddingInRadians,
                end = rawEnd - paddingInRadians;

            // Check if padding can be applied to the arc, prevents small arcs
            // from disappearing
            if (paddingInRadians > 0 && end - start <= minArcRange) {
                const middleAngle = (start + end) / 2;
                start = middleAngle - minArcRange / 2;
                end = middleAngle + minArcRange / 2;
            }

            const rx = H.pick(options.r, w),
                ry = H.pick(options.r, h || w),
                fullCircle = (
                    Math.abs(end - start - 2 * Math.PI) <
                    proximity
                );

            if (fullCircle) {
                start = Math.PI / 2;
                end = Math.PI * 2.5 - proximity;
            }

            const open = options.open ?? fullCircle,
                cosStart = fullCircle ? 0 : Math.cos(start),
                sinStart = fullCircle ? 1 : Math.sin(start),
                cosEnd = fullCircle ? 0 : Math.cos(end),
                sinEnd = fullCircle ? 1 : Math.sin(end),
                // Proximity takes care of rounding errors around PI (#6971)
                longArc = H.pick(
                    options.longArc,
                    end - start - Math.PI < proximity ? 0 : 1
                );

            let arcSegment = [
                'A', // ArcTo
                rx, // X radius
                ry, // Y radius
                0, // Slanting
                longArc, // Long or short arc
                H.pick(options.clockwise, 1), // Clockwise
                // Use a static pixel offset for full circle (#21701)
                cx + (fullCircle ? 0.001 : rx * cosEnd),
                cy + ry * sinEnd
            ];
            // Memo for border radius
            arcSegment.params = { start: rawStart, end: rawEnd, cx, cy };
            arc.push(
                [
                    'M',
                    cx + rx * cosStart,
                    cy + ry * sinStart
                ],
                arcSegment
            );

            if (H.defined(innerRadius)) {
                // Check minimal inner radius value
                const minInnerRadius = (padding * 2) / radianRange;
                const minAcceptableInnerRadius =
                    Math.max(innerRadius, radius * 0.5);
                const cInnerRadius = (
                    paddingInRadians > 0 && minInnerRadius > innerRadius
                ) ?
                    Math.min(minInnerRadius, minAcceptableInnerRadius) :
                    innerRadius;
                let innerStart = rawStart;
                let innerEnd = rawEnd;

                if (paddingInRadians > 0) {
                    const innerPaddingInRadians = Math.min(
                        padding / cInnerRadius,
                        Math.abs(rawEnd - rawStart) - proximity
                    );

                    innerStart = rawStart + innerPaddingInRadians;
                    innerEnd = rawEnd - innerPaddingInRadians;

                    // Check if padding can be applied to the inner arc
                    if (innerEnd < innerStart) {
                        const middleAngle = (innerStart + innerEnd) / 2;
                        innerStart = middleAngle;
                        innerEnd = middleAngle;
                    }
                }

                const innerCosStart = fullCircle ? 0 : Math.cos(innerStart),
                    innerSinStart = fullCircle ? 1 : Math.sin(innerStart),
                    innerCosEnd = fullCircle ? 0 : Math.cos(innerEnd),
                    innerSinEnd = fullCircle ? 1 : Math.sin(innerEnd),
                    // Proximity takes care of rounding errors around PI (#6971)
                    innerlongArc = H.pick(
                        options.longArc,
                        innerEnd - innerStart - Math.PI < proximity ? 0 : 1
                    );

                arcSegment = [
                    'A', // ArcTo
                    innerRadius, // X radius
                    innerRadius, // Y radius
                    0, // Slanting
                    innerlongArc, // Long or short arc
                    // Clockwise - opposite to the outer arc clockwise
                    H.defined(options.clockwise) ? 1 - options.clockwise : 0,
                    cx + (fullCircle ? -0.001 : cInnerRadius * innerCosStart),
                    cy + cInnerRadius * innerSinStart
                ];
                // Memo for border radius
                arcSegment.params = {
                    start: rawEnd,
                    end: rawStart,
                    cx,
                    cy,
                    innerRadius: cInnerRadius
                };
                arc.push(
                    open ?
                        [
                            'M',
                            cx + cInnerRadius * innerCosEnd,
                            cy + cInnerRadius * innerSinEnd
                        ] : [
                            'L',
                            cx + cInnerRadius * innerCosEnd,
                            cy + cInnerRadius * innerSinEnd
                        ],
                    arcSegment
                );
            }
            if (!open) {
                arc.push(['Z']);
            }
        }

        return arc;
    }

    function applyBorderRadius(
        path,
        i,
        r,
        padding, // Padding in pixels
        skipInnerRadius
    ) {
        const a = path[i];

        let b = path[i + 1];
        if (b[0] === 'Z') {
            b = path[0];
        }

        let line, arc, fromLineToArc;

        // From straight line to arc
        if ((a[0] === 'M' || a[0] === 'L') && b[0] === 'A') {
            line = a;
            arc = b;
            fromLineToArc = true;

        // From arc to straight line
        } else if (a[0] === 'A' && (b[0] === 'M' || b[0] === 'L')) {
            line = b;
            arc = a;
        }

        if (line && arc && arc.params) {
            const params = arc.params;
            const { start, end, cx, cy, innerRadius } = params;
            const bigR = innerRadius || arc[1],
                // In our use cases, outer pie slice arcs are clockwise and
                // inner arcs (donut/sunburst etc) are anti-clockwise
                clockwise = arc[5];

            // Some geometric constants
            const relativeR =
                Math.max(clockwise ? (bigR - r) : (bigR + r), 0.0001),
                // Padding for calculated relativeR value in radians
                relativeRPadding = relativeR > 0 ? padding / relativeR : 0,
                padDir = innerRadius && innerRadius > 0 ? -1 : 1,
                // The angle, on the big arc, that the border radius
                // arc takes up
                angleOfBorderRadius = relativeR ? Math.asin(r / relativeR) : 0,
                angleOffset = clockwise ?
                    angleOfBorderRadius :
                    -angleOfBorderRadius,
                // The distance along the radius of the big arc to the starting
                // point of the small border radius arc
                distanceBigCenterToStartArc =
                    Math.cos(angleOfBorderRadius) * relativeR;

            if (
                innerRadius === void 0 ||
                (innerRadius > 0 && !skipInnerRadius)
            ) {
                // From line to arc
                if (fromLineToArc) {

                    // Update the cache
                    const rStart = start + padDir * relativeRPadding;
                    params.start = rStart + angleOffset;

                    // First move to the start position at the radial line. We
                    // want to start one borderRadius closer to the center.
                    line[1] =
                        cx + distanceBigCenterToStartArc * Math.cos(rStart);
                    line[2] =
                        cy + distanceBigCenterToStartArc * Math.sin(rStart);

                    // Now draw an arc towards the point where the small circle
                    // touches the great circle.
                    path.splice(i + 1, 0, [
                        'A',
                        r,
                        r,
                        0, // Slanting,
                        0, // Long arc
                        1, // Clockwise
                        cx + bigR * Math.cos(params.start),
                        cy + bigR * Math.sin(params.start)
                    ]);

                // From arc to line
                } else {

                    // Update the cache
                    const rEnd = end - padDir * relativeRPadding;
                    params.end = rEnd - angleOffset;

                    // End the big arc a bit earlier
                    arc[6] = cx + bigR * Math.cos(params.end);
                    arc[7] = cy + bigR * Math.sin(params.end);

                    // Draw a small arc towards a point on the end angle,
                    // but one borderRadius closer to the center relative
                    // to the perimeter.
                    path.splice(i + 1, 0, [
                        'A',
                        r,
                        r,
                        0,
                        0,
                        1,
                        cx + distanceBigCenterToStartArc * Math.cos(rEnd),
                        cy + distanceBigCenterToStartArc * Math.sin(rEnd)
                    ]);
                }

                // Long or short arc must be reconsidered because we have
                // modified the start and end points
                arc[4] = Math.abs(params.end - params.start) < Math.PI ? 0 : 1;
            }
        }
    }

    H.wrap(H.Renderer.prototype.symbols, 'arc', function () {
        const [x, y, w, h, options] = Array.prototype.slice.call(arguments, 1);
        const path = oldArc(x, y, w, h, options),
            {
                brStart = true,
                brEnd = true,
                innerR = 0,
                r = w,
                start = 0,
                end = 0,
                padding = 0
            } = options;

        if (options.open || !options.borderRadius) {
            return path;
        }

        const alpha = end - start - (2 * padding) / r,
            sinHalfAlpha = Math.sin(alpha / 2),
            borderRadius = Math.max(Math.min(
                H.relativeLength(options.borderRadius || 0, r - innerR),
                // Cap to half the sector radius
                (r - innerR) / 2,
                // For smaller pie slices, cap to the largest small circle that
                // can be fitted within the sector
                (r * sinHalfAlpha) / (1 + sinHalfAlpha)
            ), 0),
            // For the inner radius, we need an extra cap because the inner arc
            // is shorter than the outer arc
            innerBorderRadius = Math.min(
                borderRadius,
                2 * (alpha / Math.PI) * innerR
            ),
            // When inner alpha is too small, we skip the inner radius
            innerAlpha = alpha - 2 * padding / innerR;

        // Apply turn-by-turn border radius. Start at the end since we're
        // splicing in arc segments.
        let i = path.length - 1;
        while (i--) {
            if (
                (!brStart && (i === 0 || i === 3)) ||
                (!brEnd && (i === 1 || i === 2))
            ) {
                continue;
            }

            if (
                (i > 1 && innerBorderRadius > 0.001) ||
                (i <= 1 && borderRadius > 0.001)
            ) {
                applyBorderRadius(
                    path,
                    i,
                    i > 1 ? innerBorderRadius : borderRadius,
                    padding,
                    innerAlpha <= 0
                );
            }
        }

        return path;
    });

    H.wrap(
        H.Series.types.pie.prototype.pointClass.prototype,
        'haloPath',
        function () {
            const [size] = Array.prototype.slice.call(arguments, 1);
            const shapeArgs = this.shapeArgs;

            return this.sliced || !this.visible ?
                [] :
                this.series.chart.renderer.symbols.arc(
                    shapeArgs.x,
                    shapeArgs.y,
                    shapeArgs.r + size,
                    shapeArgs.r + size, {
                    // Subtract 1px to ensure the background is not bleeding
                    // through between the halo and the slice (#7495).
                        innerR: shapeArgs.r - 1,
                        start: shapeArgs.start,
                        end: shapeArgs.end,
                        borderRadius: shapeArgs.borderRadius,
                        padding: shapeArgs.padding
                    }
                );
        }
    );

    H.wrap(H.Series.types.pie.prototype, 'translate', function (proceed) {
        const props = Array.prototype.slice.call(arguments, 1);
        proceed.apply(this, props);

        const series = this;
        let [positions] = props;

        if (!positions) {
            positions = series.getCenter();
        }

        const r = positions[2] / 2;
        const padding =
            H.relativeLength(series.options.pointPadding || 0, r) / 2;
        const len = series.points.length;

        for (let i = 0; i < len; i++) {
            const point = series.points[i];
            const shapeArgs = {
                ...point.shapeArgs,
                r,
                padding
            };

            let angle = (shapeArgs.end + shapeArgs.start) / 2;

            if (angle > 1.5 * Math.PI) {
                angle -= 2 * Math.PI;
            } else if (angle < -Math.PI / 2) {
                angle += 2 * Math.PI;
            }

            point.shapeArgs = shapeArgs;
            point.tooltipPos = [
                positions[0] + Math.cos(angle) * r * 0.7,
                positions[1] + Math.sin(angle) * r * 0.7
            ];
        }
    });
}(Highcharts));

Highcharts.chart('container', {

    title: {
        text: 'Electricity consumption by country'
    },

    subtitle: {
        text: 'Illustrative annual use (TWh), selected economies'
    },

    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b>{point.name}</b><br/>' +
            '{point.y:,.0f} TWh ({point.percentage:.1f}%)'
    },

    accessibility: {
        description: 'Pie chart showing illustrative annual electricity ' +
            'consumption in terawatt-hours for a selection of countries, ' +
            'demonstrating the pie point padding plugin.',
        point: {
            valueDescriptionFormat: '{point.name}: {point.y} TWh, ' +
                '{point.percentage:.1f}%.'
        }
    },

    series: [{
        type: 'pie',
        keys: ['name', 'y'],
        data: [
            ['US', 600],
            ['Canada', 200],
            ['Japan', 300],
            ['Australia', 200],
            ['Germany', 400],
            ['France', 200],
            ['China', 1300],
            ['UK', 200]
        ],
        borderRadius: '4%',
        borderColor: '#000',
        borderWidth: 1,
        innerSize: '30%',
        pointPadding: 10 // pixels or percentage
    }]
});
