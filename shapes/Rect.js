class Rect {
	
	constructor( x, y, w, h, colour, material ){
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.colour = colour
		this.material = material
		
		this.walls = [
			new Line( this.x,        this.y,        this.x+this.w, this.y,        this.colour ), // Top wall
			new Line( this.x,        this.y+this.h, this.x,        this.y,        this.colour ), // Left wall
			new Line( this.x+this.w, this.y,        this.x+this.w, this.y+this.h, this.colour ), // Right wall
			new Line( this.x+this.w, this.y+this.h, this.x,        this.y+this.h, this.colour ), // Bottom wall
		]
	}
	
	getIntersection( ray ){
		let min = {
			distSq: Infinity
		}
		
		for( const wall of this.walls ){
			const hit = wall.getIntersection( ray )
			if( hit && hit.distSq < min.distSq ){
				min = hit
			}
		}
		
		min.object = this
		if( min.point ) return min
	}
	
	getNormals(){
		return walls[0].getNormal(),
					 walls[1].getNormal(),
					 walls[2].getNormal(),
					 walls[3].getNormal()
	}
	
	getNormalFromPoint( pos ){
		return pos.object.getNormal()
	}
	
	draw( canvas, scene ){
		if( flags.drawObjectFills || this.material instanceof Emissive ){
			canvas.fillStyle = this.colour.toString()
			canvas.fillRect( this.x, this.y, this.w, this.h )
		}
		this.walls[0].draw( canvas )
		this.walls[1].draw( canvas )
		this.walls[2].draw( canvas )
		this.walls[3].draw( canvas )
		// this.material.draw( canvas, this, scene ) // only for ray tracing (not for path tracing)
	}
	
}