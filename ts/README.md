Highcharts Internals
====================

These are the internal TypeScript sources. They have been migrated from the
previous JavaScript version. The sources are validated by ESLint rules, JSDoc
and TypeScript. These rules are maintained to let sources become as consistent
as possible.

**Please note:** The declarations for distribution are still generated from the
JSDoc doclets of the sources, so that they are in sync with the official API
documentation. As a consequence, types in sources and doclets share only a few
similarities.



Content
-------
* [Coding Recommendations](#coding-rules)
  * [Use alphabetical order](#use-alphabetical-order)
  * [Use common ES6 (ES2015) patterns](#use-common-es6-es2015-patterns)
  * [Use TypeScript syntax](#use-typescript-syntax)
  * [Use TypeScript definition files](#use-typescript-definition-files)
  * [Combine the class pattern with class types](#combine-the-class-pattern-with-class-types)
* [Coding Limitations](#coding-limitations)
  * [Code with ES5 (ES2009) in mind](#code-with-es5-es2009-in-mind)
  * [Code with strict rules in mind](#code-with-strict-rules-in-mind)
  * [Document with JSDoc in mind](#document-with-jsdoc-in-mind)
  * [Test with Internet Explorer in mind](#test-with-internet-explorer-in-mind)
* [Testing](#testing)



Coding Recommendations
----------------------

### Use alphabetical order

Think of the following developer maintaining your source code. Make it easy and
consistent to find classes, functions, interfaces, properties, and variables as
quickly as possible. Use alphabetical order as often as possible.


### Use common ES6 (ES2015) patterns

TypeScript can transpile common ES6 features down to ES5-capable browsers like
Internet Explorer 9+, Chrome 5+, Firefox 4+, Safari 5+.
Use them to your advantage:

- arrow functions: `() => {…}`
- class: `class C {…}`
- const: `const a = 'ABC';`
- deconstruct: `const { prop1, prop2 } = this;`
- export default: `export default M;`
- export subset: `const defaults = { fn, … }; export default defaults;`
- for-of-loop: `for (const k of obj) { sum += p; }`
- import default: `import M from './module.js';`
- import subset: `import M from './module.js'; const { fn, … } = M;`
- let: `let a = 'abc'`
- spread arrays: `const array2 = [...array1, extraValue];`
- spread objects: `const clone = { isClone: true, ...original };`


### Use TypeScript syntax

A guide to TypeScript can be found in the official
[handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
and
[introduction](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).
You can also test your knowledge on the TypeScript
[playground](https://www.typescriptlang.org/play?ts=3.9.7)

- default argument: `function fn (optionalIndex = 0) {…}`
- interface: `interface I {…}`
- namespace: `namespace N {…}`
- type alias: `type MyType = (MyClass|MyInterface);`
- type generic: `Array<(number|null|string)>`
- type import: `import type M from './module';`
- type intersection: `(MyClass&AnyRecord)`
- type union: `(number|string)`
- utility types: `ReadOnly<Array<string>>`; see
  ([handbook](https://www.typescriptlang.org/docs/handbook/utility-types.html))
- Make use of parantheses around type lists. (`Array<(number|null|string)>`)
- Do not use `any` type in new code as it is only used for the migration phase
- Add paragraphs around conditional types `(A extends B ? C : D)`, type lists
  `(A|B)`, and type unions `(A&B)`.


### Use TypeScript definition files

If a type is created by multiple files, it should go into its own `*.d.ts` file.
That way multiple files can add properties to an interface in an `*.d.ts` file.
A good example for this kind of type interface extension is the 
[`SeriesLike`](./Core/Series/SeriesLike.d.ts) interface.


### Combine the class pattern with class types

When it comes to types that are only created by one class, the following pattern
works the best:

```ts
class MyClass {
    /* properties and functions using MyClass.MyType */
    private myProperty?: MyClass.MyType;
    public myFunction(arg: MyClass.MyType) {
        /* ... */
    }
}
namespace MyClass {
    export interface MyType {
        /* ... */
    }
}
export default MyClass; // allows access to both, class implementation and types
```

*Please note:* The namespace should only contain types and interfaces. If you
like to add real members, make use of the static keyword and separate files.



Coding Limitations
------------------


### Code with strict rules in mind

Even though the migration is a work in progess, source will gradually comply to
strict rules of ESLint and TypeScript. You should therefor avoid insecure type
assurance and instead use preferred
[patterns](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

- Avoid type casting with the `as` keyword. Make use of type narrowing.
- Do not use the `any` type. Make use of the `unknown` type in combination with
  type narrowing and additional variable assignments.


### Document with JSDoc in mind

Both documentation and declarations of the distribution do not use the
TypeScript sources yet. Instead they are based exclusively on the JSDoc doclets
in the sources. As a consequence, types in sources and doclets share only a few
similarities. Public interfaces for example have to be defined twice, once in
TypeScript and a second time as JSDoclets.



Testing
-------

You can run `npm test` to test code changes with automated unit tests.

For tests in a browser, run `npx gulp` and use then the `highcharts-utils`
repository for a local test server.

For tests in a local npm-based project, run `npx gulp --dts` and then install in
your project the local Highcharts repository with `npm i ../highcharts/code`.
