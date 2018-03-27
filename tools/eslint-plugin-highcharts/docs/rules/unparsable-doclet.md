# A doclet is not parsable when added to the end of an object. (unparsable-doclet)

Highcharts uses loose JSDoc doclets for its API definitions.


## Rule Details

This rule aims to warn about loose doclets at the end of an object literal. JSDoc
is not able to parse those unless there are object members below them.

Examples of **incorrect** code for this rule:

```js
{
	/**
	 * A foo is a type of bar.
	 * @type {String}
	 */
	foo: 'bar'
	/**
	 * Some loose doclet.
	 */
}

```

Examples of **correct** code for this rule:

```js
{
	/**
	 * Some loose doclet.
	 */
	
	/**
	 * A foo is a type of bar.
	 * @type {String}
	 */
	foo: 'bar'
}

```
