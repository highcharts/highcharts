import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import Delaunay from '../../../ts/Core/Delaunay';

describe('Delaunay triangulation', () => {
    it('less than 3 points should return empty array', () => {
        const points = new Float32Array([0, 0, 1, 0]);
        const delaunay = new Delaunay(points);
        strictEqual(delaunay.triangles.length, 0);
    });

    it('collinear points should return empty array', () => {
        const points = new Float32Array([0, 0, 1, 1, 2, 2]);
        const delaunay = new Delaunay(points);
        strictEqual(delaunay.triangles.length, 0);
    });

    it('should return valid triangles for regular polygon', () => {
        const points = new Float32Array([0, 0.5, 10, 0, -2, -3, 4, 5]);
        const delaunay = new Delaunay(points);
        deepStrictEqual(delaunay.triangles, Uint32Array.of(0, 2, 1, 3, 0, 1));
    });
});
