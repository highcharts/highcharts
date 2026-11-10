// The visual samples use all three products. Build them in order because the
// existing setup modules write to the same output directories.
await import('./setup-highcharts.mts');
await import('./setup-dashboards.mts');
