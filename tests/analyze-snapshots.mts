#!/usr/bin/env node

/**
 * Analyze Visual Test Snapshots
 * 
 * This script analyzes the Playwright visual test snapshots to show
 * the distribution of SVG vs PNG snapshot files.
 * 
 * SVG snapshots are used for single-chart tests (most tests).
 * PNG snapshots are used for multi-chart or complex layout tests.
 * 
 * Usage:
 *   node analyze-snapshots.mjs           # Show summary
 *   node analyze-snapshots.mjs --verbose # Show detailed list of PNG snapshots
 *   node analyze-snapshots.mjs -v        # Short form of --verbose
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SNAPSHOT_DIR = join(__dirname, 'visual/visual.spec.ts-snapshots');

interface SnapshotStats {
    svg: number;
    png: number;
    other: number;
    total: number;
}

async function analyzeSnapshots(): Promise<void> {
    console.log('Analyzing visual test snapshots...\n');
    
    try {
        const files = await readdir(SNAPSHOT_DIR);
        
        const stats: SnapshotStats = {
            svg: 0,
            png: 0,
            other: 0,
            total: 0
        };
        
        const pngFiles: string[] = [];
        
        // Count file types
        for (const file of files) {
            if (file.endsWith('.svg')) {
                stats.svg++;
            } else if (file.endsWith('.png')) {
                stats.png++;
                pngFiles.push(file);
            } else {
                stats.other++;
            }
            stats.total++;
        }
        
        // Calculate percentages
        const svgPercent = ((stats.svg / stats.total) * 100).toFixed(1);
        const pngPercent = ((stats.png / stats.total) * 100).toFixed(1);
        
        // Display results
        console.log('📊 Snapshot Analysis Results');
        console.log('─'.repeat(50));
        console.log(`Total snapshots:     ${stats.total}`);
        console.log();
        console.log(`📄 SVG files:        ${stats.svg.toString().padStart(6)} (${svgPercent}%)`);
        console.log(`🖼️  PNG files:        ${stats.png.toString().padStart(6)} (${pngPercent}%)`);
        
        if (stats.other > 0) {
            console.log(`❓ Other files:      ${stats.other.toString().padStart(6)}`);
        }
        
        console.log();
        console.log('─'.repeat(50));
        
        // Additional insights
        const ratio = stats.svg > 0 && stats.png > 0 
            ? (stats.svg / stats.png).toFixed(2) 
            : 'N/A';
        
        console.log(`\n📈 SVG to PNG ratio: ${ratio}:1`);
        
        if (stats.svg > stats.png) {
            console.log(`✨ ${stats.svg - stats.png} more SVG snapshots than PNG`);
        } else if (stats.png > stats.svg) {
            console.log(`✨ ${stats.png - stats.svg} more PNG snapshots than SVG`);
        } else {
            console.log('✨ Equal number of SVG and PNG snapshots');
        }
        
        // Show details if --verbose flag is passed
        if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
            console.log('\n\n🖼️  PNG Snapshots (multi-chart tests):');
            console.log('─'.repeat(70));
            
            // Sort and display PNG files
            const sortedPngFiles = [...pngFiles].sort();
            
            sortedPngFiles.forEach((file, i) => {
                // Truncate long filenames for readability
                const displayName = file.length > 65 
                    ? file.substring(0, 62) + '...'
                    : file;
                console.log(`  ${(i + 1).toString().padStart(2)}. ${displayName}`);
            });
        }
        
    } catch (error) {
        const errorMessage = error instanceof Error ? 
            error.message : 
            String(error);
        console.error('❌ Error reading snapshot directory:', errorMessage);
        console.error(
            `\nMake sure the snapshot directory exists at:\n${SNAPSHOT_DIR}`
        );
        process.exit(1);
    }
}

void analyzeSnapshots();
