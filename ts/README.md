Highcharts Internals
====================
This is the internal TypeScript source code that has been migrated from the
previous JavaScript version. The declarations for products are still generated
out of the doclets to be in sync with the official API documentation.



Content
-------
* [Main Rules](#main-rules)
* [Do's and Don'ts](#dos-and-donts)
  * [Make use of type import](#make-use-of-type-import)
  * [Combine ES6 class pattern with types](#combine-es6-class-pattern-with-types)
  * [Make use of type definition files](#make-use-of-type-definition-files)
  * [Avoid "any" casting](#avoid-any-casting)
  * [Avoid "as" casting](#avoid-as-casting)
  * [Test against "undefined" and "null"](#test-against-undefined-and-null)
* [Good to Know](#good-to-know)
  * [Make use of common ES6+ features](#make-use-of-common-es6-features)
  * [Extend interfaces in type definition files](#extend-interfaces-in-type-definition-files)
  * [Type check for interfaces](#type-check-for-interfaces)
  * [Type union instead of new interface](#type-union-instead-of-new-interface)
  * [Unit tests can be written in TypeScript](#unit-tests-can-be-written-in-typescript)



Main Rules
----------
- You have to sync types in code, doclets, and internals yourself
- Order everything in the internal namespace alphabetical
- Make use of import and export where possible; consult `parts/Utilities.ts` for
  reference
- Make use of parantheses around type lists. (`Array<(number|null|string)>`)
- Do not use `any` type in new code as it is only used for the migration phase
- Add paragraphs around conditional types `(A extends B ? C : D)`, type lists
  `(A|B)`, and type unions `(A&B)`.



Do's and Don'ts
---------------

### Make use of type import

If you only need a class type of a file, but not the implementation, make use of
the type import. This removes these import from the `*.js` output, as is is only
relevant to TypeScript and holds the file and package sizes small.

```ts
import type Chart from '../Core/Chart/Chart';
```


### Combine ES6 class pattern with types

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
like to add real members that should not be part of the class, move them in a
new file.


### Make use of type definition files

If a type is created by multiple files, it should go into its own `*.d.ts` file.
That way multiple files can add properties to an interface in an `*.d.ts` file.
Good examples for this type extension are:

* [`./Core/Axis/Types.d.ts`](./Core/Axis/Types.d.ts)

* [`./Core/Renderer/SVG/SVGPath.d.ts`](./Core/Renderer/SVG/SVGPath.d.ts)


### Avoid "any" casting

Even in strict mode some casts to `any` are allowed. In most situations you
should still avoid them, because it disables all further checks. Instead make
use of the `object` type (lower case!) or the `unknown` type, or make use of
generic `<T>` typing.

*Incorrect:*
```ts
function f(obj: any): any {
    switch (typeof obj) {
        default:
            return '' + obj;
        case 'boolean':
        case 'number':
        case 'string':
        case 'symbol':
            return obj.valueOf();
    }
}
```
*Correct:*
```ts
function a(
    obj?: (boolean|number|object|string|symbol)
): (boolean|number|string|symbol) {
    // …
}
function b(obj: unknown): (boolean|number|string|symbol) {
    // …
}
function c<T extends (boolean|number|object|string|symbol)> (
    obj: T
): (boolean|number|string|symbol) {
    // …
}
```


### Avoid "as" casting

Avoid type casting with the `as` keyword. It forces TypeScript to use only the
given type instead of all the previously detected ones. This excludes often
`null` and `undefined` which can result in runtime errors later on.  

*Incorrect:*
```ts
function f(el?: (Element|undefined)): void {
    var v = el as Element; // v becomes Element without error
}
```
*Correct:*
```ts
function a(el?: (Element|undefined)): void {
    var v: Element = (el || document.createElement('div'));
}
```


### Test against "undefined" and "null"

To prevent yourself from pitfalls during runtime, you should check against
optional properties as soon as possible to rule them out in further code.

*Incorrect:*
```ts
function f(data?: Array<(number|undefined)>, dOffset?: number): number {
    return (data || []).reduce(
        function (sum: number, value: (number|undefined)): number {
            return (sum + (value || 0) + (dOffset || 0));
        },
        0
    );
}
```
*Correct:*
```ts
function a(data?: Array<(number|undefined)>, dOffset?: number): number {
    if (!data) {
        return 0;
    }
    let dOffsetSafe = (dOffset || 0);
    return data.reduce(
        function (sum: number, value: (number|undefined)): number {
            return (sum + (value || 0) + dOffsetSafe);
        },
        0
    );
}
```



Good to Know
------------


### Make use of common ES6+ features

TypeScript does transpile most common ES6 features down to ES5-capable browsers
like Internet Explorer 9+, Chrome 5+, Firefox 4+, Safari 5+. So you can make use
of them:

* Arrow functions (without own `this` scope):
  `(a, b) => {console.log('yeah')};`

* Constants and limited variables:
  `const yes: boolean = true; let degree: number = 180;`

* Default parameter values:
  `function (required: number, optional: string = ''): void;`

* Destructing arrays:
  `const sentence = ['Hello', 'world']; let [greeting, pronoun] = sentence;`

* Destructing objects:
  `const { chart, isDOMElement } = Highcharts; chart('container');`

* For-of-loops:
  `const data = [1, 2, 3]; let sum = 0; for (const p of data) { sum += p; }`

* Read-only parameters:
  `function process(readonly array: Array<string>): void;`

* Rest parameter arrays (have to be last):
  `function rest(name: string, ...optionals: Array<number>): void;`

* Spread arrays and iterators into arrays:
  `const args = [...arguments, extraArg]; proceed.call(this, ...args);`

* Spread objects into objects:
  `const obj = { cool: true }; const clone = { isClone: true, ...obj };`

* Optional chaining for props that might not exist:
  `const option = grandparent?.parent?.myOption;`

* Nullish coalescing operator instead of pick():
  `const option = optionThatCanBeNullOrUndefined ?? defaultOption;`


### Extend interfaces in type definition files

TypeScript can combine interfaces with the same name into one virtual interface.
In that way, modules can add optional properties to existing interfaces and to
classes implementing that interface. Follow the following steps:

1. First you have to decide, wich interface becomes the main interface. Move it
   into a type definition file (`.d.ts`). In our example it will look like this:
   ```ts
   // file: Example.d.ts
   export interface Example {
       mainProperty1: boolean;
       mainProperty2: number;
       mainProperty3: string;
   }
   export default Example;
   ```

2. In every module, where you like to add optional properties to the interface,
   create a module declaration with `declare module`. You can define now an
   interface with the same name as an addition. In our example it will look like
   this:
   ```ts
   // file: Module.ts
   declare module './Example' {
       interface Example {
           optionalProperty1?: boolean;
           optionalProperty2?: number;
           optionalProperty3?: string;
       }
   }

3. When you now import the interface in an other module or the same module, all
   properties are available. In our example it would be like this:
   ```ts
   // file: OtherModule.ts
   import type Example from './Example';
   const example: Example = {
       mainProperty1: false,
       mainProperty2: 1,
       mainProperty3: '',
       optionalProperty1: true,
   };
   example.optionalProperty2 = example.mainProperty2 * 100;
   example.optionalProperty3 = 'string';
   ```

**Note:** This technique can only extend interfaces in type definition files
(`.d.ts`), not in regular source files (`.ts`). If the interface is in a regular
source file, you have to move it in a separate type definition file with a new
file name. You can not have a regular source file and a type definition file
with the same name in the same folder.


### Type check for interfaces

Even though on runtime every interface becomes just a regular `object` there
is a workaround with TypeScript to differenciate between interfaces all the
time with the help of literal types (narrowed number value or string value).

*Example:*
```ts
interface A {
    type: 'a'; // string literal type
    data: Array<number>;
}
interface B {
    type: 'b'; // string literal type
    data: Record<string, string>;
}
function process (container: (A|B)): (A|B)['data'] {
    if (container.type === 'a') {
        return container.data.map(value => ++value);
    }
    return container.data;
}
```


### Type union instead of new interface

Sometimes you just need a pure merge of several classes or interfaces as a new
type. Instead of creating an empty interface that extends them, you can create a
type union. This also works as an inline type.

*Example:*
```ts
interface A {
    x: number;
}
interface B {
    x2: number
}
type C = (A&B);
let example1: C = { x: 1, x2: 2 },
    example2: (A&B) = example1;
```


### Unit tests can be written in TypeScript

Before the tests are run by Karma, optionally (`--ts`) a compiler will
transpile necessary TypeScript files (`.ts`) to JavaScript files (`.js`). Both
files will be placed in the same directory.

If you like to run a new or modified TypeScript-based test in your
highcharts-utils, you have to run them first in the terminal, so that they get
transpiled. Highcharts-utils does not support TypeScript yet. If you change
TypeScript-based code, you have to repeat the step.

The terminal line for running all tests including new TypeScript-based ones is:
`npx gulp test --ts`
