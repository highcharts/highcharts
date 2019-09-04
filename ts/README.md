Highcharts Internals
====================
This is the internal TypeScript source code that has been migrated from the
previous JavaScript version. The declarations for products are still generated
out of the doclets to be in sync with the official API documentation.



Main Rules
----------
- You have to sync types in code, doclets, and internals yourself
- Make use of import and export where possible; consult `parts/Utilities.ts` for
  reference
- Do not use `any` type in new code as it is only used for the migration phase
- Order everything in the internal namespace alphabetical
- Add paragraphs around conditional types (`A extends B ? C : D`), type lists
  (`(A|B)`), and type unions (`(A&B)`).



Do's and Don'ts
---------------

### Avoid `any` casting

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


### Avoid `as` casting

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


### Test agains `undefined` and `null`

To prevent yourself from pitfalls during runtime, you should check agains
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


### Type union instead of new interface

Sometimes you just need a pure merge of several classes or interfaces as a new
type. Instead of creating an empty interface that extends them, you create a
type union. This also works as an inline type.

*Incorrect:* 
```ts
interface A {
    x: number;
}
interface B {
    x2: number
}
interface C extends A, B {
}
```  
*Correct:*
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



Good to Know
------------


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
