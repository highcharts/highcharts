---
tags: ["grid-pro"]
---

# Tree view

Tree view is a Highcharts Grid Pro feature that turns flat row data into an
expandable hierarchy inside the grid. Use it when your data represents
parent-child relationships such as organization structures, folders, product
categories, account trees, or multi-level budgets.

Tree view is configured using `data.treeView` and works with the local
data provider. Grid builds a tree index from the source table, then projects
the queried row set into visible parent and child rows before pagination is
applied.

## Minimum requirements

- Tree view is available in Highcharts Grid Pro.
- Set `data.idColumn` to a column containing stable string or number row IDs.
- Tree view works with local data (`data.columns`,
  `data.dataTable`, or connector-backed data).

```js
Grid.grid('container', {
    data: {
        columns: {
            path: [
                'Root/Sales',
                'Root/Marketing'
            ],
            id: [1, 2]
        },
        idColumn: 'id',
        treeView: {
            enabled: true
        }
    }
});
```

## Input models

Tree view supports two input models:

- `parentId`: explicit parent references in a dedicated column
- `path`: hierarchical paths such as `Root/Sales/EMEA`

If `data.treeView.input` is omitted, TreeView auto-detects standard columns and
prefers `path` when both `path` and `parentId` exist.

### `parentId` input

Use `parentId` input when your backend already stores direct parent references
and row IDs are the canonical source of hierarchy.

```js
Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4, 5],
            parentId: [null, 1, 1, 2, 2],
            name: ['Root', 'Sales', 'Marketing', 'EMEA', 'APAC'],
            budget: [1000, 600, 400, 350, 250]
        },
        idColumn: 'id',
        treeView: {
            input: {
                type: 'parentId',
                parentIdColumn: 'parentId'
            },
            treeColumn: 'name',
            expandedRowIds: 'all'
        }
    },
    header: ['name', 'budget']
});
```

`parentIdColumn` defaults to `parentId`.

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
        idColumn: 'id',
        treeView: {
            input: {
                type: 'path',
                pathColumn: 'path',
                separator: '/',
                showFullPath: true
            }
        }
    }
});
```

`pathColumn` defaults to `path`, `separator` defaults to `'/'`, and
`showFullPath` defaults to `false`.

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

- Use `data.treeView.treeColumn` to choose which column receives indentation
  and toggle buttons.
- If `treeColumn` is omitted, Grid uses the first rendered column.
- For path input, `showFullPath: false` renders only the current segment when
  the path column is also the tree column. Set it to `true` to render the full
  path string.

```js
treeView: {
    treeColumn: 'name',
    input: {
        type: 'path',
        showFullPath: false
    }
}
```

## Initial expansion state

Use `expandedRowIds` to seed which branches are expanded when Tree view is
initialized or when Tree view configuration changes.

```js
treeView: {
    expandedRowIds: [1, 2, 7] // or: 'all'
}
```

`expandedRowIds: 'all'` expands every row that currently has children. Leaf
rows are ignored automatically.

## Sticky parents

Set `stickyParents: true` to keep the current ancestor context visible while
scrolling long trees.

```js
treeView: {
    stickyParents: true
}
```

Sticky parents are enabled by default. This pairs especially well with deep
hierarchies and [row virtualization](https://www.highcharts.com/docs/grid/rows/virtualization).

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
in `data.treeView.input.separator`.

```js
treeView: {
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
    input: {
        type: 'path',
        separator: path => path.split(' > ')
    }
}
```

This works well for custom domain-specific path formats.

## API reference

See more in the
[API reference for `data.treeView`](https://api.highcharts.com/grid/data.treeView).
