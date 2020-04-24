class Circle {
	
	constructor( x, y, r, colour, material ){
		this.x = x
		this.y = y
		this.r = r
		this.colour = colour
		this.material = material
	}
	
	getIntersection( ray ){
		// Q < 0: no intersection
		// Q == 0: 1 intersection (touching the side)
		// Q > 0: 2 intersections
		
		const pos = new Vector(this.x, this.y)
		
		const rayToCircle = Vector.subtract( ray.pos, pos ) // swap operands for cool effect
		const A = ray.dir.dot(ray.dir) // |ray.dir|^2 == ray.length()**2
		let B = 2 * ray.dir.dot(rayToCircle)
		const C = rayToCircle.dot(rayToCircle) - this.r**2
		const Q = B**2 - 4*A*C
		if( Q > 0 ){
			const G = 1 / (2*A)
			const Q2 = G*Math.sqrt(Q)
			
			if( -B * G + Q2 <= 0 ) return // Ensure ray doesn't go backwards
			let point
			if( Vector.distSq( pos, ray.pos ) >= this.r**2 ){ // Outside
				point = Vector.multiply( ray.dir, -B * G - Q2 ).add( ray.pos )
			}else{ // Inside
				point = Vector.multiply( ray.dir, -B * G + Q2 ).add( ray.pos )
			}
			return {
				object: this,
				point: point,
				distSq: Vector.distSq( ray.pos, point ),
				normal: Vector.subtract( point, pos ).normalize(),
			}
		}
	}
	
	draw( canvas, scene ){
		if( flags.drawObjectFills || this.material.emission != 0 ){
			canvas.fillStyle = this.colour.toString()
			canvas.beginPath()
			canvas.arc( this.x, this.y, this.r, 0, Math.PI*2 )
			canvas.fill()
		}
		if( flags.drawObjectBorders ){
			canvas.strokeStyle = this.colour.toString()
			canvas.beginPath()
			canvas.arc( this.x, this.y, this.r, 0, Math.PI*2 )
			canvas.closePath()
			canvas.stroke()
		}
		// this.material.draw( canvas, this, scene ) // only for ray tracing (not for path tracing)
	}
	
}