import fetch from "node-fetch";

export class Biblia {
    private readonly baseReference = `https://api.biblia.com/v1/bible`
    private readonly apiKey: string;
    private bible: string;

    /**
     * constructor
     * @param apiKey Visit https://bibliaapi.com/docs/API_Keys to active an API key
     * @param [bible = "asv"]
     */
    constructor(apiKey: string, bible: BibleVersions = "asv") {
        this.apiKey = apiKey;
        this.bible = bible;
    }

    /**
     * @param {Object} [options] Optional query parameters
     * @param {Number} [options.limit] - The maximum number of entries to return (all if unspecified).
     * @return A promise with an object of the different bibles and their descriptions
     */
    public getBibles(options?: getBiblesParams): Promise<Bibles> {
        let params = "";
        if (options) {
            params = this.setParams(options);
        }
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/find.js?${params}key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    /**
     * @returns A promise with an array of all the available bibles
     */
    public getBibleNames(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.getBibles()
                .then(res =>{
                    resolve( res.bibles.map(bible => bible.bible));
                })
                .catch(err => reject(err));
        })
    }

    /**
     * @param {Option} [options] - Optional params
     * @param {String} [options.style] -  Style of the rendered form (short, medium, long; default long).
     * @param passage - The text to parse (required).
     * @returns A promise. Parses the specified text as one or more Bible passages. Can also be used to render a Bible reference
     * in short, medium, or long form.
     */
    public parseText(passage: string, options?: {style?: "short"|"medium"|"long"}) : Promise<ParsedText> {
        let params = "";
        if (options) {
            params = this.setParams(options);
        }
        passage = encodeURI(passage);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/parse?passage=${passage}&${params}key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err))
        })
    }

    /**
     * @param {String} text - The text to parse
     * @param {Object} [options]
     * @param {Boolean} [options.tagChapters] Whether to tag references to chapters without a verse; default true
     * @returns A promise with the comparison of the compared texts
     */
    public scanText(text: string, options: {tagChapters?: boolean}): Promise<ScannedText> {
        let params = this.setParams(options);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/scan.js?${params}text=${text}&key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    /**
     * @param {String} firstVerse
     * @param {String} secondVerse
     * @returns A promise with the comparison two Bible references
     */
    public compare(firstVerse: string, secondVerse: string) : Promise<Comparison> {
        firstVerse = encodeURI(firstVerse);
        secondVerse = encodeURI(secondVerse);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/compare?first=${firstVerse}&second=${secondVerse}&key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })

    }

    /**
     * @param {String} query - The query text
     * @param {Number} [options.limit] - The maximum number of entries to return (all if unspecified).
     * @param {Object} [options] - Optional Parameters
     * @param {String} [options.passages] - The passages to search in (e.g. "Matthew-John"). Only valid with mode=verse.
     * @param {Number} [options.start] - The zero-based index of the first result to return (default 0).
     * @param {Number} [options.limit] - The maximum number of results to return (all if unspecified).
     * @param {String} [options.preview] - none, text, or html; default text.
     * @param {String} [options.sort] - 	The sort order (relevance or passage). Only valid with mode=verse. mode=fuzzy always sorts by passage.
     * @return {Object} A promise of an object with previews of the query matches
     */
    public search(query: string, options?: searchParams) : Promise<Query> {
        let params = "";
        if (options) {
            params = this.setParams(options);
        }
        query = encodeURI(query);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/search/${this.bible}.js?query=${query}&${params}key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    /**
     * @param passage - The Bible passage to return
     * @param {Object} [options]
     * @param {String} [options.html] - HTML wrapped in JSON or simply text wrappedi n JSON
     * @param {String} [options.style] - The name of a pre-defined style (options below).
     * **Note: Takes precedence over the more specific options e.g. redLetter, header**
     * @param {String} [options.formatting] - All, paragraph, character, or none. Default all
     * @param {Boolean} [options.redLetter] -	False to remove red letter formatting for words of Christ. Default true.
     * @param {Boolean} [options.footnotes] - True to include footnote content below the main content; default false.
     * @param {Boolean} [options.citation] - True to include a citation below the content; default false.
     * @param {Boolean} [options.paragraphs] - True to preserve paragraphs, false for one verse per line; default true.
     * @param {Boolean} [options.fullText] - true to include everything, not only the biblical text; default false.
     * @param {String} [options.header] - format of the header; default empty
     * @param {String} [options.eachVerse] - Format of footer; default [VerseText]
     * @param {String} [options.footer] - Format of the footer; default empty
     * @returns A promise with contents of a Bible.
     */
    public getPassage(passage: string, options?: getPassageParams): Promise<Passage> {
        let params = "";
        let format = "";
        if (options) {
            params = this.setParams(options);
            if (options.html) {
                format = "html.";
            }
        }
        passage = encodeURI(passage);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/content/${this.bible}.${format}js?${params}passage=${passage}&key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    private setParams(options: {[index: string] :any}): string {
        let params = "";
        if (options) {
            Object.keys(options).forEach(key => {
                if (key) {
                    params = `${params}&${key}=${options[key]}&`
                }
            })
        }
        return params;
    }

    public setBible(bible: BibleVersions): void {
        this.bible = bible;
    }

}

interface ScannedText {
    results: {
        passage: string,
        textIndex: number,
        textLength: number
    }[]
}

interface getBiblesParams {
    bible?: string,
    query?: string,
    strictQuery?:boolean,
    start?: number,
    limit?: number
}

interface searchParams {
    mode?: "fuzzy"|"verse",
    limit?:number, preview?:"none"|"text"|"html",
    sort?: "relevance"| "passage" ,
    passages?: string
}

interface Passage {
    text: string
}

interface Bibles{
    bibles: {
        bible: string,
        title: string,
        abbreviatedTitle: string,
        publicationDate: string,
        languages: [string],
        publishers: [string],
        imageUrl: string,
        description: string,
        searchFields: [string],
        copyright: string,
        extendedCopyright: string
    }[]
}

interface Query{
    resultCount: number,
    hitCount: number,
    start: number,
    limit: number,
    results: {
        title: string,
        preview: string
    }[]

}

interface ParsedText {
    passage: string,
    passages: {
        passage: string,
        parts: {
            book: string,
            chapter: number,
            verse: number,
            endVerse: number
        }
    }[]
}

interface Comparison {
    "equal" : boolean,
    "intersects" : boolean,
    "compare" : -1 | 0 | 1,
    "startToStart" : -1 | 0 | 1,
    "startToEnd" : -1 | 0 | 1,
    "endToStart" : -1 | 0 | 1,
    "endToEnd" : -1 | 0 | 1,
    "after" : boolean,
    "before" : boolean,
    "subset" : boolean,
    "strictSubset" : boolean,
    "superset" : boolean,
    "strictSuperset" : boolean,
}

interface getPassageParams {
    style?: PassageStyles,
    formatting?: "all" | "paragraph" | "character" | "none",
    redLetter?: boolean,
    footnotes?: boolean,
    citation?: boolean,
    paragraphs?: boolean,
    fullText?: boolean,
    header?: string,
    html?: boolean
}

type PassageStyles = "fullyFormatted" | "oneVersePerLine" | "oneVersePerLineFullReference"
    | "quotation" | "simpleParagraphs" | "bibleTextOnly" | "orationOneParagraph"
    | "orationOneVersePerLine" | "orationBibleParagraphs" | "fullyFormattedWithFootnotes"

type BibleVersions = "darby" | "asv" | "ar-vandyke" | "byz" | "elzevir" | "emphbbl"
    | "it-diodati1649" | "kjv" | "kjv1900" | "lsg" | "eo-zamenbib" | "leb" | "scrmorph"
    | "fi-raamattu" | "rvr60" | "rva" | "bb-sbb-rusbt" | "scr" | "tr1894mr" | "svv"
    | "stephens" | "tanakh" | "wbtc-ptbrnt" | "wh1881mr" | "ylt";