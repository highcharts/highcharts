// eslint-disable-next-line node/no-unpublished-import
import Delaunay from '../../../../code/es-modules/Core/Delaunay.js';

const gl = document.getElementById('canvas').getContext('webgl2');
const program = createShaderProgram();
const pointsNo = document.getElementById('points-no');
const generatePointsBtn = document.getElementById('generate-points');
const triangulationTime = document.getElementById('triangulation-time');

generateAndRender();
generatePointsBtn.addEventListener('click', generateAndRender);

function generateAndRender() {
    const pts = new Float32Array(Array.from({
        length: pointsNo.value * 2
    }, () => Math.random() * 100 - 50));

    const startTime = performance.now();
    const ids = new Delaunay(pts).triangles;
    const endTime = performance.now();

    triangulationTime.textContent = (endTime - startTime).toFixed(2);

    renderTriangulation(pts, ids);
}

function createShaderProgram() {
    const vs = `#version 300 es
        in vec2 pos;
        uniform vec4 u;
        void main() {
            vec2 q = (pos - u.xy) * u.zw;
            gl_Position = vec4(q, 0, 1);
        }
    `;
    const fs = `#version 300 es
        precision mediump float;
        out vec4 o;
        void main() {
            o = vec4(1);
        }
    `;

    function shader(t, s) {
        const x = gl.createShader(t);
        gl.shaderSource(x, s);
        gl.compileShader(x);
        return x;
    }

    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
}

function renderTriangulation(p, idx) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, p, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const n = (idx.length / 3) | 0,
        L = new Uint32Array(n * 6);
    for (let t = 0, w = 0; t < n; t++) {
        const i = idx[t * 3],
            j = idx[t * 3 + 1],
            k = idx[t * 3 + 2];
        L[w++] = i;
        L[w++] = j;
        L[w++] = j;
        L[w++] = k;
        L[w++] = k;
        L[w++] = i;
    }
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, L, gl.STATIC_DRAW);

    let minx = Infinity,
        miny = Infinity,
        maxx = -Infinity,
        maxy = -Infinity;

    for (let i = 0; i < p.length; i += 2) {
        const x = p[i],
            y = p[i + 1];
        if (x < minx) {
            minx = x;
        }
        if (y < miny) {
            miny = y;
        }
        if (x > maxx) {
            maxx = x;
        }
        if (y > maxy) {
            maxy = y;
        }
    }
    const cx = (minx + maxx) / 2,
        cy = (miny + maxy) / 2,
        span = Math.max(maxx - minx || 1, maxy - miny || 1),
        w = (gl.canvas.width = gl.canvas.clientWidth || 800),
        h = (gl.canvas.height = gl.canvas.clientHeight || 600),
        aspect = w / h,
        s = 2 / span,
        sx = aspect > 1 ? (s * h) / w : s,
        sy = aspect > 1 ? s : (s * w) / h;

    gl.viewport(0, 0, w, h);
    gl.uniform4f(gl.getUniformLocation(program, 'u'), cx, cy, sx, sy);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.LINES, L.length, gl.UNSIGNED_INT, 0);
}
