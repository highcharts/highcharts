/* *
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import type * as APIDB from '../../../hc-apidoc-backend/lib';

import * as FS from 'node:fs';

import * as DTS from '../libs/DTS';
import * as Utilities from './Utilities';


/* *
 *
 *  Declarations
 *
 * */


interface InfoMetaAddon extends DTS.InfoMeta {
    optionNames?: Array<string>;
}


/* *
 *
 *  Class
 *
 * */


export class MergerSession {


    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * 
     * @param connectionString
     * `user:password@server:port/database`
     *
     * @param declarationsFolder
     * Folder path to the definition files (.d.ts) containing declarations.
     *
     * @param productNamespace
     * Product's global namespace.
     *
     * @param productURLName
     * Product name as used on the website.
     *
     * @param productVersion
     * Release version to merge and save.
     *
     * @return
     * Promise of MergerSession.
     */

    public static async createMergerSession(
        connectionString: string,
        declarationsFolder: string,
        productNamespace: string,
        productURLName: string,
        releaseVersion: string
    ): Promise<MergerSession> {
        const APIDB = await import('../../../hc-apidoc-backend/lib/index.js');
        const database = new APIDB.APIDocDatabase({
            postgres: {
                connectionString: `postgresql://${connectionString}`
            }
        });
        const declarations = DTS.getProject(declarationsFolder);
        const productVersion = APIDB.parseSemanticVersion(releaseVersion);

        const mergerSession = new MergerSession(
            database,
            declarations,
            productNamespace,
            productURLName,
            productVersion
        );

        if (!await mergerSession.activateOrCreateProductPlatform()) {
            throw new Error('Product is not available.');
        }

        return mergerSession;
    }


    /* *
     *
     *  Constructor
     *
     * */


    private constructor (
        database: APIDB.APIDocDatabase,
        declarations: DTS.Project,
        productNamespace: string,
        productURLName: string,
        productVersion: number
    ) {
        this.database = database;
        this.declarations = declarations;
        this.productNamespace = productNamespace;
        this.productURLName = productURLName;
        this.productVersion = productVersion;
    }


    /* *
     *
     *  Properties
     *
     * */


    public readonly database: APIDB.APIDocDatabase;


    public readonly declarations: DTS.Project;


    public readonly mergedItems: Record<string, APIDB.ItemRow> = {};


    private optionStack: Array<DTS.CodeInfo> = [];


    public readonly productNamespace: string;


    public readonly productURLName: string;


    public readonly productVersion: number;


    /* *
     *
     *  Functions
     *
     * */


    public async activateOrCreateProductPlatform(): Promise<boolean> {
        const database = this.database;
        const productURLName = this.productURLName;
        const productVersion = this.productVersion;

        if (await database.activateProductPlatform(
            'js',
            productURLName,
            void 0,
            productVersion
        )) {
            return true;
        }

        let platformId = database.activePlatform.id; 

        if (!platformId) {
            const platformRow = await database.setPlatform({
                url_name: 'js'
            });

            if (!platformRow?.id) {
                return false;
            }

            platformId = platformRow.id;
        }

        let productId = database.activeProduct.id;

        if (!database.activeProduct.id) {
            const productRow = await database.setProduct({
                latest_version: productVersion,
                platform_id: platformId,
                url_name: productURLName
            });

            if (!productRow?.id) {
                return false;
            }

            productId = productRow.id;
        }

        return await database.activateProductPlatform(
            'js',
            productURLName,
            void 0,
            productVersion
        );
    }


    /**
     * Merges matching item rows from the database into the merger session.
     *
     * @return
     * Promise to keep.
     */
    public async mergeDatabase(): Promise<void> {
        const database = this.database;

        for (const item of await database.getItemChildren('')) {
            await this.mergeItem(item);
        }

    }


    /**
     * Merges code information into the merger session.
     *
     * @param path
     * Path for the item row.
     *
     * @param info
     * Code information.
     *
     * @return
     * Promise to keep.
     */
    public async mergeInfo(
        path: string,
        info: DTS.CodeInfo,
    ): Promise<void> {
        const APIDB = await import('../../../hc-apidoc-backend/lib/index.js');
        const database = this.database;

        const optionItemRow: APIDB.ItemRow = {
            path,
            description: '',
            since: 1,
            product_id: database.activeProduct.id!,
            meta: {
                file: info.meta.file
            }
        };

        const optionDoclet = info.doclet;

        if (optionDoclet) {
            if (optionDoclet.description) {
                optionItemRow.description =
                    DTS.extractTagText(optionDoclet, 'description', true);
            }
            if (optionDoclet.since) {
                const since = APIDB.parseSemanticVersion(
                    DTS.extractTagText(optionDoclet, 'since'),
                );
                if (since >= 0) {
                    optionItemRow.since = since;
                }
            }
            if (optionDoclet.before) {
                const before = APIDB.parseSemanticVersion(
                    DTS.extractTagText(optionDoclet, 'before'),
                );
                if (before >= 0) {
                    optionItemRow.before = before;
                }
            }
        }

        await this.mergeItem(optionItemRow);
    }


    /**
     * Creates or merges the item row into the merger session.
     *
     * @param itemRow
     * Item row to create or merge.
     *
     * @return
     * Promise to keep.
     */
    public async mergeItem(
        itemRow: APIDB.ItemRow,
    ): Promise<void> {
        const mergedItems = this.mergedItems;

        let itemRowTarget = mergedItems[itemRow.path];

        if (!itemRowTarget) {
            mergedItems[itemRow.path] = itemRow;
            return;
        }

        itemRowTarget.before = (
            (itemRowTarget.before || 0) < (itemRow.before || 0) ?
                itemRowTarget.before :
                itemRow.before
        );

        if (itemRow.description) {
            if (!itemRowTarget.description) {
                itemRowTarget.description = itemRow.description;
            } else if (
                !itemRowTarget.description.includes(itemRow.description) &&
                !itemRow.description.includes(itemRowTarget.description)
            ) {
                itemRowTarget.description += '\n\n' + itemRow.description;
            }
        }

        if (itemRow.doclet) {
            if (!itemRowTarget.doclet) {
                itemRowTarget.doclet = itemRow.doclet;
            } else {
                const doclet = itemRow.doclet;
                const docletTarget = itemRowTarget.doclet;

                for (const tag in doclet) {
                    if (!docletTarget[tag]) {
                        docletTarget[tag] = doclet[tag]!.slice();
                    } else {
                        docletTarget[tag] = Array.from(new Set([
                            ...docletTarget[tag],
                            ...doclet[tag]!
                        ]).values());
                    }
                }
            }
        }

        itemRowTarget.since = (
            (itemRowTarget.since || 0) < (itemRow.since || 0) ?
                itemRowTarget.since :
                itemRow.since
        );
    }


    /**
     * Merges declarations from the folder into the merger session.
     *
     * @return
     * Promise to keep.
     */
    public async mergeDeclarations(): Promise<void> {
        const declarations = this.declarations;
        const productURLName = this.database.activeProduct.url_name;

        // Debug
        DTS.toProjectJSON(declarations, 'tree-dts.json');

        const referencePrefix = (
            productURLName ?
                `class-reference.${productURLName}` :
                'class-reference'
        );

        for (const sourceInfo of declarations.sourceInfos) {
            if (!sourceInfo.code.length) {
                continue;
            }
            for (const code of sourceInfo.code) {
                if (
                    code.kind === 'Interface' &&
                    code.name.endsWith('Options')
                ) {
                    if (code.name === 'Options') {
                        await this.mergeOptions('', code);
                    }
                } else {
                    let name = code.meta.scope || code.name;
                    await this.mergeInfo(
                        name ? `${referencePrefix}.${name}` : referencePrefix,
                        code
                    );
                }
            }
        }

        // Debug
        FS.writeFileSync('tree-dts-merged.json', this.toJSON(), 'utf8');
    }


    /**
     * Merge options into the API rows.
     *
     * @param parentOption
     * Full name of the parent option.
     *
     * @param info
     * DTS information to merge.
     */
    public async mergeOptions(
        parentOption: string,
        info: (
            | DTS.EnumerationInfo
            | DTS.FunctionInfo
            | DTS.InterfaceInfo
            | DTS.PropertyInfo
            | DTS.TypeAliasInfo
            | DTS.VariableInfo
        )
    ): Promise<void> {
        const optionStack = this.optionStack;

        if (optionStack.includes(info)) {
            // Prevent recursive references
            return;
        }

        optionStack.push(info);

        const optionName = (
            parentOption ?
                `${parentOption}.${Utilities.getOptionName(info)}` :
                Utilities.getOptionName(info)
        );

        if (optionName !== 'options') {
            const infoMeta = info.meta as InfoMetaAddon;
            const allNames = infoMeta.optionNames = infoMeta.optionNames || [];

            if (!allNames.includes(optionName)) {
                allNames.push(optionName);
            }
        }

        await this.mergeInfo(optionName, info);

        switch (info.kind) {
            case 'Interface':
                for (const _memberInfo of info.members) {
                    await this.mergeOptions(
                        parentOption && optionName,
                        _memberInfo
                    );
                }
                break;
            case 'Property':
                if (typeof info.type === 'object') {
                    const lookupInfo = this.declarations.infoLookup
                        .get(info.type.symbol);
                    if (!lookupInfo) {
                        break;
                    }
                    if (lookupInfo.kind === 'Interface') {
                        for (const _memberInfo of lookupInfo.members) {
                            await this.mergeOptions(optionName, _memberInfo);
                        }
                    } else if (
                        lookupInfo.kind !== 'Class' &&
                        lookupInfo.kind !== 'Namespace'
                    ) {
                        await this.mergeOptions(optionName, lookupInfo);
                    }
                }
                break;
            default:
                break;
        }

        optionStack.pop();

    }


    public async saveToDatabase(): Promise<void> {
        const database = this.database;
        const mergedItems = this.mergedItems;
        const sortedPaths = Object.keys(mergedItems).sort();

        await database.startTransaction();

        for (const path of sortedPaths) {
            await database.setItem(mergedItems[path]);
        }

        await database.commitTransaction();

    }


    public toJSON(): string {
        const mergedItems = this.mergedItems;
        const sortedItems: Record<string, APIDB.ItemRow> = {};
        const sortedKeys = Object.keys(mergedItems).sort();

        for (const key of sortedKeys) {
            sortedItems[key] = mergedItems[key];
        }

        return JSON.stringify(sortedItems, null, 2);
    }


}
