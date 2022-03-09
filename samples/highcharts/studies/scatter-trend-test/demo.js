/* eslint-disable max-len */

function getSeriesDataMetrics(series) {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
    let i = series.data.length;
    while (i--) {
        const p = series.data[i];
        xMin = p.x < xMin ? p.x : xMin;
        xMax = p.x > xMax ? p.x : xMax;
        yMin = p.y < yMin ? p.y : yMin;
        yMax = p.y > yMax ? p.y : yMax;
    }
    return {
        xMin,
        xMax,
        yMin,
        yMax,
        numPoints: series.data.length
    };
}

function getBinnedData(data, dataMetrics, numBins) {
    const binStart = dataMetrics.xMin;
    const xDiff = dataMetrics.xMax - binStart;
    const binXSize = xDiff / numBins;
    const binMaxIx = numBins - 1;

    const bins = [];
    for (let i = 0; i < numBins; ++i) {
        bins.push({
            binStart: binStart + binXSize * i,
            numPoints: 0,
            minY: Infinity,
            maxY: -Infinity
        });
    }

    data.forEach(point => {
        const binIx = Math.min(binMaxIx, Math.floor((point.x - binStart) / binXSize));
        bins[binIx].numPoints++;
        bins[binIx].maxY = Math.max(bins[binIx].maxY, point.y);
        bins[binIx].minY = Math.min(bins[binIx].minY, point.y);
    });

    return bins;
}

function getRefinedBinPoints(binnedData, dataMetrics, detail) {
    const dataSpan = dataMetrics.yMax - dataMetrics.yMin;
    const detailModifier = Math.sqrt(detail);
    let binPoints = [];
    let carryMod = 0;
    binnedData.forEach((bin, ix) => {
        const nextBin = binnedData[ix + 1];
        const binSpreadRatio = (bin.maxY - bin.minY) / dataSpan;
        const binPointRatio = bin.numPoints / dataMetrics.numPoints;

        let mod = carryMod;
        if (bin.numPoints < 1) {
            mod = -1; // expand bin by removing bin point
        } else {
            // Determine add/remove by a points system
            if (binPointRatio < 0.03 / detailModifier) {
                mod -= 2;
            } else if (binPointRatio < 0.05 / detailModifier) {
                mod -= 1;
            } else if (binPointRatio > 0.30 / detailModifier) {
                mod += 2;
            } else if (binPointRatio > 0.18 / detailModifier) {
                mod += 1;
            }
            if (binSpreadRatio < 0.05 / detailModifier) {
                mod -= 2;
            } else if (binSpreadRatio < 0.15 / detailModifier) {
                mod -= 1;
            } else if (binSpreadRatio > 0.35 / detailModifier) {
                mod += 2;
            } else if (binSpreadRatio > 0.25 / detailModifier) {
                mod += 1;
            }
        }

        if (
            mod < 0 &&
            (ix === 0 || !nextBin) // Always include last & first
        ) {
            carryMod = mod;
            binPoints.push(bin.binStart);
        } else {
            carryMod = 0;
        }

        if (mod >= 0) {
            binPoints.push(bin.binStart);
        }

        if (mod > 0) {
            const nextStart = nextBin ? nextBin.binStart : dataMetrics.xMax;
            binPoints.push((bin.binStart + nextStart) / 2);
        }
    });

    // Override to at least have 4 points if needed
    if (binnedData.length > 3 && binPoints.length < 5) {
        binPoints = [
            binnedData[0].binStart,
            binnedData[Math.floor(binnedData.length / 3)].binStart,
            binnedData[Math.floor(binnedData.length / 3) * 2].binStart,
            binnedData[binnedData.length - 1].binStart
        ];
    }

    return binPoints;
}

function binDataBySegments(binPoints, data, dataMetrics) {
    const bins = [];
    binPoints.forEach(binPoint => {
        if (bins[bins.length - 1]) {
            bins[bins.length - 1].end = binPoint;
        }
        bins.push({
            start: binPoint,
            yData: []
        });
    });
    if (bins[bins.length - 1]) {
        bins[bins.length - 1].end = dataMetrics.xMax;
    }

    function getBinIx(point) {
        const x = point.x;
        let n = bins.length;
        while (n--) {
            if (x >= bins[n].start && x <= bins[n].end) {
                return n;
            }
        }
        return 0;
    }

    let i = data.length;
    while (i--) {
        const point = data[i];
        const binIx = getBinIx(point);
        bins[binIx].yData.push(point.y);
    }

    return bins;
}

function getTrendDataForSeries(series, detail, seriesMetrics, regularIntervals) {
    if (series.points.length < 5) {
        return series.points.slice(0);
    }

    const numInitialBins = Math.max(3, Math.round(10 * detail));
    const numInitialBinsRegularInterval = numInitialBins + Math.ceil(detail * detail);
    const initialBins = getBinnedData(
        series.points, seriesMetrics, regularIntervals ? numInitialBinsRegularInterval : numInitialBins
    );
    const binPoints = regularIntervals ?
        initialBins.map(b => b.binStart) : getRefinedBinPoints(initialBins, seriesMetrics, detail);

    const binnedData = binDataBySegments(binPoints, series.points, seriesMetrics);
    const avg = arr => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
    const trendData = [];

    binnedData.forEach(bin => {
        if (bin.yData.length) {
            trendData.push({
                x: (bin.end - bin.start) / 2 + bin.start,
                y: avg(bin.yData),
                numPoints: bin.yData.length
            });
        }
    });

    return trendData;
}

function updateTrends(chart, detail, regularIntervals) {
    chart.series.forEach(series => {
        const seriesMetrics = getSeriesDataMetrics(series);
        const data = getTrendDataForSeries(series, detail, seriesMetrics, regularIntervals);

        chart.addSeries({
            data,
            color: '#222',
            type: 'spline',
            name: 'Trend line for ' + series.name,
            marker: {
                enabled: true,
                fillColor: '#4c4',
                lineColor: '#000'
            },
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        if (point.index !== 0) {
                            point.graphic.element.setAttribute('aria-hidden', true);
                        }
                        return 'Trend line';
                    }
                }
            }
        });
    });
    chart.redraw();
}

// -------------------------------------------------------------------------------------------------------------------

const chart = Highcharts.chart('chart', {
    chart: {
        type: 'scatter'
    },
    title: {
        text: null
    },
    tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.90)'
    },
    legend: {
        enabled: false
    },
    xAxis: {
        crosshair: {
            enabled: true
        },
        visible: false
    },
    yAxis: {
        visible: false
    },
    plotOptions: {
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            },
            animation: false
        }
    }
});

function distanceToLine(pointX, pointY, lineX1, lineY1, lineX2, lineY2) {
    const A = pointX - lineX1,
        B = pointY - lineY1,
        C = lineX2 - lineX1,
        D = lineY2 - lineY1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;
    if (param < 0) {
        xx = lineX1;
        yy = lineY1;
    } else if (param > 1) {
        xx = lineX2;
        yy = lineY2;
    } else {
        xx = lineX1 + param * C;
        yy = lineY1 + param * D;
    }

    var dx = pointX - xx;
    var dy = pointY - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function getAverageDistanceToLine(points, linePoints) {
    let totalDist = 0;
    points.forEach(point => {
        let dist = Infinity;

        // Go through line segments
        for (let i = 0, len = linePoints.length; i < len - 1; ++i) {
            const linePoint = linePoints[i];
            const nextLinePoint = linePoints[i + 1];
            if (linePoint && nextLinePoint) {
                const curDist = distanceToLine(
                    point.plotX, point.plotY, linePoint.plotX, linePoint.plotY, nextLinePoint.plotX, nextLinePoint.plotY
                );
                dist = Math.min(dist, curDist);
            }
        }

        if (dist !== Infinity) {
            totalDist += dist;
        }
    });

    return totalDist / points.length;
}

function updateADL() {
    const adl = getAverageDistanceToLine(chart.series[0].points, chart.series[1].points);
    const maxDistance = chart.plotHeight;
    const adlPct = adl / maxDistance * 100;
    const adlText = `${adlPct.toFixed(2)}% ADL`;
    document.getElementById('output').textContent = adlText;
    document.getElementById('history').innerHTML = adlText + '<br>' + document.getElementById('history').innerHTML;

    return adlPct;
}

function getRandomProfile() {
    const profiles = [
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [5, 4, 3, 4, 5, 6, 7, 6, 5, 4],
        [9, 8, 6, 4, 2, 2, 3, 2, 3, 4],
        [9, 9, 9, 2, 1, 6, 6, 7, 8, 4],
        [9, 7, 3, 3, 4, 5, 7, 9, 3, 3],
        [1, 1, 2, 3, 4, 4, 3, 2, 7, 8],
        [0, 1, 0, 1, 1, 1, 2, 3, 3, 4],
        [8, 2, 2, 2, 1, 1, 4, 7, 8, 9],
        [0, 0, 2, 2, 1, 1, 4, 3, 2, 3],
        [0, 3, 2, 5, 1, 8, 9, 8, 7, 7],
        [1, 3, 2, 7, 7, 8, 9, 6, 6, 4],
        [4, 4, 2, 4, 6, 8, 7, 7, 6, 4],
        [6, 4, 2, 0, 9, 9, 0, 9, 0, 9],
        [0, 9, 0, 9, 9, 9, 0, 9, 0, 9],
        [5, 6, 6, 5, 0, 5, 5, 5, 6, 5]
    ];

    // Add random profiles
    for (let i = 0; i < 10; ++i) {
        const randomProfile = [];
        for (let y = 0; y < 10; ++y) {
            randomProfile.push(Math.floor(Math.random() * 10));
        }
        profiles.push(randomProfile);
    }

    return profiles[
        Math.round(Math.random() * (profiles.length - 1))
    ];
}

function getRandomData() {
    const profile = getRandomProfile();
    const numberRangeSelections = [5, 30, 400, 2000];
    const numberRange = numberRangeSelections[Math.round(Math.random() * (numberRangeSelections.length - 1))];
    const numPointsPerSegment = Math.round(Math.random() * numberRange + 2) / profile.length;
    const randomData = [];

    profile.forEach((profilePoint, profilePointIx) => {
        const numPoints = numPointsPerSegment - Math.random() * (numPointsPerSegment / 2);
        const ySpread = Math.random() * 10;

        for (let i = 0; i < numPoints; ++i) {
            const x = profilePointIx * 10 - 10 + Math.random() * 20;
            const y = profilePoint - ySpread / 2 + Math.random() * ySpread;
            randomData.push([x, y]);
        }
    });

    return randomData;
}

function randomize() {
    chart.update({
        series: [{
            name: 'Random data',
            data: getRandomData()
        }]
    }, true, true, false);

    updateTrends(chart, 1, false);
    return updateADL();
}

let stop = true;
document.getElementById('randomize').onclick = randomize;
document.getElementById('simulation').onclick = function () {
    if (!stop) {
        stop = true;
        this.textContent = 'Run simulation';
        return;
    }

    this.textContent = 'Stop simulation';
    stop = false;
    let adlTotal = 0;
    let numSimulations = 0;
    function recurse() {
        setTimeout(() => {
            if (stop) {
                const avgADL = (adlTotal / numSimulations).toFixed(2);
                document.getElementById('output').innerHTML = `Average after ${numSimulations} plots:<br>${avgADL}% ADL`;
            } else {
                adlTotal += randomize();
                numSimulations++;
                recurse();
            }
        }, parseFloat(document.getElementById('delay').value));
    }
    recurse();
};

randomize();
