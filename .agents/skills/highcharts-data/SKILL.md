---
name: highcharts-data
description: Highcharts core data configuration, loading, parsing, tabular mapping, compression, and live updates from the bundled docs.
---

# Highcharts Data

Use this for application work involving Highcharts series data, DataTables, the Data module, external data sources, custom preprocessing, data compression, and live updates.

## Workflow

1. Start with `references/docs/index.md` and select the matching working-with-data documentation.
2. Read the selected docs before coding; finish when every data source, mapping, parser, or update method you plan to use is covered by documentation or an API lookup.
3. Use direct `series.data` for ordinary series configuration, DataTables and `dataMapping` for structured or shared tabular data, and the Data module for CSV, HTML-table, or Google Spreadsheet sources.
4. For dynamic data, choose declarative Data module polling or chart API updates according to the required level of control.
5. Use the API reference only for exact option names, signatures, and defaults not covered by the selected documentation.
6. In React, use the documented `Data` component and pass data API options as props.

## Boundaries

- This skill covers core Highcharts data loading and processing, not Grid, Dashboards, Morningstar, or other product-specific connectors.
- For Stock-specific data grouping or product behavior, consult the relevant product documentation directly.
- For React wrapper behavior beyond the documented Data component, consult the React documentation directly.

## References

- Working with data: https://www.highcharts.com/docs/working-with-data/
- Data API reference: https://api.highcharts.com/highcharts/data
- React Data component: https://www.highcharts.com/docs/react/components/modules/data
- Highcharts React documentation: https://www.highcharts.com/docs/react/
