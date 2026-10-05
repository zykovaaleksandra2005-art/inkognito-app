export namespace main {
	
	export class BookQuote {
	    id: number;
	    text: string;
	    color: string;
	    full_text: string;
	    is_liked: boolean;
	
	    static createFrom(source: any = {}) {
	        return new BookQuote(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.text = source["text"];
	        this.color = source["color"];
	        this.full_text = source["full_text"];
	        this.is_liked = source["is_liked"];
	    }
	}

}

