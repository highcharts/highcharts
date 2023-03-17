const
    h = 25,
    w = 30,
    mapData = [];

for (let i = h; i; i--) {
    mapData.push(Array(w).fill(0));
}
const randomFloored = n => ~~(Math.random() * n);

const withinBound = (val, min, max) => val > min && val < max;

const addIfWithin = (y, x, heat) => {
    if (withinBound(x, -1, w) && withinBound(y, -1, h)) {
        mapData[y][x] += heat;
    }
};

const clusterRegion = (y, x, i, heat) => {
    const diagonalHeat = Math.max(heat - 2, 0);
    const adjacentHeat = Math.max(heat - 1, 0);
    addIfWithin(y + i, x + i, diagonalHeat);
    addIfWithin(y + i, x, adjacentHeat);
    addIfWithin(y, x + i, adjacentHeat);
};

const placeCluster = (x, y, size) => {
    addIfWithin(y, x, size);

    for (let i = 1; i <= size; i++) {
        const heat = size - i;
        clusterRegion(y, x, i, heat);
        clusterRegion(y, x, -i, heat);
        addIfWithin(y - i, x + i, Math.max(0, heat - 2));
        addIfWithin(y + i, x - i, Math.max(0, heat - 2));
    }
};

Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        plotBackgroundImage: 'https://code.highcharts.com/samples/graphics/heatmap-userdata-backgroundimage/exampleScreenshot.png',
        events: {
            load: function () {
                const heat = 8;
                let noise = 38;
                while (noise--) {
                    const x = randomFloored(w);
                    const y = randomFloored(h);

                    placeCluster(
                        ~~x,
                        ~~y,
                        randomFloored(6)
                    );
                }

                const hotSpots = [
                    { // HighCharts Logo
                        xStart: 1,
                        xEnd: (w / 6),
                        yStart: h - 3,
                        yEnd: h - 2,
                        clusters: 28
                    },
                    { // Navbar buttons
                        xStart: (w / 2) + 2,
                        xEnd: w,
                        yStart: h - 3,
                        yEnd: h - 1,
                        clusters: 32
                    },
                    { // "Jump to accessibility"
                        xEnd: (w / 3),
                        xStart: (w / 5),
                        yStart: (h / 2) - (h / 9),
                        yEnd: (h / 2),
                        clusters: 28
                    }
                ];

                hotSpots.forEach(hot => {
                    const { xStart, xEnd, yStart, yEnd, clusters } = hot;

                    for (let i = 0; i < clusters; i++) {
                        const x = randomFloored(xEnd - xStart) + xStart;
                        const y = randomFloored(yStart - yEnd) + yEnd;

                        placeCluster(
                            ~~x,
                            ~~y,
                            randomFloored(heat)
                        );
                    }
                });

                const points = mapData.map(
                    (row, yIndex) => row.map(
                        (heat, xIndex) => (
                            { x: xIndex, y: yIndex, value: heat }
                        )
                    )
                ).flat(1);

                this.addSeries({
                    data: points,
                    interpolation: true,
                    opacity: 0.7
                });
            }
        }
    },
    title: {
        text: 'Heatmap displaying user activity on a website'
    },
    yAxis: {
        title: {
            text: undefined
        },
        visible: false
    },
    colorAxis: {
        stops: [
            [0, '#3D00FF'],
            [0.24, '#00FFBC'],
            [0.48, '#C2FF00'],
            [0.72, '#FF0043']
        ]
    }
});