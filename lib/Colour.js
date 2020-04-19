class Colour {
	constructor( r, g, b, a ){
		if( typeof a == "string" ){
			const c = rgb.replace( /[^\d,]/g, "" ).split(",")
			this.r = c.r
			this.g = c.g
			this.b = c.b
			this.a = c.a
		}else if( typeof a == "object" ){
			this.r = a.r
			this.g = a.g
			this.b = a.b
			this.a = a.a
		}else{
			this.r = r
			this.g = g
			this.b = b
			this.a = a
		}
	}
	
	multiply( colour ){
		this.r *= colour.r
		this.g *= colour.g
		this.b *= colour.b
		this.a *= colour.a
	}
	
	static multiply( a, b ){
		return new Colour( a.r*b.r, a.g*b.g, a.b*b.b, a.a*b.a )
	}
	
}