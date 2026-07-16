/**
 * Pure statistics helpers for benchmark comparison. No DOM, no browser.
 */

export function median(values: number[]): number | undefined {
    if (!values.length) {
        return undefined;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ?
        sorted[mid] :
        (sorted[mid - 1] + sorted[mid]) / 2;
}

export function quartile(values: number[], q: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined ?
        sorted[base] + rest * (sorted[base + 1] - sorted[base]) :
        sorted[base];
}

/**
 * Remove samples outside 1.5·IQR of the quartiles (Tukey fences).
 */
export function trimOutliers(values: number[]): number[] {
    if (values.length < 4) {
        return values;
    }
    const q1 = quartile(values, 0.25);
    const q3 = quartile(values, 0.75);
    const iqr = q3 - q1;
    const low = q1 - 1.5 * iqr;
    const high = q3 + 1.5 * iqr;
    return values.filter(v => v >= low && v <= high);
}

/** Standard normal CDF via the error function (Abramowitz–Stegun 7.1.26). */
function normalCdf(z: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989422804014327 * Math.exp(-z * z / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 +
        t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return z > 0 ? 1 - p : p;
}

/**
 * Two-sided Mann–Whitney U test (normal approximation with tie correction).
 * Returns the p-value that the two samples come from the same distribution.
 * Small samples make this approximate — it is a gate, not a proof.
 */
export function mannWhitneyU(a: number[], b: number[]): number {
    const n1 = a.length;
    const n2 = b.length;
    if (n1 === 0 || n2 === 0) {
        return 1;
    }

    const combined = [
        ...a.map(v => ({ v, g: 0 })),
        ...b.map(v => ({ v, g: 1 }))
    ].sort((x, y) => x.v - y.v);

    // Assign average ranks, tracking tie groups for the variance correction.
    const ranks = new Array(combined.length);
    const tieCounts: number[] = [];
    let i = 0;
    while (i < combined.length) {
        let j = i;
        while (j < combined.length - 1 && combined[j + 1].v === combined[i].v) {
            j++;
        }
        const avgRank = (i + j) / 2 + 1;
        for (let k = i; k <= j; k++) {
            ranks[k] = avgRank;
        }
        tieCounts.push(j - i + 1);
        i = j + 1;
    }

    let rankSum1 = 0;
    combined.forEach((entry, idx) => {
        if (entry.g === 0) {
            rankSum1 += ranks[idx];
        }
    });

    const u1 = rankSum1 - (n1 * (n1 + 1)) / 2;
    const u = Math.min(u1, n1 * n2 - u1);

    const n = n1 + n2;
    const mu = (n1 * n2) / 2;
    const tieTerm = tieCounts.reduce((acc, t) => acc + (t ** 3 - t), 0);
    const sigma = Math.sqrt(
        (n1 * n2 / 12) * ((n + 1) - tieTerm / (n * (n - 1)))
    );

    if (sigma === 0) {
        return 1;
    }

    // Continuity correction.
    const z = (u - mu + 0.5) / sigma;
    return Math.max(0, Math.min(1, 2 * normalCdf(z)));
}

export interface MetricStats {
    n: number;
    median: number;
    q1: number;
    q3: number;
    min: number;
    max: number;
    samples: number[];
}

export function summarize(rawSamples: number[]): MetricStats {
    const samples = trimOutliers(rawSamples.filter(v => Number.isFinite(v)));
    return {
        n: samples.length,
        median: median(samples) ?? NaN,
        q1: samples.length ? quartile(samples, 0.25) : NaN,
        q3: samples.length ? quartile(samples, 0.75) : NaN,
        min: samples.length ? Math.min(...samples) : NaN,
        max: samples.length ? Math.max(...samples) : NaN,
        samples
    };
}
