---
tags: ["grid-pro"]
---

# Tree view

Tree view is a Highcharts Grid Pro feature that turns flat row data into an
expandable hierarchy inside the grid. Use it when your data represents
parent-child relationships such as organization structures, folders, product
categories, account trees, or multi-level budgets.

Tree view is enabled by setting `treeView.enabled` to `true`. It works with the
local data provider. Grid builds a tree index from the source table, then
projects the queried row set into visible parent and child rows before
pagination is applied.

To build a hierarchy from repeated values of flat data instead, use
[row grouping](https://www.highcharts.com/docs/grid/rows/row-grouping).

## Minimum requirements

- Tree view is available in Highcharts Grid Pro.
- Set `treeView.enabled: true`. Declaring the remaining tree view options alone
  does not enable the feature.
- Tree view works with local data (`data.columns`,
  `data.dataTable`, or connector-backed data).
- Provide either `parentId` or `path` hierarchy data, or configure
  `treeView.input` to point to custom hierarchy columns.

```js
Grid.grid('container', {
    data: {
        columns: {
            path: [
                'Root/Sales',
                'Root/Marketing'
            ]
        }
    },
    treeView: {
        enabled: true
    }
});
```

Tree view can work without `data.idColumn`. When it is not set, Grid uses the
original row indexes as row IDs. Configure `data.idColumn` when your data or
application state needs stable row IDs from a column value.

## Input models

Tree view supports two input models:

- `parentId`: explicit parent references in a dedicated column
- `path`: hierarchical paths such as `Root/Sales/EMEA`

If `treeView.input` is omitted, TreeView auto-detects standard columns and
prefers `path` when both `path` and `parentId` exist.

### `parentId` input

Use `parentId` input when your backend already stores direct parent references
and row IDs are the canonical source of hierarchy. `data.idColumn` is required
when `parentIdColumn` values refer to IDs stored in a data column. Without
`data.idColumn`, `parentIdColumn` values must refer to original row indexes.

```js
Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5],
            parentId: [null, 1, 1, 2, 2],
            name: ['Root', 'Sales', 'Marketing', 'EMEA', 'APAC'],
            budget: [1000, 600, 400, 350, 250]
        },
        idColumn: 'id'
    },
    treeView: {
        enabled: true,
        input: {
            type: 'parentId',
            parentIdColumn: 'parentId'
        },
        treeColumn: 'name'
    },
    rendering: {
        rows: {
            expandedLevels: 'all'
        }
    },
    header: ['name', 'budget']
});
```

`parentIdColumn` defaults to `parentId`. Structural TreeView columns such as
`data.idColumn` and `parentIdColumn` are rendered readonly.

### `path` input

Use `path` input when hierarchy is stored as full path strings or when you want
Grid to infer missing intermediate ancestors automatically.

```js
Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5],
            path: [
                'Root',
                'Root/Sales',
                'Root/Marketing',
                'Root/Sales/EMEA',
                'Root/Sales/APAC'
            ],
            budget: [1000, 600, 400, 350, 250]
        },
        idColumn: 'id'
    },
    treeView: {
        enabled: true,
        input: {
            type: 'path',
            pathColumn: 'path',
            separator: '/',
            showFullPath: true
        }
    }
});
```

`pathColumn` defaults to `path`, `separator` defaults to `'/'`, and
`showFullPath` defaults to `false`.

Path values must stay unique within the source table. When the path column is
editable, Grid applies case-sensitive unique validation and rejects invalid
path syntax such as empty segments before saving, using the configured
separator.

### Generated ancestors for path input

With `path` input, intermediate nodes do not need to exist as source rows. If
your dataset contains `Root/Sales/EMEA` but does not contain separate source
rows for `Root` or `Root/Sales`, Tree view can generate those ancestors
automatically so the visible hierarchy stays complete.

Generated rows are structural rows. Their path value is available, but other
columns are rendered as `null` unless you provide explicit source rows for
those ancestors.

## Tree column

The expand/collapse UI is rendered in the tree column.

- Use `treeView.treeColumn` to choose which column receives indentation
  and toggle buttons.
- If `treeColumn` is omitted, Grid uses the first rendered column.
- Tree rows expose their depth on the `tr` element as `data-tree-depth`.
- For path input, `showFullPath: false` renders only the current segment when
  the path column is also the tree column. Set it to `true` to render the full
  path string.

```js
treeView: {
    enabled: true,
    treeColumn: 'name',
    input: {
        type: 'path',
        showFullPath: false
    }
}
```

## Initial expansion state

Two options in `rendering.rows` seed which branches are expanded when Tree view
is initialized or when Tree view configuration changes:

- `expandedLevels` expands whole levels, counted from the top
- `expandedRowIds` expands individual rows

```js
rendering: {
    rows: {
        expandedLevels: 2,       // or: 'all'
        expandedRowIds: [1, 2, 7]
    }
}
```

A row is initially expanded when its depth is lower than `expandedLevels`, or
when its ID is listed in `expandedRowIds` - the two options add up and neither
of them collapses rows. `expandedLevels` defaults to `0`, which leaves every
branch collapsed.

`expandedLevels: 2` expands the root rows and their children, so three levels
are visible. `expandedLevels: 'all'` expands every row that currently has
children. Leaf rows are ignored automatically, and neither option requires
`data.idColumn`.

For an explicit `expandedRowIds` array, each value is matched against the
current Tree view row IDs. `data.idColumn` is required when those values come
from a stable ID column. Without `data.idColumn`, use original row indexes
instead.

## Sticky parents

Set `rendering.rows.stickyParents: true` to keep the current ancestor context
visible while scrolling long trees.

```js
rendering: {
    rows: {
        stickyParents: true
    }
}
```

Sticky parents are enabled by default. This pairs especially well with deep
hierarchies and [row virtualization](https://www.highcharts.com/docs/grid/rows/virtualization).

## Aggregation

Use `columns[].rowAggregator` to derive parent values from their direct children
during TreeView projection.

```js
columns: [{
    id: 'budget',
    rowAggregator: 'SUM'
}, {
    id: 'utilization',
    rowAggregator: 'AVERAGE'
}, {
    id: 'risk',
    rowAggregator: function (context) {
        return context.depth === 0 ? false : 'MAX';
    }
}]
```

Aggregation rules:

- It runs after filtering and sorting, but before pagination.
- It uses direct children after their own aggregation has been resolved.
- It overrides parent values whenever aggregation is configured for that
  parent row and column.
  To keep the original source value for one specific parent row, return
  `false` from the callback for that row:

  ```js
  columns: [{
      id: 'budget',
      rowAggregator: function (context) {
          return context.rowId === 'europe' ? false : 'SUM';
      }
  }]
  ```
- It is ignored for structural TreeView columns such as `data.idColumn`,
  `input.pathColumn`, and `input.parentIdColumn`.
- With `path` input, parent rows do not need to be defined unless they carry
  their own source values.
- Generated ancestors from `path` input can also receive aggregated values.
- Derived cells are rendered with the `hcg-cell-aggregated` CSS class.

## Runtime API

The Tree view controller is available on `grid.treeView`.

```js
await grid.treeView?.expandAll();
await grid.treeView?.collapseAll();
await grid.treeView?.toggleRow(2);
```

Use this API for toolbar actions, external buttons, or synchronized UI outside
the grid.

## Events

Tree view exposes row toggle lifecycle events at the root `events` option:

- `beforeTreeRowToggle`
- `afterTreeRowToggle`

`beforeTreeRowToggle` can cancel the interaction by calling
`event.preventDefault()`.

```js
Grid.grid('container', {
    events: {
        beforeTreeRowToggle: function (event) {
            if (event.rowId === 1) {
                event.preventDefault();
            }
        },
        afterTreeRowToggle: function (event) {
            console.log(event.rowId, event.expanded);
        }
    }
});
```

Both events include:

- `rowId`
- `expanded`
- `originalEvent` when the toggle came from mouse or keyboard interaction

## Sorting, filtering, and pagination

Tree view is applied after sorting and filtering, and before pagination. In
practice this means:

- sorting changes the visible sibling order inside the tree
- filtering can keep matching descendants and reintroduce required ancestors so
  the visible result still forms a valid hierarchy
- pagination counts projected visible tree rows, not only raw source rows

This behavior makes Tree view work naturally with Grid querying without breaking
parent-child context.

## Custom separators

For path data that is not slash-separated, pass a string, `RegExp`, or callback
in `treeView.input.separator`.

```js
treeView: {
    enabled: true,
    input: {
        type: 'path',
        separator: /[A-Z]+(?![a-z])|[A-Z][a-z]*/
    }
}
```

This is useful for e.g. PascalCase hierarchy keys such as
`CompanySalesEMEA`, where the intended path is `Company / Sales / EMEA`.

Use a callback when path segmentation depends on custom parsing logic that is
clearer to express in JavaScript than in a regular expression. The callback
should return an ordered array of path segments.

```js
treeView: {
    enabled: true,
    input: {
        type: 'path',
        separator: path => path.split(' > ')
    }
}
```

This works well for custom domain-specific path formats.

## Migrating from `data.treeView`

The `data.treeView` option is deprecated since v3.1.0 and now supports the
`parentId` and `path` input models only. Move the configuration to the root
level:

| Deprecated | Replacement |
| ---------- | ----------- |
| `data.treeView.enabled` | `treeView.enabled` |
| `data.treeView.input` | `treeView.input` |
| `data.treeView.treeColumn` | `treeView.treeColumn` |
| `data.treeView.expandedRowIds` | `rendering.rows.expandedRowIds`, or `rendering.rows.expandedLevels: 'all'` |
| `data.treeView.stickyParents` | `rendering.rows.stickyParents` |
| `columns[].treeView.aggregator` | `columns[].rowAggregator` |

When both `treeView` and `data.treeView` are set, the root level `treeView`
takes precedence and `data.treeView` is ignored entirely.

## API reference

See more in the
[API reference for `treeView`](https://api.highcharts.com/grid/treeView).
