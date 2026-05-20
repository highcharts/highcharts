Doclets
=======

All regular rules of [JSDoc](https://jsdoc.app) apply to Highcharts doclets.
Highcharts doclets also use custom tags to document the Highcharts options tree.

The custom implementations have the following requirements:

1. The `@internal` (or its legacy alias `@private`) tags should be the first or
   last tags in doclets.

2. The tags `@apioption` and `@optionparent` have to come last in a doclet.
   Exception to this rule are `@internal` and `@private` tags.

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

8. `@since` and `@deprecated` support usage of `next` as the version number
   that is resolved on the next release when the next code version is known.
   When used in a public doclet, **must have a value** - a version number or
   `next`. (Guarded by `@highcharts/highcharts/doclet-versioned-tags` eslint
   rule.)

9. `@basic` flags an option as commonly used within its parent option, referring
   to the option itself, not to its type. Currently applied to `id`, `index`,
   `name`, `type`, `className`, `color`, `events`, and `data`.

10. `@default` and `@sample` tags support product-specific values. The first
   word following the tag has to be the product key in curly brackets. Multiple
   products can be separated by `|`. E.g. `@default {highcharts|highstock} 0`,
   `@sample {highcharts|highstock} demo/chart/polar`.


Documenting TypeScript native types
-----------------------------------

When documenting a TS type, interface, or class some additional rules apply:

- All internal types and doclets must be tagged with `@internal`.

- Do not use `@type` in the doclet - the type is already set in code.

- Doclet placed on an interface or class should be about the interface or class
  itself, not the related API option that is using it.

- `@extends` and `@excludes` tags should be replaced with proper changes to the
  types.
