---
tags: ["grid-pro"]
---

# Input validation

Validation rules are configured in `columns[].cells.editMode.validationRules`.

## Enable edit mode with validation

```js
Grid.grid('container', {
    data: {
        columns: {
            email: ['anna@example.com', 'john@example.com']
        }
    },
    columns: [{
        id: 'email',
        dataType: 'string',
        cells: {
            editMode: {
                enabled: true,
                validationRules: ['notEmpty', {
                    validate: ({ value }) => /.+@.+\..+/.test(value),
                    notification: 'Value must be a valid email address.'
                }]
            }
        }
    }]
});
```

## Predefined validation rules

Each column has a specific `dataType`, which can be set explicitly or inferred from the data. All data types can accept `null` values by default. Each `dataType` comes with its own set of predefined validation rules, and e.g. columns with `dataType: 'number'` will automatically reject `NaN` values.

In addition to `dataType` you can extend a selection of predefined validation rules:

- `notEmpty`: Only accepts non-empty values.
- `boolean`: Only accepts `true`, `false`, `1`, and `0` as valid values.
- `number`: Only accepts numbers.
- `datetime`: Only accepts valid timestamps in milliseconds.
- `ignoreCaseUnique`: Only accepts unique values within the column, case-insensitively.
- `unique`: Only accepts unique values within the column, case-sensitively.
- `arrayNumber`: Only accepts an array of numbers (`1, 2, 3`).
- `json`: Only accepts valid JSON strings.
- `sparkline`: Only accepts valid JSON or an array of numbers. This is the default validator for the `sparkline` renderer.

See how adding the `notEmpty` validation rule prevents users from entering `null` or empty string values in any column:

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

Custom notifications for each validation rule can be set using the root `lang` API option:

```js
lang: {
    validationNotifications: {
        notEmpty: 'Custom notification for empty cells',
        number: 'Custom notification for NaN'
    }
}
```

Each value can be a string or a callback function returning a string.

## Custom validation rules

You can define custom validation rules and notifications directly in the column options:

```ts
columns: [{
    id: 'emails',
    dataType: 'string',
    cells: {
        editMode: {
            validationRules: ['notEmpty', {
                validate: function({ value }) {
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

## Registering custom validators

You can also register custom validators globally in the `Validator.rulesRegistry` and then reference them by name in your columns:

```ts
Validator.rulesRegistry['email'] = {
    validate: function({ value }) {
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

## The afterEdit event

The `afterEdit` event is called after a cell value is edited using edit mode. You can use it to post changes to a server, update other UI, or trigger follow-up logic:

```js
columnDefaults: {
    cells: {
        events: {
            afterEdit: function () {
                console.log(`${this.column.id} for ${this.row.data.firstName} was updated to ${this.value}`);
            }
        }
    }
}
```
