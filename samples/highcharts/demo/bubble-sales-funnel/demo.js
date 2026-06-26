const totalMin = -0.5;
const totalMax = 15.5;
const totalRange = totalMax - totalMin;
const maxBubbleSize = 42;
const maxZ = 36;

let pixelsPerXUnit = 1350 / totalRange;
let pixelsPerYUnit = 389 / 100;

function updateLayoutScale(chart) {
    pixelsPerXUnit = chart.plotWidth / totalRange;
    pixelsPerYUnit = chart.plotHeight / 100;
}

function seededRandom(seed) {
    let value = seed;

    return function () {
        value = Math.sin(value) * 10000;
        return value - Math.floor(value);
    };
}

function bubbleRadius(z) {
    return Math.sqrt(z / maxZ) * maxBubbleSize / 2;
}

function funnelTopY(x) {
    const pct = (x - totalMin) / totalRange;
    const topInset = 30 / pixelsPerYUnit;

    return 100 - topInset - pct * 35 * (1 - topInset / 100);
}

function funnelBottomY(x) {
    const pct = (x - totalMin) / totalRange;
    const topInset = 30 / pixelsPerYUnit;

    return pct * 35 * (1 - topInset / 100);
}

function shuffleValues(values, seed) {
    const random = seededRandom(seed);
    const shuffled = values.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function buildValues(profile, count, seed) {
    const profiles = {
        scoping: {
            large: [16, 15, 13],
            medium: [10, 9, 9, 8, 8, 7, 7, 7],
            small: [6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2]
        },
        proposal: {
            large: [36, 24, 20, 18, 16],
            medium: [13, 13, 12, 12, 11, 11, 10, 10, 9, 9, 9, 8, 8],
            small: [7, 7, 6, 6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 2, 2]
        },
        committed: {
            large: [30, 22, 16],
            medium: [12, 11, 10, 9, 8, 8, 7],
            small: [6, 6, 5, 5, 4, 4, 3, 3]
        },
        won: {
            large: [18, 16, 15, 14],
            medium: [12, 12, 11, 11, 10, 10, 9, 9, 8, 8, 8, 7, 7, 7],
            small: [6, 6, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2]
        }
    };

    const selectedProfile = profiles[profile];
    const values = selectedProfile.large.slice();
    const tail = shuffleValues([
        ...selectedProfile.medium,
        ...selectedProfile.small
    ], seed);

    while (values.length < count) {
        // eslint-disable-next-line max-len
        values.push(tail[(values.length - selectedProfile.large.length) % tail.length]);
    }

    return values.slice(0, count);
}

function fitsInsideStage(x, y, radiusPx, stage) {
    const samples = 16;

    for (let i = 0; i < samples; i++) {
        const angle = i / samples * Math.PI * 2;
        const sampleX = x + Math.cos(angle) * radiusPx / pixelsPerXUnit;
        const sampleY = y + Math.sin(angle) * radiusPx / pixelsPerYUnit;

        if (
            sampleX < stage.from + stage.paddingX ||
            sampleX > stage.to - stage.paddingX ||
            sampleY < funnelBottomY(sampleX) + stage.paddingY ||
            sampleY > funnelTopY(sampleX) - stage.paddingY
        ) {
            return false;
        }
    }

    return true;
}

function getOverlapAmount(x, y, radiusPx, placed, gapPx) {
    return placed.reduce((total, point) => {
        const dx = (x - point.x) * pixelsPerXUnit;
        const dy = (y - point.y) * pixelsPerYUnit;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = radiusPx + point.radiusPx + gapPx;

        return total + Math.max(0, minDistance - distance);
    }, 0);
}

function relax(placed, stage) {
    const centerX = (stage.from + stage.to) / 2 + (stage.offsetX || 0);
    const centerY = (funnelTopY(centerX) + funnelBottomY(centerX)) / 2;
    const iterations = stage.relaxIterations || 30;
    const gapPx = stage.gapPx || 4;
    const random = seededRandom((stage.seed || 1) + 1000);

    for (let iteration = 0; iteration < iterations; iteration++) {
        for (let i = 0; i < placed.length; i++) {
            const point = placed[i];

            point.x += (centerX - point.x) * 0.004;
            point.y += (centerY - point.y) * 0.004;

            for (let j = 0; j < placed.length; j++) {
                if (i === j) {
                    continue;
                }

                const other = placed[j];
                const dxPx = (point.x - other.x) * pixelsPerXUnit;
                const dyPx = (point.y - other.y) * pixelsPerYUnit;
                const distance = Math.sqrt(dxPx * dxPx + dyPx * dyPx);
                const minDistance = point.radiusPx + other.radiusPx + gapPx;

                if (distance > 0 && distance < minDistance) {
                    const push = (minDistance - distance) *
                        (0.70 + random() * 0.12);
                    const angle = Math.atan2(dyPx, dxPx);

                    point.x += Math.cos(angle) * push / pixelsPerXUnit;
                    point.y += Math.sin(angle) * push / pixelsPerYUnit;
                }
            }

            let safety = 0;
            while (
                !fitsInsideStage(point.x, point.y, point.radiusPx, stage) &&
                safety++ < 100
            ) {
                point.x += (centerX - point.x) * 0.08;
                point.y += (centerY - point.y) * 0.08;
            }
        }
    }
}

function packStage(stage) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const random = seededRandom(stage.seed || 1);
    const centerX = (stage.from + stage.to) / 2 + (stage.offsetX || 0);
    const top = funnelTopY(centerX);
    const bottom = funnelBottomY(centerX);
    const centerY = (top + bottom) / 2;

    const bubbles = stage.values
        .map(z => ({
            z,
            radiusPx: bubbleRadius(z)
        }))
        .sort((a, b) => b.radiusPx - a.radiusPx);

    const placed = [];

    bubbles.forEach(bubble => {
        let didPlace = false;
        let fallback = null;

        for (let i = 0; i < 6000; i++) {
            const spiralRadius = Math.sqrt(i) * stage.spiralStep;
            const angle = i * goldenAngle + random() * (stage.angleJitter || 0);

            const x = centerX +
            Math.cos(angle) *
            spiralRadius *
            stage.aspectX /
            pixelsPerXUnit;

            const y = centerY +
            Math.sin(angle) *
            spiralRadius *
            stage.aspectY /
            pixelsPerYUnit;

            if (fitsInsideStage(x, y, bubble.radiusPx, stage)) {
                const overlapAmount = getOverlapAmount(
                    x,
                    y,
                    bubble.radiusPx,
                    placed,
                    stage.gapPx
                );

                if (!fallback || overlapAmount < fallback.overlapAmount) {
                    fallback = {
                        x,
                        y,
                        overlapAmount
                    };
                }

                if (!overlapAmount) {
                    placed.push({
                        x,
                        y,
                        z: bubble.z,
                        radiusPx: bubble.radiusPx
                    });
                    didPlace = true;
                    break;
                }
            }
        }

        if (!didPlace && fallback && fallback.overlapAmount < 1) {
            placed.push({
                x: fallback.x,
                y: fallback.y,
                z: bubble.z,
                radiusPx: bubble.radiusPx
            });
        }
    });

    relax(placed, stage);

    if (stage.positionJitter) {
        placed.forEach(point => {
            const jitterX = (random() - 0.5) * stage.positionJitter;
            const jitterY = (random() - 0.5) * stage.positionJitter;
            const x = point.x + jitterX;
            const y = point.y + jitterY;

            if (fitsInsideStage(x, y, point.radiusPx, stage)) {
                point.x = x;
                point.y = y;
            }
        });
    }

    return placed.map(({ x, y, z }) => ({ x, y, z }));
}

function getPackedData(chart) {
    if (chart) {
        updateLayoutScale(chart);
    }

    return {
        scoping: packStage({
            from: -0.5,
            to: 3.5,
            values: buildValues('scoping', 30, 1),
            gapPx: 4,
            spiralStep: 3.8,
            paddingX: 0.2,
            paddingY: 4,
            aspectX: 1.35,
            aspectY: 0.9,
            relaxIterations: 12,
            angleJitter: 0.08,
            positionJitter: 0.04,
            seed: 11
        }),
        proposal: packStage({
            from: 3.5,
            to: 7.5,
            values: buildValues('proposal', 90, 2),
            gapPx: 4,
            spiralStep: 3.4,
            paddingX: 0.22,
            paddingY: 6,
            aspectX: 1.15,
            aspectY: 0.92,
            relaxIterations: 12,
            angleJitter: 0.15,
            positionJitter: 0.05,
            seed: 22
        }),
        committed: packStage({
            from: 7.5,
            to: 11.5,
            values: buildValues('committed', 28, 3),
            gapPx: 4,
            spiralStep: 3.8,
            paddingX: 0.2,
            paddingY: 4,
            aspectX: 1.35,
            aspectY: 0.9,
            relaxIterations: 12,
            angleJitter: 0.12,
            positionJitter: 0.04,
            seed: 33
        }),
        won: packStage({
            from: 11.5,
            to: 15.5,
            values: buildValues('won', 100, 4),
            gapPx: 4,
            spiralStep: 3.75,
            paddingX: 0.28,
            paddingY: 5,
            aspectX: 0.95,
            aspectY: 1.35,
            relaxIterations: 12,
            angleJitter: 0.2,
            positionJitter: 0.04,
            seed: 44
        })
    };
}

const packedData = {
    scoping: [],
    proposal: [],
    committed: [],
    won: []
};

Highcharts.chart('container', {
    chart: {
        type: 'bubble',
        events: {
            load() {
                const packedData = getPackedData(this);

                this.series[0].setData(packedData.scoping, false, false);
                this.series[1].setData(packedData.proposal, false, false);
                this.series[2].setData(packedData.committed, false, false);
                this.series[3].setData(packedData.won, false, false);
                this.redraw();
            },
            render() {
                const chart = this;
                const xAxis = chart.xAxis[0];
                const plotTop = chart.plotTop + 30;
                const plotBottom = chart.plotTop + chart.plotHeight;

                const funnelTop = pct =>
                    plotTop + (plotBottom - plotTop) * pct * 0.35;

                const funnelBottom = pct =>
                    plotBottom - (plotBottom - plotTop) * pct * 0.35;

                ['customBands', 'customLines', 'customLabels'].forEach(key => {
                    if (chart[key]) {
                        chart[key].forEach(el => el.destroy());
                    }
                    chart[key] = [];
                });

                const stages = [
                    { from: -0.5, to: 3.5, text: 'SCOPING' },
                    { from: 3.5, to: 7.5, text: 'PROPOSAL' },
                    { from: 7.5, to: 11.5, text: 'COMMITTED' },
                    { from: 11.5, to: 15.5, text: 'WON' }
                ];

                stages.forEach(({ from, to, text }, i) => {
                    const x1 = xAxis.toPixels(from, true);
                    const x2 = xAxis.toPixels(to, true);
                    const fracLeft = (from - totalMin) / totalRange;
                    const fracRight = (to - totalMin) / totalRange;

                    chart.customBands.push(
                        chart.renderer.path([
                            'M', x1, funnelTop(fracLeft),
                            'L', x2, funnelTop(fracRight),
                            'L', x2, funnelBottom(fracRight),
                            'L', x1, funnelBottom(fracLeft),
                            'Z'
                        ])
                            .attr({ zIndex: 0, class: 'funnel-band' })
                            .add()
                    );

                    chart.customBands.push(
                        chart.renderer.path([
                            'M', x1, funnelTop(fracLeft),
                            'L', x2, funnelTop(fracRight)
                        ])
                            .attr({
                                stroke: 'rgba(100,116,139,0.2)',
                                'stroke-width': 1,
                                zIndex: 1
                            })
                            .add()
                    );

                    chart.customBands.push(
                        chart.renderer.path([
                            'M', x1, funnelBottom(fracLeft),
                            'L', x2, funnelBottom(fracRight)
                        ])
                            .attr({
                                stroke: 'rgba(100,116,139,0.2)',
                                'stroke-width': 1,
                                zIndex: 1
                            })
                            .add()
                    );

                    if (i > 0) {
                        chart.customLines.push(
                            chart.renderer.path([
                                'M', x1, funnelTop(fracLeft),
                                'L', x1, funnelBottom(fracLeft)
                            ])
                                .attr({
                                    stroke: 'rgba(100,116,139,0.35)',
                                    'stroke-width': 1,
                                    'stroke-dasharray': '4,3',
                                    zIndex: 1
                                })
                                .add()
                        );
                    }

                    // eslint-disable-next-line max-len
                    const fracCenter = ((from + to) / 2 - totalMin) / totalRange;
                    const topY = funnelTop(fracCenter) - 10;

                    chart.customLabels.push(
                        chart.renderer.text(text, x1 + (x2 - x1) / 2, topY)
                            .attr({ zIndex: 5, align: 'center' })
                            .css({
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.04em',
                                color: 'var(--highcharts-neutral-color-60)'
                            })
                            .add()
                    );
                });
            }
        }
    },

    title: { text: '' },
    subtitle: { text: '' },

    legend: {
        enabled: true,
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'top',
        floating: true
    },

    xAxis: {
        min: totalMin,
        max: totalMax,
        gridLineWidth: 0,
        lineWidth: 0,
        tickWidth: 0,
        labels: {
            style: {
                color: 'transparent'
            }
        }
    },

    yAxis: {
        min: 0,
        max: 100,
        visible: false,
        startOnTick: false,
        endOnTick: false
    },

    tooltip: {
        headerFormat: '',
        pointFormat: '<b>{series.name}</b><br/>Value: ${point.z:.1f}K'
    },

    plotOptions: {
        bubble: {
            animation: false,
            minSize: 4,
            maxSize: maxBubbleSize,
            opacity: 0.82,
            fillOpacity: 0.5,
            marker: {
                lineColor: 'rgba(255,255,255,0.3)',
                lineWidth: 1
            },
            cursor: 'pointer'
        }
    },

    series: [
        { name: 'Scoping', color: '#9198F0', data: packedData.scoping },
        { name: 'Proposal', color: '#F7A85E', data: packedData.proposal },
        { name: 'Committed', color: '#6DDFA0', data: packedData.committed },
        { name: 'Won', color: '#10b981', data: packedData.won }
    ]
});