---
tags: ["grid-pro"]
---

# Cell editing

Note: cell editing is not part of Highcharts Grid Lite, so refer to [install instructions](https://www.highcharts.com/docs/dashboards/grid-standalone) for the full version to enable this functionality.

End users can edit data in cells if cell edit mode is enabled by setting the `columnDefaults.cells.editMode.enabled` and/or `columns[].cells.editMode.enabled` API options:

```js
columnDefaults: {
    cells: {
        editMode: {
            enabled: true
        }
    }
},
columns: [{
    id: "firstName",
    cells: {
        editMode: {
            enabled: false
        }
    }
}]
```

In the example above cell editing is enabled for ALL columns, expect the `firstName` column. The reverse can be achived by not setting `columnDefaults` and `columns[].cells.editMode.enabled: true` instead.


## Validation

### Predefined Validation Rules

The following validation rules are available out of the box:
- `notEmpty`
- `boolean`
- `number`
- `datetime`

Each column has a specific `dataType`, which can be set explicitly by the user or inferred from the data. All data types can accept `null` values by default. Each `dataType` comes with its own set of predefined validation rules, for example, columns with the `number` type will automatically reject `NaN` values.

To prevent users from entering `null` or empty string values in any column, add the `notEmpty` validation rule:

```ts
columns: [{
    id: 'notEmptyColumn',
    dataType: 'number',
    cells: {
        editMode: {
            validationRules: ['notEmpty']
        }
    }
}]
```

### Custom Validation Rules

You can define custom validation rules and error messages directly in the column options:

```ts
columns: [{
    id: 'emails',
    dataType: 'string',
    cells: {
        editMode: {
            validationRules: ['notEmpty', {
                validator: function({ value }) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                notification: 'Value must be a valid email address.'
            }]
        }
    }
}]
```

Note that a validator is a callback function that receives an object as its first argument. This object represents the cell content and contains two important properties: `value` and `rawValue`. 

- `value`: Returns the parsed value according to the specified `dataType`.
- `rawValue`: Always returns the original string entered by the user in the input field, regardless of the column's `dataType`.

This distinction allows you to implement validation logic based on either the parsed value or the raw user input, depending on your requirements. For example, you might want to validate the format of the input string (`rawValue`) before parsing, or check the parsed value (`value`) for business logic constraints.

### Registering Custom Validators

You can also register custom validators globally in the `Validator.rulesRegistry` and then reference them by name in your columns:

```ts
Validator.rulesRegistry['email'] = {
    validator: function({ value }) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    notification: 'Value must be a valid email address.'
};

columns: [{
    id: 'emails',
    dataType: 'string',
    cells: {
        editMode: {
            validationRules: ['notEmpty', 'email']
        }
    }
}]
```

This approach allows you to reuse custom validation logic across multiple columns.


## Edit Mode Renderers

Edit mode renderers define how the cell input is displayed and interacted with when editing is enabled. You can use built-in renderers such as text fields, select dropdowns, or implement custom renderers to match your application's requirements. This allows for flexible editing experiences tailored to different data types and use cases.

You can read more about cell renderers in [this article](/docs/grid/cell-content).

```ts
columns: [{
    id: "role",
    cells: {
        editMode: {
            enabled: true,
            renderer: {
                type: 'select',
                options: [
                    { value: 'admin', label: 'Administrator' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'viewer', label: 'Viewer' }
                ]
            }
        }
    }
}]
```


## The afterEdit event

The `afterEdit` event is called after a cell value is edited using the edit mode, and can be used to e.g. post result to server, generate feedback GUI etc:

```js
columnDefaults: {
    cells: {
        events: {
            afterEdit: function () {
                console.log(`${this.column.id} for ${this.row.data.firstName} was updated to ${this.value}`);
            }
        }
    },
}
```
