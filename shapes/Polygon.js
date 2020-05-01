class Polygon {
	constructor( x, y, r, nSides, angle, colour, material ){
		this.x = x
		this.y = y
		this.r = r
		this.nSides = nSides
		this.angle = angle
		this.colour = colour
		this.material = material
		
		this.sides = []
		for( let i = 0; i < this.nSides; i++ ){
			const x1 = this.x + this.r * Math.cos( i*Math.PI*2/this.nSides + this.angle )
			const y1 = this.y + this.r * Math.sin( i*Math.PI*2/this.nSides + this.angle )
			const x2 = this.x + this.r * Math.cos( (i+1)*Math.PI*2/this.nSides + this.angle )
			const y2 = this.y + this.r * Math.sin( (i+1)*Math.PI*2/this.nSides + this.angle )
			this.sides.push( new Line( x1, y1, x2, y2, this.colour, this.material ) )
		}
	}
	
	getIntersection( ray ){
		let min = {
			distSq: Infinity
		}
		
		for( const side of this.sides ){
			const hit = side.getIntersection( ray )
			if( hit && hit.distSq < min.distSq ){
				min = hit
			}
		}
		
		min.object = this
		if( min.point ) return min
	}
	
	draw( canvas, scene ){
		for( const side of this.sides ){
			side.draw( canvas )
		}
		// this.material.draw( canvas, this, scene ) // only for ray tracing (not for path tracing)
	}
	
}