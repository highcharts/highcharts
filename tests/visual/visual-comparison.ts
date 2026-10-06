import type { Page } from '@playwright/test';

export type VisualComparator = {
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    compare: (data1: Uint8ClampedArray, data2: Uint8ClampedArray) => number;
    createCanvas: (id: string) => HTMLCanvasElement;
    getSVG: (chart?: { container: HTMLElement }) => string;
    svgToPixels: (
        svg: string,
        canvas: HTMLCanvasElement
    ) => Promise<Uint8ClampedArray>;
};

type ComparisonResult = {
    candidatePixels?: string;
    difference: number;
    height: number;
    referencePixels?: string;
    width: number;
};

export async function compareVisualSVGs(
    page: Page,
    referenceSVG: string,
    candidateSVG: string
): Promise<ComparisonResult> {
    return page.evaluate(async ({ referenceSVG, candidateSVG }) => {
        const comparator = (window as Window & {
            VisualComparator?: VisualComparator;
        }).VisualComparator;

        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }

        const pixels = await Promise.all([
            comparator.svgToPixels(
                referenceSVG,
                comparator.createCanvas('reference')
            ),
            comparator.svgToPixels(
                candidateSVG,
                comparator.createCanvas('candidate')
            )
        ]);
        const difference = comparator.compare(pixels[0], pixels[1]);

        // Transport strings instead of millions of individual pixel values.
        const toBase64 = (data: Uint8ClampedArray): string => {
            const chunks: string[] = [];
            for (let offset = 0; offset < data.length; offset += 32768) {
                chunks.push(String.fromCharCode(
                    ...data.subarray(offset, offset + 32768)
                ));
            }
            return btoa(chunks.join(''));
        };

        return {
            difference,
            width: comparator.CANVAS_WIDTH,
            height: comparator.CANVAS_HEIGHT,
            ...(difference ? {
                referencePixels: toBase64(pixels[0]),
                candidatePixels: toBase64(pixels[1])
            } : {})
        };
    }, { referenceSVG, candidateSVG });
}
