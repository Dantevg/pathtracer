class Camera extends Line {
	constructor( x, y, angle, res ){
		const dir = new Vector( -Math.sin(angle), Math.cos(angle) )
		super( x-dir.x*10, y-dir.y*10, x+dir.x*10, y+dir.y*10, "#FFFFFF", new Null() )
		this.pos = new Vector( x, y )
		this.dir = dir
		this.angle = angle
		this.res = res
		this.canvas = []
		this.init()
	}
	
	init(){
		this.distSq = Vector.distSq( this.a, this.b )
		this.dir.set( -Math.sin(this.angle), Math.cos(this.angle) )
		this.a.set( this.pos.x - this.dir.x*10, this.pos.y - this.dir.y*10 )
		this.b.set( this.pos.x + this.dir.x*10, this.pos.y + this.dir.y*10 )
		// this.canvas = []
	}
	
	draw( canvas, scene ){
		if( mouse.x != this.b.x || mouse.y != this.b.y ){
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
			this.canvas[i] = ray.cast( scene )
			if( flags.drawRays ) ray.drawLine( canvas )
			if( flags.drawRayHits ) ray.drawPoint( canvas )
		}
	}
	
	drawCanvas( canvas, height ){
		for( let i = 0; i < this.res; i++ ){
			if( this.canvas[i] ){
				// this.canvas[i].a = 0.1
				canvas.fillStyle = this.canvas[i].toString()
				canvas.fillRect( i, height-50, 1, 50 )
			}
		}
	}
	
}