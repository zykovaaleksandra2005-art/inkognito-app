export namespace main {
	
	export class Chapter {
	    title: string;
	    text: string;
	
	    static createFrom(source: any = {}) {
	        return new Chapter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.text = source["text"];
	    }
	}
	export class BookQuote {
	    id: number;
	    text: string;
	    color: string;
	    title: string;
	    author: string;
	    chapters: Chapter[];
	    is_liked: boolean;
	
	    static createFrom(source: any = {}) {
	        return new BookQuote(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.text = source["text"];
	        this.color = source["color"];
	        this.title = source["title"];
	        this.author = source["author"];
	        this.chapters = this.convertValues(source["chapters"], Chapter);
	        this.is_liked = source["is_liked"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

