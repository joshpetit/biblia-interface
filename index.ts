import fetch from "node-fetch";

export default class Biblia {
    private baseReference = `https://api.biblia.com/v1/bible`
    private readonly apiKey: string;
    private bible: string;

    /**
     * constructor
     * @param apiKey Visit https://bibliaapi.com/ to active an API key
     * @param [bible = "asv"]
     */
    constructor(apiKey: string, bible: string = "asv") {
        this.apiKey = apiKey;
        this.bible = bible;
    }

    /**
     *
     * @param {Object} [options] Optional query parameters
     * @param {Number} [options.limit] - The maximum number of entries to return (all if unspecified).
     * @return Returns an object of the different bibles and their descriptions
     */
    public getBibles(options?: {bible?: string, query?: string, strictQuery?:boolean, start?: number, limit?: number}): Promise<bibles> {
        let params = this.setParams(options);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/find.js?${params}key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    /**
     * @return Returns an array of all the available bibles
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
     *
     * @param {Option} [options] - Optional params
     * @param {String} [options.style] -  Style of the rendered form (short, medium, long; default long).
     * @param passage - The text to parse (required).
     * @returns Parses the specified text as one or more Bible passages. Can also be used to render a Bible reference in short, medium, or long form.
     */
    public parseText(passage: string, options?: {style?: "short"|"medium"|"long"}) : Promise<parsedText> {
        let params = this.setParams(options);
        passage = encodeURI(passage);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/parse?passage=${passage}&${params}key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err))
        })
    }

    public scanText(text: string, options: {}): Promise<object> {
        let params = this.setParams(options);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/scan.js?${params}text=${text}&key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    public getPassage(passage: string): Promise<passage> {
        passage = encodeURI(passage);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/content/${this.bible}.js?passage=${passage}&key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    /**
     *
     *
     * @param {String} query - The query text
     * @param {Number} [options.limit] - The maximum number of entries to return (all if unspecified).
     * @param {Object} [options] - Optional Parameters
     * @param {String} [options.passages] - The passages to search in (e.g. "Matthew-John"). Only valid with mode=verse.
     * @param {Number} [options.start] - The zero-based index of the first result to return (default 0).
     * @param {Number} [options.limit] - The maximum number of results to return (all if unspecified).
     * @param {String} [options.preview] - none, text, or html; default text.
     * @param {String} [options.sort] - 	The sort order (relevance or passage). Only valid with mode=verse. mode=fuzzy always sorts by passage.
     * @return {Object} An object with previews of the query matches
     */
    public search(query: string, options?: {mode?: "fuzzy"|"verse", limit?:number, preview?:"none"|"text"|"html", sort?: "relevance"| "passage" , passages?: string}) : Promise<query> {
        let params = this.setParams(options);
        query = encodeURI(query);
        return new Promise((resolve, reject) => {
            fetch(`${this.baseReference}/search/${this.bible}.js?query=${query}&${params}key=${this.apiKey}`)
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
        })
    }

    private setParams(options: object): string {
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

}

interface passage {
    text: string
}

interface bibles{
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

interface query{
    resultCount: number,
    hitCount: number,
    start: number,
    limit: number,
    results: {
        title: string,
        preview: string
    }[]

}

interface parsedText {
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