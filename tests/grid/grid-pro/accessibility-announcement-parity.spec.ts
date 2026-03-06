import type { Locator, Page, TestInfo } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

type CellAnnouncementModel = {
    ariaSnapshot: string;
    cellRoleAttribute: string | null;
    cellTagName: string;
    cellText: string | null;
    columnHeaderText: string | null;
    dataColumnId: string | null;
    dataValue: string | null;
    headerTexts: string[];
    headers: string[];
    rowHeaderText: string | null;
    scope: string | null;
    tableDescription: string | null;
    tableName: string | null;
    tableRoleAttribute: string | null;
    tableTagName: string | null;
};

type FocusStep = CellAnnouncementModel & {
    step: string;
};

type RowSemanticsModel = {
    ariaSnapshot: string;
    cells: Omit<CellAnnouncementModel, 'ariaSnapshot'>[];
};

function normalizeText(text: string | null | undefined): string | null {
    const normalized = text?.replace(/\s+/gu, ' ').trim();

    return normalized ? normalized : null;
}

async function gotoParityHarness(page: Page): Promise<void> {
    await page.goto('/grid-pro/e2e/accessibility-announcement-parity', {
        waitUntil: 'networkidle'
    });

    await page.waitForFunction((): boolean => {
        return Boolean(
            (window as any).grid &&
            document.querySelector('#native-table tbody td[data-column-id="weight"]') &&
            document.querySelector('#grid-container tbody td[data-column-id="weight"]')
        );
    });
}

async function captureCellAnnouncement(
    locator: Locator
): Promise<CellAnnouncementModel> {
    const ariaSnapshot = await locator.ariaSnapshot();
    const model = await locator.evaluate((node): Omit<CellAnnouncementModel, 'ariaSnapshot'> => {
        const cell = node as HTMLElement;
        const table = cell.closest('table');
        const row = cell.closest('tr');
        const headers = (cell.getAttribute('headers') || '')
            .split(/\s+/u)
            .filter(Boolean);

        const resolveText = (element: Element | null): string | null => {
            return element?.textContent?.replace(/\s+/gu, ' ').trim() || null;
        };

        const resolveIdsText = (attributeName: 'aria-describedby' | 'aria-labelledby'): string | null => {
            const ids = (table?.getAttribute(attributeName) || '')
                .split(/\s+/u)
                .filter(Boolean);
            const text = ids
                .map((id): string => {
                    return resolveText(document.getElementById(id)) || '';
                })
                .filter(Boolean)
                .join(' ');

            return text || null;
        };

        const dataColumnId = cell.getAttribute('data-column-id');
        const rowHeaderCell = cell.matches('th[scope="row"], [role="rowheader"]') ?
            cell :
            row?.querySelector('th[scope="row"], [role="rowheader"]') || null;
        const columnHeaderCell = dataColumnId ?
            table?.querySelector(`thead th[data-column-id="${dataColumnId}"]`) || null :
            null;

        return {
            cellRoleAttribute: cell.getAttribute('role'),
            cellTagName: cell.tagName.toLowerCase(),
            cellText: resolveText(cell),
            columnHeaderText: resolveText(columnHeaderCell),
            dataColumnId,
            dataValue: cell.getAttribute('data-value'),
            headerTexts: headers.map((id): string => {
                return resolveText(document.getElementById(id)) || '';
            }),
            headers,
            rowHeaderText: resolveText(rowHeaderCell),
            scope: cell.getAttribute('scope'),
            tableDescription:
                table?.getAttribute('aria-description') ||
                resolveIdsText('aria-describedby'),
            tableName:
                table?.getAttribute('aria-label') ||
                resolveIdsText('aria-labelledby') ||
                resolveText(table?.querySelector('caption') || null),
            tableRoleAttribute: table?.getAttribute('role') || null,
            tableTagName: table?.tagName.toLowerCase() || null
        };
    });

    return {
        ...model,
        ariaSnapshot: normalizeText(ariaSnapshot) || ''
    };
}

async function captureFocusSequence(
    page: Page,
    beforeSelector: string
): Promise<FocusStep[]> {
    const sequence: FocusStep[] = [];

    await page.locator(beforeSelector).focus();
    await page.keyboard.press('Tab');
    sequence.push({
        step: 'tab-entry',
        ...await captureCellAnnouncement(page.locator(':focus'))
    });

    await page.keyboard.press('ArrowDown');
    sequence.push({
        step: 'arrow-down',
        ...await captureCellAnnouncement(page.locator(':focus'))
    });

    await page.keyboard.press('ArrowRight');
    sequence.push({
        step: 'arrow-right',
        ...await captureCellAnnouncement(page.locator(':focus'))
    });

    return sequence;
}

async function captureRowSemantics(row: Locator): Promise<RowSemanticsModel> {
    const ariaSnapshot = await row.ariaSnapshot();
    const cells = await row.evaluate((node): RowSemanticsModel['cells'] => {
        const rowElement = node as HTMLTableRowElement;
        const table = rowElement.closest('table');

        const resolveText = (element: Element | null): string | null => {
            return element?.textContent?.replace(/\s+/gu, ' ').trim() || null;
        };

        return Array.from(rowElement.cells).map((cell): RowSemanticsModel['cells'][number] => {
            const headers = (cell.getAttribute('headers') || '')
                .split(/\s+/u)
                .filter(Boolean);
            const dataColumnId = cell.getAttribute('data-column-id');
            const rowHeaderCell = cell.matches('th[scope="row"], [role="rowheader"]') ?
                cell :
                rowElement.querySelector('th[scope="row"], [role="rowheader"]') || null;
            const columnHeaderCell = dataColumnId ?
                table?.querySelector(`thead th[data-column-id="${dataColumnId}"]`) || null :
                null;

            return {
                cellRoleAttribute: cell.getAttribute('role'),
                cellTagName: cell.tagName.toLowerCase(),
                cellText: resolveText(cell),
                columnHeaderText: resolveText(columnHeaderCell),
                dataColumnId,
                dataValue: cell.getAttribute('data-value'),
                headerTexts: headers.map((id): string => {
                    return resolveText(document.getElementById(id)) || '';
                }),
                headers,
                rowHeaderText: resolveText(rowHeaderCell),
                scope: cell.getAttribute('scope'),
                tableDescription: null,
                tableName: null,
                tableRoleAttribute: table?.getAttribute('role') || null,
                tableTagName: table?.tagName.toLowerCase() || null
            };
        });
    });

    return {
        ariaSnapshot: normalizeText(ariaSnapshot) || '',
        cells
    };
}

async function attachComparison(
    testInfo: TestInfo,
    name: string,
    nativeModel: unknown,
    gridModel: unknown
): Promise<void> {
    await testInfo.attach(name, {
        body: Buffer.from(JSON.stringify({
            native: nativeModel,
            grid: gridModel
        }, null, 2)),
        contentType: 'application/json'
    });
}

test.describe('Accessibility announcement parity', () => {
    test.beforeEach(async ({ page }) => {
        await gotoParityHarness(page);
    });

    test('Arrow-key focus announcements should match the native table baseline', async ({ page }, testInfo) => {
        test.fail();

        const nativeSequence = await captureFocusSequence(
            page,
            '#before-native'
        );
        expect(
            nativeSequence.map((step): string | null => step.dataColumnId)
        ).toEqual(['product', 'product', 'weight']);

        const gridSequence = await captureFocusSequence(page, '#before-grid');
        expect(
            gridSequence.map((step): string | null => step.dataColumnId)
        ).toEqual(['product', 'product', 'weight']);

        await attachComparison(
            testInfo,
            'normal-keyboard-navigation-parity',
            nativeSequence,
            gridSequence
        );

        expect(gridSequence).toEqual(nativeSequence);
    });

    test('First-row table semantics should match the native VO/table-navigation baseline', async ({ page }, testInfo) => {
        test.fail();

        // Playwright cannot capture VoiceOver speech, so compare the row and
        // cell semantics that screen-reader table navigation depends on.
        const nativeRow = await captureRowSemantics(
            page.locator('#native-table tbody tr').first()
        );
        const gridRow = await captureRowSemantics(
            page.locator('#grid-container tbody tr').first()
        );

        expect(nativeRow.cells).toHaveLength(3);
        expect(gridRow.cells).toHaveLength(3);

        await attachComparison(
            testInfo,
            'table-navigation-parity',
            nativeRow,
            gridRow
        );

        expect(gridRow).toEqual(nativeRow);
    });
});
