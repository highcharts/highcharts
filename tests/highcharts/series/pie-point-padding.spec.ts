import { test, expect, createChart } from '~/fixtures.ts';

function getRenderedPointGapDistance(chart: any) {
    return chart.evaluate((c: any) => {
        const [series] = c.series as [any];
        const [firstPoint, secondPoint] = series.points;
        const p1PathArray = firstPoint.graphic?.pathArray;
        const p2PathArray = secondPoint.graphic?.pathArray;

        if (!p1PathArray || !p2PathArray) {
            throw new Error('Missing point path arrays.');
        }

        const getCommandIndices = (
            pathArray: any[],
            command: string
        ): number[] =>
            pathArray
                .map((segment, index) => (
                    Array.isArray(segment) && segment[0] === command ?
                        index :
                        -1
                ))
                .filter(index => index >= 0);

        const p1LineIndex = getCommandIndices(p1PathArray, 'L')[0];
        if (typeof p1LineIndex !== 'number' || p1LineIndex < 1) {
            throw new Error('Cannot find p1 edge line.');
        }

        const p1PrevArc = p1PathArray[p1LineIndex - 1];
        const p1Line = p1PathArray[p1LineIndex];
        if (!Array.isArray(p1PrevArc) || !Array.isArray(p1Line)) {
            throw new Error('Invalid p1 segments near edge line.');
        }

        const p2ArcIndices = getCommandIndices(p2PathArray, 'A');
        const p2FirstMoveIndex = getCommandIndices(p2PathArray, 'M')[0];
        const p2LastArcIndex = p2ArcIndices[p2ArcIndices.length - 1];
        if (
            typeof p2FirstMoveIndex !== 'number' ||
            typeof p2LastArcIndex !== 'number'
        ) {
            throw new Error('Cannot find p2 edge segments.');
        }

        const p2FirstMove = p2PathArray[p2FirstMoveIndex];
        const p2LastArc = p2PathArray[p2LastArcIndex];
        if (!Array.isArray(p2FirstMove) || !Array.isArray(p2LastArc)) {
            throw new Error('Invalid p2 segments near edge line.');
        }

        const line1Outer = { x: Number(p1PrevArc[6]), y: Number(p1PrevArc[7]) };
        const line1Inner = { x: Number(p1Line[1]), y: Number(p1Line[2]) };
        const line2Outer = {
            x: Number(p2FirstMove[1]),
            y: Number(p2FirstMove[2])
        };
        const line2Inner = { x: Number(p2LastArc[6]), y: Number(p2LastArc[7]) };

        const createEdge = (
            outer: { x: number; y: number },
            inner: { x: number; y: number }
        ) => {
            const dx = inner.x - outer.x;
            const dy = inner.y - outer.y;
            const length = Math.hypot(dx, dy);

            if (!length) {
                throw new Error('Edge line has zero length.');
            }

            return {
                outer,
                dx,
                dy,
                length
            };
        };

        const edge1 = createEdge(line1Outer, line1Inner);
        const edge2 = createEdge(line2Outer, line2Inner);
        const maxComparableOffset = Math.max(
            0,
            Math.min(edge1.length, edge2.length) - 1
        );
        const offsets = [0, 10, 30, 50]
            .filter(offset => offset <= maxComparableOffset);

        if (!offsets.length) {
            throw new Error('No valid offsets for edge comparison.');
        }

        const pointAtOffset = (edge: any, offset: number) => {
            const t = offset / edge.length;
            return {
                x: edge.outer.x + edge.dx * t,
                y: edge.outer.y + edge.dy * t
            };
        };

        const comparisons = offsets.map(offset => {
            const p1 = pointAtOffset(edge1, offset);
            const p2 = pointAtOffset(edge2, offset);

            return {
                offset,
                measured: Math.hypot(p2.x - p1.x, p2.y - p1.y)
            };
        });

        return {
            comparisons
        };
    });
}

test.describe('series/pie-point-padding', () => {
    const cases = [
        {
            name: 'pie',
            pointPadding: 10,
            series: {
                data: [6, 4, 3, 5]
            }
        },
        {
            name: 'donut',
            pointPadding: 4,
            series: {
                data: [15, 3, 8, 5],
                innerSize: '40%'
            }
        },
        {
            name: 'pie with border radius',
            pointPadding: 12,
            series: {
                data: [6, 5, 1, 2, 4, 2, 26, 1],
                borderRadius: '20%'
            }
        },
        {
            name: 'donut with border radius',
            pointPadding: 16,
            series: {
                data: [30, 2, 8, 5],
                innerSize: '10%',
                borderRadius: '10%'
            }
        },
        {
            name: 'donut with no padding',
            pointPadding: 0,
            series: {
                data: [15, 3, 8, 5],
                innerSize: '40%'
            }
        },
        {
            name: 'pie large pointPadding',
            pointPadding: 30,
            series: {
                data: [6, 4, 5]
            }
        }
    ];

    for (const testCase of cases) {
        test(`distance between adjacent points for ${testCase.name} matches pointPadding`, async ({ page }) => {
            const chart = await createChart(
                page,
                {
                    chart: {
                        animation: false,
                        width: 600,
                        height: 400
                    },
                    series: [{
                        type: 'pie',
                        animation: false,
                        pointPadding: testCase.pointPadding,
                        ...testCase.series
                    }]
                }
            );

            const result = await getRenderedPointGapDistance(chart);
            for (const comparison of result.comparisons) {
                const difference = comparison.measured - testCase.pointPadding;

                expect(
                    difference,
                    `offset ${comparison.offset}px: difference <= 0.4`
                ).toBeLessThanOrEqual(0.4);
            }
        });
    }
});
