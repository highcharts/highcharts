# Migration Guide: Dashboards 4.0.0, Grid Lite 2.0.0 & Grid Pro 2.0.0

## Quick Start - Critical Changes

Before diving into the detailed migration guide, here are the most critical breaking changes:

- **Grid Pro (DataGrid) is now a separate package** - must be installed and imported independently
- **Columns use IDs instead of names** - update all `getColumnNames()` to `getColumnIds()`
- **Components must use `renderTo`** - the `cell` option has been removed
- **Replace `getJSON()` with `getData()`** - for Grid Lite and Grid Pro users
- **Connector options are flattened** - move nested `options` content to top level
- **`table.modified` is now `table.getModified()`** - property replaced with method
- **`.highcharts-datagrid-` is now `.hcg-`** - replace all occurrences in CSS overrides

## Overview

This guide covers breaking changes when upgrading to the following versions:

|Product|From|To|
|---|---|---|
|Dashboards|3.6.0|4.0.0|
|Grid Lite|1.4.0|2.0.0|
|Grid Pro (DataGrid)|(bundled with Dashboards)|2.0.0 (standalone)|

**Key Change:** Grid Pro (formerly DataGrid) is now distributed as a separate package. In versions prior to Dashboards 4.0.0, Grid Pro was bundled with Dashboards.

## Who This Affects

- **Dashboards + Grid Pro users**: Follow sections 1, 2, and 4
- **Dashboards only users**: Follow sections 1 and 2
- **Grid Lite users**: Follow sections 1 and 3
- **Grid Pro standalone users**: Follow sections 1 and 4

---

## 1. Data Layer Breaking Changes

These changes apply to users of the Data Layer (standalone or within Dashboards). Grid-only users who don't use the Data Layer can skip this section.

### Column Identifiers: Names → IDs

**What changed:** All column references now use IDs instead of names.

**Migration steps:**
- Replace `getColumnNames()` with `getColumnIds()`
- Update event handlers that used `columnName` to use `columnId` or `columnIds`
- Change any code iterating over `table.columns` by name to use IDs

**Example:**
```javascript
// Before
const names = table.getColumnNames();
table.on('afterSetColumns', (e) => {
  console.log(e.columnName);
});

// After
const ids = table.getColumnIds();
table.on('afterSetColumns', (e) => {
  console.log(e.columnIds);
});
```

**Common error:** If you see `columnName is undefined` in your console, you need to replace it with `columnId`.

### DataTable.modified Property

**What changed:** To retrieve the modified table, use the `getModified()` method. While the old `modified` property is still available, it's not defined when the table hasn't been modified (the `getModified()` method results in a reference to the original, non-modified table in such cases).

**Migration steps:**
- Replace `table.modified` with `table.getModified()` if you want to keep the old way of functioning
- Remove references to `DataTable.NULL` and `DataTable.isNull()` (both removed)
- Use empty-object checks instead of null-row helpers

**Note:** When a table is not modified, it no longer has the `modified` field defined. In such cases, `getModified()` returns a reference to the table itself.

**Example:**
```javascript
// Before
const modifiedData = table.modified;

// After
const modifiedData = table.getModified();
```

**Common error:** If you see `Cannot read property 'modified' of undefined`, replace `table.modified` with `table.getModified()`.

### Data Connector Options Flattening

**What changed:** Connector configurations no longer nest options in a sub-object.

**Migration steps:**
- Move nested `options` content to the top level
- Ensure each connector has `id` and `type` at the top level
- Update `dataTables` array format

**Example:**
```javascript
// Before
dataPool: {
  connectors: [{
    id: 'my-connector',
    type: 'CSV',
    options: {
      csv: `Product,Price
            Apples,1.5
            Oranges,2.0`,
      // ... other options
    },
    dataTables: [{
      key: 'myTable'
      // ... table options
    }]
  }]
}

// After
dataPool: {
  connectors: [{
    id: 'my-connector',
    type: 'CSV',
    csv: `Product,Price
          Apples,1.5
          Oranges,2.0`,
    // ... other options
    dataTables: [{
      key: 'myTable'
      // ... table options
    }]
  }]
}
```

**Common error:** If your connector fails to load or you see `options is not recognized`, you need to flatten your connector configuration.

### DataConnector API Changes

**What changed:** Several properties and methods were removed or renamed.
Connector events now only expose external payloads. Internal
objects such as the parsed DataTable instances are no longer included
(`e.tables`)—grab them from the connector itself (`connector.getTable()`,  `connector.dataTables`) instead.

**Migration steps:**
- Replace `connector.table` with `connector.getTable()`
- Remove calls to `connector.save()` and `connector.whatIs()` (removed)
- Remove uses of `e.tables` in events

**Common error:** If you see `connector.table is undefined`, replace it with `connector.getTable()`.

### Data Modifier Simplification

**What changed:** Incremental modification hooks removed.

**Migration steps:**
- Consolidate all modifier logic into `modifyTable()` method
- Remove implementations of `modifyRows()`, `modifyColumns()`, and `modifyCell()`
- Ensure `modifyTable()` returns the modified table

### DataConverter Updates

**What changed:** Helper methods moved to DataConverterUtils, the type guessing API changed, and custom converters must now return column collections instead of DataTables.

**Migration steps:**

1. **Rename Helper Usage**
   - `converter.asGuessedType(value)` → `converter.convertByType(value)`
   - Use helpers from `DataConverterUtils` namespace (e.g., `DataConverterUtils.trim()`, `DataConverterUtils.asNumber()`)

2. **Update Custom Connectors/Converters**
   - `DataConverter.getTable()` was removed
   - `DataConnector.CreateConverterFunction` no longer receives the `DataTable` as an argument

**Code Example:**

**Before (3.6):**
```javascript
const converter = new CustomConverter(table);
converter.parse(payload);
table.setColumns(converter.getTable().getColumns());
```

**After (4.0):**
```javascript
const converter = new CustomConverter();
const columns = converter.parse(payload); // returns DataTable.ColumnCollection
table.setColumns(columns);
```

**Common error:** If you see `converter.getTable is not a function`, you need to update your converter to return columns directly.

---

## 2. Dashboards 4.0.0 Breaking Changes

### Component Rendering

**What changed:** The deprecated `cell` option is now removed; components must use `renderTo`.

**Migration steps:**
- Replace all `cell` options with `renderTo`
- Update component configurations to explicitly specify render targets
- Remove any code relying on implicit cell fallback

**Example:**
```javascript
// Before
component: {
  type: 'Highcharts',
  cell: 'chart-cell'
}

// After
component: {
  type: 'Highcharts',
  renderTo: 'chart-cell'
}
```

**Common error:** If your components fail to render or you see `cell is not a valid option`, replace `cell` with `renderTo`.

### Column Assignment for Components

**What changed:** The deprecated `components[].columnAssignment` option has been removed.

**Migration steps:**
- Move any component-level column assignment to `components[].connector.columnAssignment`
- The connector-level `columnAssignment` option remains available and unchanged

**Note:** This only affects the deprecated component-level option. The commonly used `components[].connector.columnAssignment` is still fully supported.

**Example:**
```javascript
// Before (deprecated)
component: {
  type: 'Highcharts',
  columnAssignment: {
    // ... mappings
  }
}

// After (use connector-level option)
component: {
  type: 'Highcharts',
  connector: {
    columnAssignment: {
      // ... mappings
    }
  }
}
```

**Common error:** If you see `columnAssignment is not recognized at component level`, move it to `connector.columnAssignment`.

### Component-Connector Integration

**What changed:** Connector load events and table access patterns changed.

**Migration steps:**
- Remove listeners for `e.tables` in connector load events
- Use component events: `component.emit({ type: 'tableChanged' })`
- Access tables via `connector.getTable().getModified()`
- Use `DataConverterUtils` helpers when patching connector tables

---

## 3. Grid Lite 2.0.0 Breaking Changes

### Column Resizing API

**What changed:** `ColumnDistribution` replaced with `ColumnResizing` and new mode system.

**Migration steps:**
- Replace `Highcharts.DataGrid.ColumnDistribution` with `Highcharts.DataGrid.ColumnResizing`
- Update `rendering.columns.distribution` to `rendering.columns.resizing.mode`
- Map old values to new modes:
    - `fixed` → `distributed` (only updates the dragged column)
    - `mixed` → `adjacent` (resizes the column plus its neighbor)
    - `full` → No direct equivalent (widths no longer maintained as shared percentages)
        - **Recommendation**: Use `adjacent` or `distributed` mode and remove any CSS column width settings, as column widths are now fully managed by JavaScript

**Example:**
```javascript
// Before (old 'mixed' strategy)
gridOptions: {
  rendering: {
    columns: {
      distribution: 'mixed'
    }
  }
}

// After
gridOptions: {
  rendering: {
    columns: {
      resizing: {
        mode: 'adjacent'
      }
    }
  }
}
```

**Common error:** If you see `distribution is not a valid option`, replace it with `resizing.mode`.

### Grid Data Export

**What changed:** `getJSON()` removed; `getData()` signature changed.

**Migration steps:**
- Replace all `grid.getJSON()` calls with `grid.getData()`
- Use `grid.getData(false)` when raw/unmodified table data is needed
- Use `grid.getData(true)` (or `grid.getData()`) for formatted JSON (default)

**Example:**
```javascript
// Before
const data = grid.getJSON();

// After
const data = grid.getData(); // formatted by default
const rawData = grid.getData(false); // unmodified
```

**Common error:** If you see `grid.getJSON is not a function`, replace it with `grid.getData()`.

---

## 4. Grid Pro 2.0.0 Breaking Changes

### Separate Package Installation

**What changed:** Grid Pro is now distributed as a separate package.

**Migration steps:**

**For standalone Grid Pro users:**

1. Install Grid Pro:
    
    ```bash
    npm install @highcharts/grid-pro
    ```
    
2. Import in your project:

    **Option A - ESM (recommended for modern bundlers):**

    ```javascript
    import Grid from '@highcharts/grid-pro/es-modules/masters/grid-pro.src.js';
    import '@highcharts/grid-pro/css/grid-pro.css';
    ```
    
    **Option B - Script tags (for browser):**

    ```html
    <script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-pro/grid-pro.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-pro/css/grid-pro.css">
    ```
    
    **Option C - CommonJS:**

    ```javascript
    const Grid = require('@highcharts/grid-pro');
    require('@highcharts/grid-pro/css/grid-pro.css');
    ```

**For Dashboards + Grid Pro users:**

1. Install both packages:
    
    ```bash
    npm install @highcharts/dashboards @highcharts/grid-pro
    ```
    
2. Import Grid Pro before Dashboards:

    **Option A - ESM (recommended for modern bundlers):**

    ```javascript
    import Grid from '@highcharts/grid-pro/es-modules/masters/grid-pro.src.js';
    import '@highcharts/grid-pro/css/grid-pro.css';

    import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
    import '@highcharts/dashboards/css/dashboards.css';

    // Connect Grid Pro to Dashboards
    Dashboards.GridPlugin.custom.connectGrid(Grid);
    Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);
    ```
    
    **Option B - Script tags (for browser):**

    ```html
    <script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-pro/grid-pro.js"></script>
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-pro/css/grid-pro.css">
    <link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/dashboards.css">
    ```
    
    **Option C - CommonJS:**

    ```javascript
    const Grid = require('@highcharts/grid-pro');
    require('@highcharts/grid-pro/css/grid-pro.css');

    const Dashboards = require('@highcharts/dashboards');
    require('@highcharts/dashboards/css/dashboards.css');

    // Connect Grid Pro to Dashboards
    Dashboards.GridPlugin.custom.connectGrid(Grid);
    Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);
    ```
    
**Important Notes:**
- Grid Pro must be imported/loaded before Dashboards
- When using script tags, Grid Pro is served from jsDelivr CDN (`cdn.jsdelivr.net`), while Dashboards is served from `code.highcharts.com`
- Grid Pro CSS contains all Grid Lite styles, so you only need to include Grid Pro CSS (not Grid Lite CSS)

**Common error:** If you see `DataGrid is not defined` or Grid Pro features don't work, ensure Grid Pro is installed and imported before Dashboards.

### New CSS prefix

**What changed:** CSS class prefix in Grid Pro is now `.hcg-`.

**Migration steps:**
- Change all occurrences of `.highcharts-datagrid-` to `.hcg-` in any custom styles overrides.
- Recommended: use [theming variables](https://www.highcharts.com/docs/grid/theming/theming) instead of CSS overrides.

**Example:**
```css
// Before
.highcharts-datagrid-row-even {background: #ccc;}

// After
.hcg-row-even {background: #ccc;}

// Recommended
--hcg-row-even-background: #ccc;
```

### Other Breaking Changes

Grid Pro 2.0.0 includes the same breaking changes as Grid Lite 2.0.0:
- **Column Resizing API** - See section 3
- **Grid Data Export** - See section 3

---

## Migration Checklist

Use this checklist to ensure complete migration:

### For Data Layer Users (standalone or with Dashboards)

- [ ] Update all column name references to column IDs
- [ ] Replace `table.modified` with `table.getModified()`
- [ ] Flatten connector options (remove nested `options` object)
- [ ] Update connector API calls (`connector.table` → `connector.getTable()`)
- [ ] Consolidate modifier logic into `modifyTable()` only
- [ ] Update DataConverter helper references to DataConverterUtils namespace

### For Dashboards Users

- [ ] Replace `cell` with `renderTo` in all components
- [ ] Move deprecated `components[].columnAssignment` to `components[].connector.columnAssignment`
- [ ] Update connector event listeners (remove `e.tables` references)

### For Grid Lite Users

- [ ] Update column resizing API and configuration
- [ ] Replace `getJSON()` with `getData()`
- [ ] Replace `grid.css` with `grid-lite.css`

### For Grid Pro Users

- [ ] Install Grid Pro as separate package
- [ ] Import Grid Pro (before Dashboards if using both)
- [ ] Include Grid Pro CSS (contains all Grid Lite styles)
- [ ] Change CSS class prefix
- [ ] Apply all Grid Lite migration steps

---

## Need Help?

- **Documentation**: [highcharts.com/docs](https://www.highcharts.com/docs)
- **Support**: Contact your support representative
- **Community**: [forum.highcharts.com](https://forum.highcharts.com/)
