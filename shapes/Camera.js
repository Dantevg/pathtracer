class Camera extends Line {
	constructor( x, y, angle, res, sensitivity = 1 ){
		const dir = new Vector( -Math.sin(angle), Math.cos(angle) )
		super( x-dir.x*10, y-dir.y*10, x+dir.x*10, y+dir.y*10, Colour.WHITE, new Null() )
		this.pos = new Vector( x, y )
		this.dir = dir
		this.angle = angle
		this.res = res
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
		for( let i = 0; i < this.res; i++ ){
			this.canvas[i] = Colour.BLACK
		}
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
		
		for( let i = 0; i < this.res; i++ ){
			const offset = i / this.res
			const pos = new Vector( this.a.x + vec.x*offset, this.a.y + vec.y*offset )
			
			const angle = mod( dir.toAngles() + (i/this.res-0.5)*flags.fov/180*Math.PI, Math.PI*2 )
			const ray = new Ray( pos, angle, flags.nBounces, this.colour )
			
			// const progress = Math.floor( Vector.distSq(this.a, pos) / this.distSq * this.res )
			this.canvas[i].add( ray.cast( scene ), true )
			if( flags.drawRays ) ray.drawLine( canvas )
			if( flags.drawRayHits ) ray.drawPoint( canvas )
		}
		this.iterations++
	}
	
	drawCanvas( canvas, height ){
		for( let i = 0; i < this.res; i++ ){
			const colour = Colour.multiply( this.canvas[i], new Colour(1/this.iterations) )
			canvas.fillStyle = colour.multiply( new Colour(this.sensitivity) ).setAlpha(1).toString()
			canvas.fillRect( i, height-50, 1, 50 )
		}
	}
	
}