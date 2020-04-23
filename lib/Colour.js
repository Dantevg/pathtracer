class Colour {
	constructor( r, g, b, a ){
		if( typeof r == "string" && r.substring(0,1) == "#" ){
			[this.r, this.g, this.b, this.a = 1] = Colour.hexStringToRgb(r)
		}else if( typeof r == "string" ){
			const c = r.replace( /[^\d,]/g, "" ).split(",").map( x => parseInt(x) )
			if( r.substring(0,3) == "rgb" ){
				[this.r, this.g, this.b, this.a = 1] = c
			}else if( r.substring(0,3) == "hsl" ){
				[this.r, this.g, this.b, this.a = 1] = Colour.hslToRgb( c[0], c[1], c[2], c[3] )
			}
		}else if( r instanceof Colour ){
			return new Colour( r.r, r.g, r.b, r.a )
		}else if( typeof r == "object" ){
			this.r = r.r ?? 0
			this.g = r.g ?? this.r
			this.b = r.b ?? this.g
			this.a = r.a ?? 1
		}else{
			this.r = r ?? 0
			this.g = g ?? this.r
			this.b = b ?? this.g
			this.a = a ?? 1
		}
	}
	
	get rgb(){
		return [this.r, this.g, this.b, this.a]
	}
	
	get hsl(){
		return Colour.rgbToHsl( this.r, this.g, this.b, this.a )
	}
	
	setAlpha(x){
		this.a = x
		return this
	}
	
	multiply( colour, keepAlpha ){
		if( colour instanceof Colour ){
			this.r *= colour.r
			this.g *= colour.g
			this.b *= colour.b
			if( !keepAlpha ) this.a *= colour.a
		}else{
			this.r *= colour
			this.g *= colour
			this.b *= colour
			if( !keepAlpha ) this.a *= colour
		}
		return this
	}
	
	add( colour, keepAlpha ){
		if( colour instanceof Colour ){
			this.r += colour.r
			this.g += colour.g
			this.b += colour.b
			if( !keepAlpha ) this.a += colour.a
		}else{
			this.r += colour
			this.g += colour
			this.b += colour
			if( !keepAlpha ) this.a += colour
		}
		return this
	}
	
	getBrightness(){
		return (this.r + this.g + this.b) / 3
	}
	
	toRgbString(){
		const r = Colour.valueToPercentage(this.r)
		const g = Colour.valueToPercentage(this.g)
		const b = Colour.valueToPercentage(this.b)
		const a = Colour.valueToPercentage(this.a)
		return "rgba("+r+","+g+","+b+","+a+")"
	}
	
	toHslString(){
		const [h, s, l, a] = this.hsl
		h = Colour.valueToDegrees(h)
		s = Colour.valueToPercentage(s)
		l = Colour.valueToPercentage(l)
		a = Colour.valueToPercentage(a)
		return "hsla("+h+","+s+","+l+","+a+")"
	}
	
	toString(){
		return this.toRgbString()
	}
	
	static multiply( a, b, alpha ){
		return new Colour( a.r*b.r, a.g*b.g, a.b*b.b, alpha ? alpha : a.a*b.a )
	}
	
	static add( a, b, alpha ){
		return new Colour( a.r+b.r, a.g+b.g, a.b+b.b, alpha ? alpha : a.a+b.a )
	}
	
	static random(){
		return new Colour( Math.random(), Math.random(), Math.random() )
	}
	
	static valueToPercentage( x ){
		return Math.floor(x*100) + "%"
	}
	
	static valueToDegrees( x ){
		return Math.floor(x*360) + "deg"
	}
	
	// https://stackoverflow.com/a/39077686/3688140
	static hexStringToRgb( hex ){
		return hex.replace( /^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b )
		.substring(1).match( /.{2}/g )
		.map( x => parseInt( x, 16 ) / 255 )
	}
	
	/*
		Colour conversion functions, slightly adapted:
			- Input and output is always in range [0,1]
			- Pass on alpha value
			- Adapt coding style
		From: https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	*/
	static rgbToHsl( r, g, b, a ){
		const max = Math.max( r, g, b )
		const min = Math.min( r, g, b )
		let h, s, l = (max + min) / 2

		if( max == min ){
			h = s = 0 // achromatic
		}else{
			let d = max - min
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
			switch( max ){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break
				case g: h = (b - r) / d + 2; break
				case b: h = (r - g) / d + 4; break
			}
			h /= 6
		}

		return [h, s, l, a]
	}
	
	static hslToRgb( h, s, l, a ){
		let r, g, b

		if( s == 0 ){
			r = g = b = l // achromatic
		}else{
			function hue2rgb(p, q, t){
				if( t < 0 ) t += 1
				if( t > 1 ) t -= 1
				if( t < 1/6 ) return p + (q - p) * 6 * t
				if( t < 1/2 ) return q
				if( t < 2/3 ) return p + (q - p) * (2/3 - t) * 6
				return p
			}

			let q = l < 0.5 ? l * (1 + s) : l + s - l * s
			let p = 2 * l - q
			r = hue2rgb( p, q, h + 1/3 )
			g = hue2rgb( p, q, h )
			b = hue2rgb( p, q, h - 1/3 )
		}

		return [r, g, b, a]
	}
	
	// Default colours
	static get WHITE(){ return new Colour(1) }
	static get BLACK(){ return new Colour(0) }
	static get TRANSPARENT(){ return new Colour(0,0,0,0) }
	
}