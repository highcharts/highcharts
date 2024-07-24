/* *
 *
 *  API Database API Mockup
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


import FS from 'node:fs/promises';
import FSLib from '../libs/fs';


/* *
 *
 *  Declarations
 *
 * */


interface Data {
    deprecated: Array<(null|number)>;
    description: Array<string>;
    doclet: Array<string>;
    meta: Array<string>;
    name: Array<string>;
    since: Array<number>;
}


/* *
 *
 *  Constant
 *
 * */


const DATABASE_NAME = 'tree-database';


const KEY_ANTI_PATTERN = /[^\w\- ]+/gsu;


const SPACE_PATTERN = /\s+/gsu;


const VALUE_ANTI_PATTERN = /[^\w\-\n\r\\\/\[\] .:,;?!=+*(){}<>'"`^#$%&@]+/gsu;


/* *
 *
 *  Functions
 *
 * */


function getNodeAt(
    data: Data,
    index: number,
    alternativeName?: string
): Database.Item {
    return {
        name: (alternativeName ?? data.name[index]),
        description: data.description[index],
        since: data.since[index],
        deprecated: data.deprecated[index],
        doclet: JSON.parse(data.doclet[index]),
        meta: JSON.parse(data.meta[index])
    };
}


function partOfVersion(
    node: Database.Item,
    version: number
): boolean {
    const majorVersion = Math.floor(version);

    return (
        // Skip newer options.
        node.since <= version &&
        // Include only deprecations from last major version:
        (
            !node.deprecated ||
            node.deprecated >= majorVersion - 1
        )
    );
}


function sanitizeKey(
    key: string
): string {

    while (KEY_ANTI_PATTERN.test(key)) {
        key = key.replace(KEY_ANTI_PATTERN, ' ');
    }

    return key.replace(SPACE_PATTERN, ' ');
}


function sanitizeValue(
    value: string
): string {

    while (VALUE_ANTI_PATTERN.test(value)) {
        value = value.replace(VALUE_ANTI_PATTERN, '');
    }

    return value;
}


/* *
 *
 *  Class
 *
 * */


export class Database {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor(
        product: string,
        storageFolder: string = process.cwd()
    ) {
        this.cache = {};
        this.namePrefix = `${product}/`;
        this.product = product;
        this.storageFolder = storageFolder;
    }


    /* *
     *
     *  Properties
     *
     * */


    private readonly cache: Record<string, Data>;


    private readonly namePrefix: string;


    public readonly product: string;


    private readonly storageFolder: string;


    /* *
     *
     *  Functions
     *
     * */


    private async getData(
        name: string = DATABASE_NAME
    ): Promise<Data> {
        let data = this.cache[name];

        if (data) {
            return data;
        }

        const filePath = this.getFilePath(name);

        if (!FSLib.isFile(filePath)) {
            await this.saveData({
                deprecated: [],
                description: [],
                doclet: [],
                meta: [],
                name: [],
                since: []
            });
        }

        data = JSON.parse(await FS.readFile(filePath, 'utf8'));

        this.cache[name] = data;

        return data;
    }


    private getFilePath(
        name: string
    ) {
        return FSLib.path([this.storageFolder, sanitizeKey(name) + '.json']);
    }


    public async getItem(
        itemName: string,
        version?: number
    ): Promise<(Database.Item|undefined)> {
        const data = await this.getData();
        const nodePath = this.namePrefix + itemName;

        let index = data.name.indexOf(nodePath);

        if (index === -1) {
            return void 0;
        }

        const node = getNodeAt(data, index, itemName);

        if (version && !partOfVersion(node, version)) {
            return void 0;
        }

        return node;
    }


    public async getItemChildren(
        itemName: string,
        version?: number,
        all?: boolean
    ): Promise<Array<Database.Item>> {
        const children: Array<Database.Item> = [];
        const data = await this.getData();
        const nodePath = this.namePrefix + itemName;
        const indexOffset = nodePath.length;
        const prefixLength = this.namePrefix.length;

        let index = -1;
        let node: Database.Item;

        for (const name of data.name) {

            ++index;

            if (
                !name.startsWith(nodePath) ||
                name === nodePath ||
                // Skip children's children
                (!all && name.indexOf('.', indexOffset) !== -1)
            ) {
                continue;
            }

            node = getNodeAt(data, index, name.substring(prefixLength));

            if (version && !partOfVersion(node, version)) {
                continue;
            }

            children.push(node);

        }

        children.sort((a, b) => (
            a.name === b.name ?
                0 :
                a.name < b.name ?
                    -1 :
                    1
        ));

        return children;
    }


    private async saveData(
        data: Data
    ): Promise<Data> {
        const name = DATABASE_NAME;

        await FS.writeFile(
            this.getFilePath(name),
            JSON.stringify(data, void 0, '\t'),
            'utf8'
        );

        return data;
    }


    public async setItem(
        item: Database.Item
    ): Promise<Database.Item> {
        const data = await this.getData();
        const nodePath = this.namePrefix + item.name;

        let index = data.name.indexOf(nodePath);

        if (index === -1) {
            index = data.name.length;
        }

        data.doclet[index] = JSON.stringify(item.doclet);
        data.deprecated[index] = item.deprecated;
        data.description[index] = item.description;
        data.meta[index] = JSON.stringify(item.meta);
        data.name[index] = nodePath;
        data.since[index] = item.since;

        await this.saveData(data);

        return item;
    }


}


/* *
 *
 *  Class Namespace
 *
 * */


export namespace Database {


    /* *
     *
     *  Declarations
     *
     * */


    export interface Doclet {
        default?: Array<(boolean|number|string)>;
        example?: Array<string>;
        exclude?: Array<string>;
        extends?: Array<string>;
        product?: Array<string>;
        sample?: Array<string>;
        see?: Array<string>;
        type?: Array<string>;
    }


    export interface Meta {
        file: string;
    }


    export interface Item {
        name: string;
        description: string;
        since: number;
        deprecated?: number;
        doclet: Doclet;
        meta: Meta;
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Database;
