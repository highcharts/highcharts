export type BenchmarkResult = number;

export type BenchmarkDetails = {
    test: string;
    sampleSize: number;
    min: number;
    max: number;
    results: BenchmarkResult[];
    avg: number;
    stdDev: number;
}

export type BenchResults = BenchmarkDetails[];
export type BenchmarkFunction = () => BenchmarkResult;
