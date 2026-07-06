const regions = ['North', 'South', 'East', 'West', 'Central'];
const quarters = ['Q1', 'Q2', 'Q3'];
const metricsPerQuarter = 6;
const columnCount = regions.length * quarters.length * metricsPerQuarter;
const rowCount = 40;
const columns = {};
const header = regions.map((region, regionIndex) => ({
    format: region + ' region',
    columns: quarters.map((quarter, quarterIndex) => ({
        format: quarter,
        columns: Array.from({ length: metricsPerQuarter }, (
            _value,
            metricIndex
        ) => {
            const columnIndex =
                (regionIndex * quarters.length * metricsPerQuarter) +
                (quarterIndex * metricsPerQuarter) +
                metricIndex;

            return {
                columnId: 'metric-' + (columnIndex + 1),
                format: 'Metric ' + (metricIndex + 1)
            };
        })
    }))
}));

for (let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
    const columnId = 'metric-' + (columnIndex + 1);

    columns[columnId] = Array.from(
        { length: rowCount },
        (_value, rowIndex) => (
            ((rowIndex + 1) * (columnIndex + 3)) % 1000
        )
    );
}

Grid.grid('container', {
    data: {
        columns
    },
    header,
    columnDefaults: {
        width: 100
    },
    rendering: {
        columns: {
            strictWidths: true,
            virtualization: true
        },
        rows: {
            strictHeights: true
        }
    }
});
