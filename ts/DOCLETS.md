Doclets
=======

All regular rules of [JSDoc](https://jsdoc.app) apply to Highcharts doclets.
Highcharts doclets also use custom tags to document the Highcharts options tree.

The custom implementations have the following requirements:

1. The `@private` tag should be the first or last tag in a doclet.

2. The tags `@apioption` and `@optionparent` have to come last in a doclet.
   Exception to this rule is the `@private` tag.

3. All non-basic types have to be defined with `@callback`, `@class`,
   `@interface` or `@type`.

4. All non-basic types have to begin with `Highcharts.`.

5. A doclet with `@optionparent` tag has to be followed by a line with opening
   curly bracket.

6. `@extends` will merge from a set of options into the `@optionparent`. Default
   values will be not inherited. Also `@extends` does not work with
   `@apioption`.

7. `@productdesc` adds additional product-specific information to the initial
   doclet text. The first word following the tag has to be the product key in
   curly brackets.
