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
		
		this.colour = colour
		this.to = {}
	}
	
	cast( scene ){
		// Max depth reached
		if( this.depth < 0 ){
			return Colour.TRANSPARENT
		}
		
		this.to = {distSq: Infinity}
		for( const object of scene ){
			const hit = object.getIntersection( this )
			if( hit && hit.distSq < this.to.distSq ){
				this.to = hit
			}
		}
		
		if( this.to.object ){
			// Continue tracing (reflect/transmit)
			this.ray = this.to.object.material.bounce( this )
			if( this.ray ){
				return this.ray.cast( scene ).multiply( this.to.object.colour ).add( this.to.object.material.emission )
			}
		}
		
		// No object in path or no continuing ray, don't draw
		return Colour.TRANSPARENT
	}
	
	lookAt( x, y ){
		this.dir.x = x - this.pos.x
		this.dir.y = y - this.pos.y
		this.dir.normalize()
	}
	
	drawPoint( canvas ){
		if( !this.to.object ){ return }
		canvas.beginPath()
		const colour = Colour.multiply( this.colour, this.to.object.colour, this.colour.a )
		canvas.fillStyle = colour.setAlpha(0.1).toString()
		canvas.fillRect( this.to.point.x+0.5, this.to.point.y+0.5, 1, 1 )
		canvas.fill()
		canvas.closePath()
		
		if( this.ray ) this.ray.drawPoint( canvas )
		
		// for( const ray of this.children ){
		// 	ray.drawPoint( canvas )
		// }
	}
	
	drawLine( canvas ){
		if( !this.to.object ){ return }
		// canvas.strokeStyle = colour.setAlpha( colour.a*1000/this.dist ).toString()
		canvas.strokeStyle = this.colour.setAlpha(0.01).toString()
		// canvas.strokeStyle = this.colour.toString()
		canvas.beginPath()
		canvas.moveTo( this.pos.x, this.pos.y )
		canvas.lineTo( this.to.point.x, this.to.point.y )
		canvas.stroke()
		canvas.closePath()
		
		if( this.ray ) this.ray.drawLine( canvas )
		
		// for( const ray of this.children ){
		// 	ray.drawLine( canvas )
		// }
	}
	
}