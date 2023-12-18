struct Matrix {
    size: vec2<u32>, // x and y dimensons
    numbers: array<u32>,
}

@group(0) @binding(0) var<storage, read> input : Matrix;
@group(0) @binding(1) var<storage, read_write> resultMatrix : Matrix;

@compute @workgroup_size(8, 8)
fn main() {
    var result = u32(0);
    var vertices: vec2<u32>;
    resultMatrix.size = input.size;

    for (var i = 0u; i < input.size.y * input.size.x; i = i + 4u) {

        var j = u32(0);
        while(j < 4){
            result = input.numbers[i + j];
            resultMatrix.numbers[i + j] = result;
            j++;
        }

    }
}

