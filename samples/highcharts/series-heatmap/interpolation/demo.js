const
    mapData = [],
    h = 20,
    w = 25,
    maxClusterSize = 4;
let randomClusters = 300;

for (let i = 0; i < h; i++) {
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
    addIfWithin(y + i, x, heat);
    addIfWithin(y + i, x + i, heat);
    addIfWithin(y, x + i, heat);
};

const placeCluster = (x, y, size) => {
    addIfWithin(y, x, size);

    for (let i = 1; i <= size; i++) {
        const heat = size - i;
        clusterRegion(y, x, i, heat);
        clusterRegion(y, x, -i, heat);
        addIfWithin(y - i, x + i, heat);
        addIfWithin(y + i, x - i, heat);
    }
};

while (randomClusters--) {
    const
        clusterXPos = randomFloored(w),
        clusterYPos = randomFloored(h),
        clusterSize = randomFloored(maxClusterSize);

    placeCluster(clusterXPos, clusterYPos, clusterSize);
}

const points = mapData.map(
    (row, yIndex) => row.map(
        (heat, xIndex) => (
            { x: xIndex, y: yIndex, value: heat }
        )
    )
);

Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        plotBackgroundImage: 'https://code.highcharts.com/samples/graphics/heatmap-userdata-backgroundimage/exampleScreenshot.png'
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
            [0.32, '#00FFBC'],
            [0.64, '#C2FF00'],
            [0.96, '#FF0043']
        ]
    },
    series: [{
        colsize: 1,
        rowsize: 1,
        data: points.flat(1),
        interpolation: true,
        opacity: 0.8
    }]
});