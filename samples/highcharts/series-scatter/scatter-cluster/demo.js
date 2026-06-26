Highcharts.setOptions({
    palette: {
        colors: [
            '#000000', '#e41a1c', '#377eb8', '#4daf4a',
            '#984ea3', '#ff7f00', '#ffff33', '#a65628'
        ],
        dark: {
            colors: [
                '#ffffff', '#f94043', '#619ccc', '#77d573',
                '#d17bde', '#ff7f00', '#ffff33', '#9e6849'
            ]
        }
    }
});

function drawChart(dataset, clusterIds) {

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            height: '100%',
            animation: false
        },
        title: {
            text: 'Scatterplot with clusters'
        },
        xAxis: {
            gridLineWidth: 1,
            tickWidth: 0
        },

        yAxis: {
            lineWidth: 1,
            minPadding: 0,
            maxPadding: 0,
            title: {
                text: null
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 2.5,
                    symbol: 'circle'
                },
                states: {
                    hover: {
                        enabled: false
                    }
                },
                animation: false
            }
        },
        series: [
            {
                type: 'scatter',
                data: dataset.map((point, i) => ({
                    x: point[0],
                    y: point[1],
                    color: Highcharts.getOptions().colors[clusterIds[i]]
                }))
            }
        ]
    });
}


// Squared Euclidean distance
function distance(a, b) {
    return a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0);
}

// Element-wise mean of a set of points
function centroid(points) {
    const dims = points[0].length;
    return points.reduce(
        (acc, p) => acc.map((val, i) => val + p[i] / points.length),
        new Array(dims).fill(0)
    );
}

// Index of the centroid nearest to the given point
function nearest(point, centroids) {
    let best = 0;
    centroids.forEach((c, i) => {
        if (distance(point, c) < distance(point, centroids[best])) {
            best = i;
        }
    });
    return best;
}

function kmeans(dataset, k, maxIterations = 100) {
    // Initialise centroids with k randomly chosen, distinct data points
    const centroids = [...dataset]
        .sort(() => Math.random() - 0.5)
        .slice(0, k);

    let assignments = dataset.map(point => nearest(point, centroids));

    for (let iter = 0; iter < maxIterations; iter++) {
        const current = assignments;

        // Recompute each centroid as the mean of its assigned points
        centroids.forEach((_, i) => {
            const members = dataset.filter((_, j) => current[j] === i);
            if (members.length) {
                centroids[i] = centroid(members);
            }
        });

        // Reassign points; stop once no assignment changes
        assignments = dataset.map(point => nearest(point, centroids));
        if (assignments.every((id, i) => id === current[i])) {
            break;
        }
    }

    return { centroids, assignments: assignments.map(id => id + 1) };
}

// Indices of all points within distance eps of the given point
function neighbours(dataset, point, eps) {
    return dataset.reduce((acc, other, i) => {
        if (distance(point, other) <= eps ** 2) {
            acc.push(i);
        }
        return acc;
    }, []);
}

// Density-based clustering. Clusters are numbered from 1, outliers keep ID 0
function dbscan(dataset, eps, minPts) {
    const assignments = new Array(dataset.length).fill(0);
    const visited = new Array(dataset.length).fill(false);
    let cluster = 0;

    dataset.forEach((point, i) => {
        if (visited[i]) {
            return;
        }
        visited[i] = true;

        const seeds = neighbours(dataset, point, eps);
        if (seeds.length < minPts) {
            return; // Too sparse — leave as an outlier
        }

        // Grow a new cluster, expanding through density-reachable points
        cluster++;
        assignments[i] = cluster;
        for (let s = 0; s < seeds.length; s++) {
            const j = seeds[s];
            if (!visited[j]) {
                visited[j] = true;
                const more = neighbours(dataset, dataset[j], eps);
                if (more.length >= minPts) {
                    seeds.push(...more);
                }
            }
            if (assignments[j] === 0) {
                assignments[j] = cluster;
            }
        }
    });

    return { assignments };
}

// Agglomerative hierarchical clustering using Ward's method.
// This uses the nearest-neighbour chain algorithm, which produces
// the merges in O(n^2). Stops once k clusters remain
function hierarchical(dataset, k) {
    // Active clusters: centroid, size and members. Slots are set to null as
    // clusters get merged away
    const clusters = dataset.map((point, i) => ({
        centroid: point,
        size: 1,
        members: [i]
    }));
    let active = clusters.length;

    // Ward merge cost: the increase in within-cluster variance
    function ward(a, b) {
        return (a.size * b.size) / (a.size + b.size) *
            distance(a.centroid, b.centroid);
    }

    // Nearest active cluster to `from` (by Ward cost), and that cost
    function nearest(from) {
        let best = -1;
        let cost = Infinity;
        clusters.forEach((c, i) => {
            if (i !== from && c && ward(clusters[from], c) < cost) {
                cost = ward(clusters[from], c);
                best = i;
            }
        });
        return best;
    }

    const chain = [];
    while (active > k) {
        if (chain.length === 0) {
            chain.push(clusters.findIndex(Boolean));
        }

        const top = chain[chain.length - 1];
        const nn = nearest(top);

        // A reciprocal nearest pair (nn points back to the previous link) is
        // guaranteed to be a correct Ward merge, so merge them
        if (chain.length >= 2 && nn === chain[chain.length - 2]) {
            chain.pop();
            chain.pop();

            const a = clusters[top];
            const b = clusters[nn];
            const size = a.size + b.size;
            clusters[top] = {
                centroid: a.centroid.map(
                    (val, i) => (val * a.size + b.centroid[i] * b.size) / size
                ),
                size,
                members: a.members.concat(b.members)
            };
            clusters[nn] = null;
            active--;
        } else {
            chain.push(nn);
        }
    }

    // Label each point with its final cluster
    const assignments = new Array(dataset.length);
    clusters.filter(Boolean).forEach((cluster, id) => cluster.members.forEach(
        i => {
            assignments[i] = id + 1;
        }
    ));

    return { assignments };
}

let datasets;
let clusterIds;

// Redraw chart based on the selected dataset and clustering algorithm.
function udc() {
    let dataset;
    const d = Number(document.getElementById('datasetSelector').value);
    switch (d) {
    case 0:
        dataset = 'engytime';
        break;
    case 1:
        dataset = 'ds577';
        break;
    case 2:
        dataset = 'pathbased';
        break;
    default:
        break;
    }
    const clustering =
    Number(document.getElementById('clusteringSelector').value);
    drawChart(datasets[dataset], clusterIds[d][clustering]);
}

fetch('https://www.highcharts.com/samples/data/cluster-data.json')
    .then(response => response.json())
    .then(data => {
        datasets = data;

        // IDs determining the cluster of each point in the dataset.
        // Every dataset requires hyperparameter tuning. Here the
        // hyperparameters are tuned to best show the differences between the
        // different clustering algorithms.
        const engykmeansId = kmeans(datasets.engytime, 2).assignments;
        const engydbScanId = dbscan(datasets.engytime, 0.2, 10).assignments;
        const engyHierId = hierarchical(datasets.engytime, 2).assignments;
        const dskmeansId = kmeans(datasets.ds577, 3).assignments;
        const dsdbScanId = dbscan(datasets.ds577, 0.3, 5).assignments;
        const dsHierId = hierarchical(datasets.ds577, 3).assignments;
        const pathkmeansId = kmeans(datasets.pathbased, 3).assignments;
        const pathdbScanId = dbscan(datasets.pathbased, 2, 10).assignments;
        const pathHierId = hierarchical(datasets.pathbased, 3).assignments;

        clusterIds = [
            [engykmeansId, engydbScanId, engyHierId],
            [dskmeansId, dsdbScanId, dsHierId],
            [pathkmeansId, pathdbScanId, pathHierId]
        ];

        udc();
    });