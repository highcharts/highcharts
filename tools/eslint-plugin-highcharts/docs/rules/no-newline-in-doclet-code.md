# No newlines are allowed inside backticks in doclets. (no-newline-in-doclet-code)

To avoid code samples to be split and spaces added inside code.


## Rule Details

This rule aims to improve docs.

Examples of **incorrect** code for this rule:

```js

The class name is `highcharts-
something`.

```

Examples of **correct** code for this rule:

```js

The class name is `highcharts-something`.


```
