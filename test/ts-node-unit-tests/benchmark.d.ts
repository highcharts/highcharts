export type BenchmarkResult = number;

export type BenchmarkDetails = {
    test: string;
    sampleSize: number;
    min: number;
    max: number;
    results: BenchmarkResult[];
    avg: number;
    Q1: number;
    Q3: number;
    stdDev: number;
}

export type BenchResults = BenchmarkDetails[];

export type BenchmarkContext<T = any> = {
    size: number,
    CODE_PATH: string,
    data: T
};

export type BenchmarkFunction =
    (context: BenchmarkContext) => Promise<BenchmarkResult>;
