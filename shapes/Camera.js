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
		this.canvas = []
		for( let x = 0; x < this.w; x++ ){
			this.canvas[x] = []
			for( let y = 0; y < this.h; y++ ){
				this.canvas[x][y] = Colour.BLACK
			}
		}
		
		// for( let i = 0; i < this.w; i++ ){
		// 	this.canvas[i] = Colour.BLACK
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
			this.canvas[x][y].add( ray.cast( scene ), true )
			if( flags.drawRays ) ray.drawLine( canvas )
			if( flags.drawRayHits ) ray.drawPoint( canvas )
		}
		this.iterations++
	}
	
	drawCanvas( canvas, height ){
		for( let x = 0; x < this.w; x++ ){
			for( let y = 0; y < this.h; y++ ){
				const colour = Colour.multiply( this.canvas[x][y], new Colour(1/this.iterations*this.h) )
				canvas.fillStyle = colour.multiply( new Colour(this.sensitivity) ).setAlpha(1).toString()
				canvas.fillRect( x, height-y, 1, 1 )
			}
		}
	}
	
}