class Camera extends Line {
	constructor( x, y, angle, w, h, sensitivity = 1 ){
		const dir = new Vector( -Math.sin(angle), Math.cos(angle) )
		super( x-dir.x*10, y-dir.y*10, x+dir.x*10, y+dir.y*10, Colour.WHITE, new Null() )
		this.pos = new Vector( x, y )
		this.dir = dir
		this.angle = angle
		this.w = w
		this.h = h
		this.sensitivity = sensitivity
		this.init()
	}
	
	init(){
		this.distSq = Vector.distSq( this.a, this.b )
		this.dir.set( -Math.sin(this.angle), Math.cos(this.angle) )
		this.a.set( this.pos.x - this.dir.x*10, this.pos.y - this.dir.y*10 )
		this.b.set( this.pos.x + this.dir.x*10, this.pos.y + this.dir.y*10 )
		this.iterations = 0
		this.buffer = []
		for( let x = 0; x < this.w; x++ ){
			this.buffer[x] = []
			for( let y = 0; y < this.h; y++ ){
				this.buffer[x][y] = Colour.BLACK
			}
		}
		
		// for( let i = 0; i < this.w; i++ ){
		// 	this.buffer[i] = Colour.BLACK
		// }
	}
	
	getIntersection(){
		return false
	}
	
	draw( canvas, scene ){
		if( mouse.x != this.pos.x || mouse.y != this.pos.y ){
			this.pos.set( mouse.x, mouse.y )
			this.init()
		}
		
		// Draw camera surface
		super.draw( canvas )
		
		// Emit rays
		const vec = this.getVector()
		const dir = this.getNormal()
		
		for( let x = 0; x < this.w; x++ ){
			const offset = x / this.w
			const pos = new Vector( this.a.x + vec.x*offset, this.a.y + vec.y*offset )
			
			const angle = mod( dir.toAngles() + (x/this.w-0.5)*flags.fov/180*Math.PI, Math.PI*2 )
			const ray = new Ray( pos, angle, flags.nBounces, this.colour )
			
			// const progress = Math.floor( Vector.distSq(this.a, pos) / this.distSq * this.w )
			let y = Math.floor( Math.random()*this.h )
			this.buffer[x][y].add( ray.cast( scene ), true )
			if( flags.drawRays ) ray.drawLine( canvas )
			if( flags.drawRayHits ) ray.drawPoint( canvas )
		}
		this.iterations++
	}
	
	drawCanvas( canvas ){
		const image = canvas.getImageData( 0, 0, canvas.canvas.width, canvas.canvas.height )
		for( let x = 0; x < Math.min(this.w, image.width); x++ ){
			for( let y = 0; y < Math.min(this.h, image.height); y++ ){
				const colour = Colour.multiply( this.buffer[x][y], new Colour(1/this.iterations*this.h) )
				let rgb = colour.multiply( new Colour(this.sensitivity) ).setAlpha(1).rgb255
				Camera.setImagePixel( image, x, y, rgb )
			}
		}
		canvas.putImageData( image, 0, 0 )
	}
	
	static getImagePixel( image, x, y, offset ){
		if( offset ){
			return image.data[ (x + y*image.width)*4 + offset ]
		}else{
			return [
				getImagePixel( image, x, y, 0 ),
				getImagePixel( image, x, y, 1 ),
				getImagePixel( image, x, y, 2 ),
				getImagePixel( image, x, y, 3 ),
			]
		}
	}
	
	static setImagePixel( image, x, y, colour ){
		image.data[ (x + y*image.width)*4 + 0 ] = colour[0]
		image.data[ (x + y*image.width)*4 + 1 ] = colour[1]
		image.data[ (x + y*image.width)*4 + 2 ] = colour[2]
		image.data[ (x + y*image.width)*4 + 3 ] = colour[3]
	}
	
}