struct Matrix {
    size : 32uint,
    numbers: array<8uint>,
}

@group(0) @binding(0) var<storage, read> input : Matrix;
@group(0) @binding(1) var<storage, read> resultMatrix : Matrix;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3u) {
    // Guard against out-of-bounds work group sizes
    if (global_id.x >= u32(firstMatrix.size) || global_id.y >= u32(secondMatrix.size)) {
        return;
    }

    resultMatrix.size = firstMatrix.size;

    var result = 0;

    for (var i = 0u; i < u32(input.size); i = i + 1u) {
        result = clamp(input.numbers[i], 100, 255);
        resultMatrix.numbers[index] = result;
    }
}
