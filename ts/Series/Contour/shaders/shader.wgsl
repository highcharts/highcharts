struct VertexInput {
    @location(0) pos: vec3f
}

struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) originalPos: vec3f,
    @location(1) valExtremes: vec2f,
}

@group(0) @binding(0) var<uniform> extremesUniform: vec4f;
@group(0) @binding(1) var<uniform> valueExtremesUniform: vec2f;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let pos = input.pos;

    let xMin = extremesUniform[0];
    let xMax = extremesUniform[1];
    let yMin = extremesUniform[2];
    let yMax = extremesUniform[3];

    output.valExtremes = valueExtremesUniform;
    output.originalPos = pos.xyz;
    output.pos = vec4f(
        (pos.x - xMin) / (xMax - xMin) * 2.0 - 1.0,
        (pos.y - yMin) / (yMax - yMin) * 2.0 - 1.0,
        0,
        1
    );

    return output;
}

// ---------------------------------------------------------------------------

struct FragmentInput {
    @location(0) originalPos: vec3f,
    @location(1) valExtremes: vec2f
}

@group(0) @binding(2) var<storage> colorStops: array<vec4<f32>>;
@group(0) @binding(3) var<uniform> colorStopsCount: u32;
@group(0) @binding(4) var<uniform> contourInterval: f32;
@group(0) @binding(5) var<uniform> smoothColoring: u32;
@group(0) @binding(6) var<uniform> showContourLines: u32;

fn getColor(value: f32) -> vec3<f32> {
    let stopCount = colorStopsCount;

    if (stopCount == 0u) {
        return vec3<f32>(1.0, 1.0, 1.0);
    }

    for (var i: u32 = 0u; i < stopCount - 1u; i = i + 1u) {
        if (value < colorStops[i + 1u].x) {
            let t = (value - colorStops[i].x) / (colorStops[i + 1u].x - colorStops[i].x);
            return mix(colorStops[i].yzw, colorStops[i + 1u].yzw, t);
        }
    }
    return colorStops[stopCount - 1u].yzw;
}

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
    let val = input.originalPos.z;

    // CONTOUR LINES
    let lineWidth: f32 = 1.0;
    let contourColor = vec3f(0.0, 0.0, 0.0);

    let val_dx: f32 = dpdx(val);
    let val_dy: f32 = dpdy(val);
    let gradient: f32 = length(vec2f(val_dx, val_dy));

    let epsilon: f32 = 0.0001;
    let adjustedLineWidth: f32 = lineWidth * gradient + epsilon;

    let valDiv: f32 = val / contourInterval;
    let valMod: f32 = val - contourInterval * floor(valDiv);

    let lineMask: f32 =
        smoothstep(0.0, adjustedLineWidth, valMod) *
        (1.0 - smoothstep(contourInterval - adjustedLineWidth, contourInterval, valMod));

    let contourIndex: f32 = floor(val / contourInterval);
    let averageValInBand : f32 = contourIndex * contourInterval + contourInterval / 2.0;

    // BACKGROUND COLOR
    let minHeight: f32 = input.valExtremes.x;
    let maxHeight: f32 = input.valExtremes.y;
    let normVal: f32 = (val - minHeight) / (maxHeight - minHeight);
    let averageNormVal: f32 = (averageValInBand - minHeight) / (maxHeight - minHeight);

    var bgColor: vec3f;
    if (smoothColoring > 0) {
        bgColor = getColor(normVal);
    } else {
        bgColor = getColor(averageNormVal);
    }

    // MIX
    var pixelColor = bgColor;

    if (showContourLines > 0) {
         pixelColor = mix(contourColor, pixelColor, lineMask);
    }

    return vec4(pixelColor, 1.0);
}
