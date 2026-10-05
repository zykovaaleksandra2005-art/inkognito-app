export namespace main {
	
	export class QuoteResponse {
	    id: number;
	    quote: string;
	
	    static createFrom(source: any = {}) {
	        return new QuoteResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.quote = source["quote"];
	    }
	}

}

