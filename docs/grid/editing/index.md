---
sidebar_label: "Overview"
tags: ["grid-pro"]
---

# Editing overview

Editing in Grid is configured through `cells.editMode`. Use it to enable inline editing, choose how edit controls are rendered, and validate values before they are committed.

## Renderers

Renderers control which input is used when a cell enters edit mode, for example text input, number input, date input, checkbox, or select.

- [Renderers](https://www.highcharts.com/docs/grid/editing/renderers)
- [Custom renderers](https://www.highcharts.com/docs/grid/editing/custom-renderers)

## Validation

Validation rules ensure edited values match your expected format and business constraints. You can combine built-in rules with custom validators and localized validation messages.

- [Validation](https://www.highcharts.com/docs/grid/editing/validation)

## Adding and deleting rows and columns

`cells.editMode` covers the value inside a cell. To let users change the shape of the table itself, enable [`tableEditing`](https://api.highcharts.com/grid/tableEditing). It adds context menu actions for adding and deleting rows and columns, and a button for the case where the table is still empty and there is no cell to open a menu on.

The two options are independent: `tableEditing` decides whether rows and columns can be added, `cells.editMode` whether the resulting cells can be filled in. A table meant to be built from scratch needs both.

- [Editing an empty table](https://www.highcharts.com/docs/grid/cell-context-menu)
