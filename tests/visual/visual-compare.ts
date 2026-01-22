import type { Browser, BrowserContext, Page } from '@playwright/test';
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, sep } from 'node:path';
import { PNG } from 'pngjs';
import { GIFEncoder as gifenc, quantize, applyPalette } from 'gifenc';

export interface ComparisonResult {
    passed: boolean;
    diffPixels: number;
    candidatePath: string;
    referencePath: string;
    diffPath?: string;
}

type PngInstance = {
    width: number;
    height: number;
    data: Uint8Array;
};

type PngConstructor = {
    new (options: { width: number; height: number }): PngInstance;
    sync: {
        read: (data: Buffer) => PngInstance;
        write: (png: PngInstance) => Buffer;
    };
};

const Png = PNG as unknown as PngConstructor;

type GifEncoderInstance = {
    writeFrame: (
        frame: Uint8Array,
        width: number,
        height: number,
        options: { palette: Uint8Array; delay: number }
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
};

type GifEncoderFactory = () => GifEncoderInstance;

type QuantizeFn = (data: Uint8Array, maxColors: number) => Uint8Array;

type ApplyPaletteFn = (data: Uint8Array, palette: Uint8Array) => Uint8Array;

const createGifEncoder = gifenc as unknown as GifEncoderFactory;
const quantizePalette = quantize as unknown as QuantizeFn;
const applyPaletteToFrame = applyPalette as unknown as ApplyPaletteFn;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

let renderBrowser: Browser | null = null;
let renderContext: BrowserContext | null = null;
let renderPagePromise: Promise<Page> | null = null;

async function getRenderPage(): Promise<Page> {
    if (renderPagePromise === null) {
        renderPagePromise = (async () => {
            renderBrowser = await chromium.launch({
                headless: true,
                args: [
                    '--enable-gpu',
                    '--ignore-gpu-blocklist',
                    '--enable-zero-copy',
                    '--use-angle=gl',
                    '--use-gl=angle',
                    '--disable-software-rasterizer'
                ]
            });
            renderContext = await renderBrowser.newContext({
                viewport: {
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT
                },
                deviceScaleFactor: 1
            });
            return renderContext.newPage();
        })();
    }

    return renderPagePromise;
}

function normalizeSamplePath(samplePath: string): string {
    const normalized = samplePath.replace(/\\/g, '/');
    if (normalized.includes('/samples/') || normalized.startsWith('samples/')) {
        return normalized;
    }
    return posix.join(
        process.cwd().split(sep).join('/'),
        'samples',
        normalized
    );
}

function resolveSampleDir(samplePath: string): string {
    const normalized = normalizeSamplePath(samplePath);
    if (/\/demo\.(?:js|mjs|ts)$/u.test(normalized)) {
        return dirname(normalized);
    }
    if (
        normalized.endsWith('/demo.js') ||
        normalized.endsWith('/demo.mjs') ||
        normalized.endsWith('/demo.ts')
    ) {
        return dirname(normalized);
    }
    if (
        normalized.endsWith('demo.js') ||
        normalized.endsWith('demo.mjs') ||
        normalized.endsWith('demo.ts')
    ) {
        return dirname(normalized);
    }
    return normalized;
}

async function renderSvgToPng(svgContent: string): Promise<PngInstance> {
    const page = await getRenderPage();
    const html = `<!DOCTYPE html><html><head><style>
body { margin: 0; background: #fff; }
svg { display: block; }
</style></head><body>${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const buffer = await page.screenshot({
        clip: { x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }
    });

    return Png.sync.read(buffer);
}

function getSampleKey(samplePath: string): string {
    const normalized = normalizeSamplePath(samplePath);
    const samplesIndex = normalized.indexOf('/samples/');
    const trimmed = samplesIndex >= 0 ?
        normalized.slice(samplesIndex + 9) :
        normalized;
    return trimmed.replace(/\/demo\.(js|mjs|ts)$/u, '');
}

function shouldWriteDebug(samplePath: string): boolean {
    if (!process.env.VISUAL_COMPARE_DEBUG) {
        return false;
    }

    const filters = (process.env.VISUAL_COMPARE_DEBUG_SAMPLES ?? '')
        .split(/[,;\n]/)
        .map((value) => value.trim())
        .filter(Boolean);

    if (!filters.length) {
        return true;
    }

    const sampleKey = getSampleKey(samplePath);
    return filters.some((filter) => sampleKey.includes(filter));
}

function writeDebugImages(
    sampleDir: string,
    reference: PngInstance,
    candidate: PngInstance
): void {
    const debugDir = join(sampleDir, 'debug');
    mkdirSync(debugDir, { recursive: true });

    writeFileSync(
        join(debugDir, 'reference.png'),
        Png.sync.write(reference)
    );
    writeFileSync(
        join(debugDir, 'candidate.png'),
        Png.sync.write(candidate)
    );

    const diff = new Png({
        width: reference.width,
        height: reference.height
    });
    const length = Math.min(reference.data.length, candidate.data.length);
    for (let index = 0; index < length; index += 4) {
        const isDifferent =
            reference.data[index] !== candidate.data[index] ||
            reference.data[index + 1] !== candidate.data[index + 1] ||
            reference.data[index + 2] !== candidate.data[index + 2] ||
            reference.data[index + 3] !== candidate.data[index + 3];

        if (isDifferent) {
            diff.data[index] = 255;
            diff.data[index + 1] = 0;
            diff.data[index + 2] = 0;
            diff.data[index + 3] = 255;
        } else {
            diff.data[index] = 0;
            diff.data[index + 1] = 0;
            diff.data[index + 2] = 0;
            diff.data[index + 3] = 0;
        }
    }

    writeFileSync(
        join(debugDir, 'diff.png'),
        Png.sync.write(diff)
    );
}

function countDiffPixels(
    reference: PngInstance,
    candidate: PngInstance
): number {
    if (
        reference.width !== candidate.width ||
        reference.height !== candidate.height
    ) {
        return Math.max(
            reference.width * reference.height,
            candidate.width * candidate.height
        );
    }
    const data1 = reference.data;
    const data2 = candidate.data;
    const length = Math.min(data1.length, data2.length);
    let diff = 0;

    for (let index = 0; index < length; index += 4) {
        if (
            Math.abs(data1[index] - data2[index]) !== 0 ||
            Math.abs(data1[index + 1] - data2[index + 1]) !== 0 ||
            Math.abs(data1[index + 2] - data2[index + 2]) !== 0 ||
            Math.abs(data1[index + 3] - data2[index + 3]) !== 0
        ) {
            diff++;
        }
    }

    return diff;
}

export async function compareSVG(
    samplePath: string,
    svgContent: string,
    options: { generateDiff?: boolean; referenceMode?: boolean } = {}
): Promise<ComparisonResult> {
    const sampleDir = resolveSampleDir(samplePath);
    const candidatePath = join(sampleDir, 'candidate.svg');
    const referencePath = join(sampleDir, 'reference.svg');
    const diffPath = join(sampleDir, 'diff.gif');

    mkdirSync(sampleDir, { recursive: true });
    if (options.referenceMode) {
        writeFileSync(referencePath, svgContent);
        return {
            passed: true,
            diffPixels: 0,
            candidatePath,
            referencePath
        };
    }

    writeFileSync(candidatePath, svgContent);

    let referenceSvg = '';
    try {
        referenceSvg = readFileSync(referencePath, 'utf8');
    } catch (error) {
        const message =
            `Missing reference.svg for ${sampleDir}: ${(error as Error).message}`;
        throw new Error(message);
    }

    const referencePng = await renderSvgToPng(referenceSvg);
    const candidatePng = await renderSvgToPng(svgContent);

    if (shouldWriteDebug(samplePath)) {
        writeDebugImages(sampleDir, referencePng, candidatePng);
    }


    const diffPixels = countDiffPixels(referencePng, candidatePng);
    const passed = diffPixels === 0;

    if (!passed && options.generateDiff) {
        await generateDiffGif(referencePath, candidatePath, diffPath);
    }

    const resolvedDiffPath =
        options.generateDiff && !passed ? diffPath : undefined;

    return {
        passed,
        diffPixels,
        candidatePath,
        referencePath,
        diffPath: resolvedDiffPath
    };
}

export async function generateDiffGif(
    referencePath: string,
    candidatePath: string,
    outputPath: string
): Promise<void> {
    const referenceSvg = readFileSync(referencePath, 'utf8');
    const candidateSvg = readFileSync(candidatePath, 'utf8');

    const referencePng = await renderSvgToPng(referenceSvg);
    const candidatePng = await renderSvgToPng(candidateSvg);

    const frames = [referencePng.data, candidatePng.data];
    const combinedData = new Uint8Array(
        referencePng.data.length + candidatePng.data.length
    );
    combinedData.set(referencePng.data, 0);
    combinedData.set(candidatePng.data, referencePng.data.length);
    const palette = quantizePalette(combinedData, 256);
    const gif = createGifEncoder();

    for (const frame of frames) {
        const indexedFrame = applyPaletteToFrame(frame, palette);
        gif.writeFrame(
            indexedFrame,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            {
                palette,
                delay: 500
            }
        );
    }

    gif.finish();
    const gifData = gif.bytes();
    writeFileSync(outputPath, Buffer.from(gifData));
}

export async function closeCompareBrowser(): Promise<void> {
    if (renderContext) {
        await renderContext.close();
    }
    if (renderBrowser) {
        await renderBrowser.close();
    }
    renderBrowser = null;
    renderContext = null;
    renderPagePromise = null;
}
