// Prepare the data

export function getDataTableOptions(n: number) {
    const xColumn = new Float64Array(n),
        yColumn = new Float64Array(n);

    // Generate and position the datapoints in a tangent wave pattern
    for (let i = 0; i < n; i += 1) {
        const theta = Math.random() * 2 * Math.PI;
        const radius = Math.pow(Math.random(), 2) * 100;

        const waveDeviation = (Math.random() - 0.5) * 70;
        const waveValue = Math.tan(theta) * waveDeviation;

        xColumn[i] = 50 + (radius + waveValue) * Math.cos(theta);
        yColumn[i] = 50 + (radius + waveValue) * Math.sin(theta);
    }

    return {
        columns: {
            x: xColumn,
            y: yColumn
        }
    };
}
