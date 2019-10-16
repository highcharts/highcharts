Highcharts Internals
====================
This is the internal TypeScript source code that has been migrated from the
previous JavaScript version. The declarations for products are still generated
out of the doclets to be in sync with the official API documentation.



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


### Make use of common ES6 features

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
