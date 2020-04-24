class Line {
	constructor( x1, y1, x2, y2, colour, material ){
		this.a = new Vector( x1, y1 )
		this.b = new Vector( x2, y2 )
		this.colour = colour
		this.material = material
	}
	
	getIntersection( ray ){
		const x1 = this.a.x
		const y1 = this.a.y
		const x2 = this.b.x
		const y2 = this.b.y
		
		const x3 = ray.pos.x + ray.dir.x*0.001 // (+ ray.dir.x*0.001) To prevent self-intersecting
		const y3 = ray.pos.y + ray.dir.y*0.001
		const x4 = ray.pos.x + ray.dir.x
		const y4 = ray.pos.y + ray.dir.y
		
		const den = (x1-x2) * (y3-y4) - (y1-y2) * (x3-x4)
		if( den != 0 ){
			const t = ( (x1-x3) * (y3-y4) - (y1-y3) * (x3-x4) ) / den
			const u = -( (x1-x2) * (y1-y3) - (y1-y2) * (x1-x3) ) / den
			
			// Line intersects
			if( t >= 0 && t <= 1 && u >= 0 ){
				const point = new Vector( x1 + t*(x2-x1), y1 + t*(y2-y1) )
				return {
					object: this,
					point: point,
					distSq: Vector.distSq( ray.pos, point ),
					normal: this.getNormal()
				}
			}
		}
	}
	
	getVector(){
		return Vector.subtract( this.b, this.a )
	}
	
	getNormal(){
		return this.getVector().rotate90().normalize()
	}
	
	getNormalFromPoint( pos ){
		return this.getNormal()
	}
	
	draw( canvas ){
		if( flags.drawObjectBorders ){
			canvas.strokeStyle = this.colour.toString()
			canvas.beginPath()
			canvas.moveTo( this.a.x+0.5, this.a.y+0.5 )
			canvas.lineTo( this.b.x+0.5, this.b.y+0.5 )
			canvas.stroke()
			canvas.closePath()
		}
		
		// Draw normals
		if( flags.drawNormals ){
			const normal = this.getNormal().multiply(20)
			const center = new Vector( this.a.x + (this.b.x-this.a.x)/2, this.a.y + (this.b.y-this.a.y)/2 )
			canvas.strokeStyle = "#00FF00"
			canvas.beginPath()
			canvas.moveTo( center.x, center.y )
			canvas.lineTo( center.x+normal.x, center.y+normal.y )
			canvas.stroke()
			canvas.closePath()
		}
	}
	
}