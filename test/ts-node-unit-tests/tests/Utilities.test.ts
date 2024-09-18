import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, notStrictEqual } from 'node:assert';

import Utils from '../../../ts/Core/Utilities';

describe('merge function', () => {
    const { merge } = Utils;

    it('should deep merge multiple objects into a new object', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { b: { d: 3 }, e: 4 };
        const obj3 = { f: 5 };
        const result = merge(obj1, obj2, obj3);

        deepStrictEqual(result, {
            a: 1,
            b: { c: 2, d: 3 },
            e: 4,
            f: 5
        });

        // Ensure original objects are not mutated
        deepStrictEqual(obj1, { a: 1, b: { c: 2 } });
        deepStrictEqual(obj2, { b: { d: 3 }, e: 4 });
        deepStrictEqual(obj3, { f: 5 });
    });

    it('should extend an existing object when the first argument is true', () => {
        const target = { a: 1, b: { c: 2 } };
        const source = { b: { d: 3 }, e: 4 };
        const result = merge<{}>(true, target, source);

        strictEqual(result, target); // The target object is modified
        deepStrictEqual(target, {
            a: 1,
            b: { c: 2, d: 3 },
            e: 4
        });
    });

    it('should handle undefined sources gracefully', () => {
        const obj1 = { a: 1 };
        const obj2 = undefined;
        const obj3 = { b: 2 };
        const result = merge(obj1, obj2, obj3);

        deepStrictEqual(result, { a: 1, b: 2 });
    });

    it('should create a deep copy when only one object is provided', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = merge(obj);

        deepStrictEqual(result, obj);
        notStrictEqual(result, obj); // Should not be the same reference
        notStrictEqual(result.b, obj.b); // Nested objects should also be copies
    });

    it('should prevent prototype pollution', () => {
        const maliciousPayload = JSON.parse('{"__proto__":{"polluted":"yes"}}');
        const obj = {};
        merge(obj, maliciousPayload);
        strictEqual({}.polluted, undefined);

        // test filtering of constructor
        const objConstructor = JSON.parse(`{
            "constructor": {
                "prototype": {
                    "pollutedByConstructor": true
                }
            }
        }`);

        merge({}, objConstructor);
        strictEqual(
            typeof {}.pollutedByConstructor,
            'undefined',
            'The prototype (and window) should not be polluted through merge'
        );
    });


    it('replaces arrays', () => {
        const obj1 = { arr: [1, 2, 3] };
        const obj2 = { arr: [4, 5] };
        const result = merge(obj1, obj2);

        deepStrictEqual(result, { arr: [4, 5] });
    });

    it('should overwrite primitive values with objects and vice versa', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: { b: 2 } };
        const result = merge(obj1, obj2);

        deepStrictEqual(result, { a: { b: 2 } });

        const obj3 = { a: { b: 2 } };
        const obj4 = { a: 3 };
        const result2 = merge(obj3, obj4);

        deepStrictEqual(result2, { a: 3 });
    });

    it('should merge nested objects', () => {
        const obj1 = { a: { b: { c: 1 } } };
        const obj2 = { a: { b: { d: 2 } } };
        const result = merge(obj1, obj2);

        deepStrictEqual(result, {
            a: {
                b: {
                    c: 1,
                    d: 2
                }
            }
        });
    });
});
