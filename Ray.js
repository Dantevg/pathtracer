class Ray {
	constructor( pos, angle, parentOrDepth, colour ){
		this.pos = pos
		
		if( typeof angle == "number" ){ // Angle given
			this.angle = angle
			this.dir = new Vector( Math.cos(this.angle), Math.sin(this.angle) )
		}else{ // Direction vector given
			this.angle = angle.toAngles()
			this.dir = angle
		}
		
		if( parentOrDepth instanceof Ray ){
			this.parent = parentOrDepth
			this.depth = this.parent.depth - 1
		}else{
			this.depth = parentOrDepth
		}
		
		this.colour = new Colour(colour)
	}
	
	cast( scene ){
		this.children = []
		
		let minDist = Infinity
		let minPoint
		let minObject
		
		for( const object of scene ){
			const pos = object.getIntersection( this )
			if( pos ){
				const dist = Vector.distSq( this.pos, pos )
				if( dist < minDist ){
					minDist = dist
					minPoint = pos
					minObject = object
				}
			}
		}
		
		if( minPoint ){
			this.dist = minDist
			this.to = minPoint
			this.object = minObject
			
			if( this.depth > 0 ){
				this.object.material.bounce( this )
				let colours = []
				for( const ray of this.children ){
					colours.push( ray.cast( scene ) )
				}
				return Colour.multiply( Raytracer.averageColour(colours), this.object.colour )
			}else{
				return this.object.colour
			}
			
		}
	}
	
	lookAt( x, y ){
		this.dir.x = x - this.pos.x
		this.dir.y = y - this.pos.y
		this.dir.normalize()
	}
	
	drawPoint( canvas ){
		if( !this.to ){ return }
		canvas.beginPath()
		const colour = Colour.multiply( this.colour, this.object.colour )
		canvas.fillStyle = colour.setAlpha(0.1).toString()
		canvas.fillRect( this.to.x, this.to.y, 1, 1 )
		canvas.fill()
		canvas.closePath()
		
		for( const ray of this.children ){
			ray.drawPoint( canvas )
		}
	}
	
	drawLine( canvas ){
		if( !this.to ){ return }
		// canvas.strokeStyle = colour.setAlpha( colour.getAlpha()*1000/this.dist ).toString()
		// canvas.strokeStyle = this.colour.setAlpha(0.1).toString()
		canvas.strokeStyle = this.colour.toString()
		canvas.beginPath()
		canvas.moveTo( this.pos.x, this.pos.y )
		canvas.lineTo( this.to.x, this.to.y )
		canvas.stroke()
		canvas.closePath()
		
		for( const ray of this.children ){
			ray.drawLine( canvas )
		}
	}
	
}