class Camera3D extends Plane {
	constructor( pos, u, v, wPlane, hPlane, wRes, hRes, sensitivity = 1 ){
		super( pos, u.multiply(wPlane), v.multiply(hPlane), wPlane, hPlane, Colour.WHITE, new Null() )
		// this.yaw = Math.atan( dir.y / dir.x )
		// this.pitch = Math.atan( dir.z / dir.y ) // TODO: check
		this.width = wRes
		this.height = hRes
		this.sensitivity = sensitivity
		this.init()
	}
	
	init(){
		// this.dir = Vector.fromAngles3D( this.yaw, this.pitch )
		
		// Top-left corner
		const horizontal = Vector.multiply( this.u, 0.5 )
		const vertical = Vector.multiply( this.v, 0.5 )
		this.a = Vector.subtract( this.pos, horizontal ).subtract( vertical )
		this.normal = this.getNormal()
		this.focusPoint = Vector.multiply( this.normal, -this.w ).add( this.pos )
		
		this.iterations = 0
		this.buffer = []
		for( let x = 0; x < this.width; x++ ){
			this.buffer[x] = []
			for( let y = 0; y < this.height; y++ ){
				this.buffer[x][y] = Colour.BLACK
			}
		}
	}
	
	getIntersection(){
		return false
	}
	
	draw( canvas, scene ){
		if( mouse.x != this.pos.x || mouse.y != this.pos.y ){
			this.pos.set( mouse.x, mouse.y, this.pos.z )
			this.init()
		}
		
		// Draw camera surface
		super.draw( canvas )
		
		for( let x = 0; x < this.width; x++ ){
			for( let y = 0; y < this.height; y++ ){
				const ox = x / this.width
				const oy = y / this.height
				
				const pos = this.a.clone().add( Vector.multiply(this.u, ox) ).add( Vector.multiply(this.v, oy) )
				const dir = Vector.subtract( pos, this.focusPoint ).normalize()
				const ray = new Ray( pos, dir, flags.nBounces, this.colour )
				
				this.buffer[x][y].add( ray.cast( scene ), true )
				if( keys.d ) console.log(ray)
				if( flags.drawRays ) ray.drawLine( canvas )
				if( flags.drawRayHits ) ray.drawPoint( canvas )
			}
		}
		this.iterations++
	}
	
	drawCanvas( canvas ){
		const image = canvas.getImageData( 0, 0, canvas.canvas.width, canvas.canvas.height )
		for( let x = 0; x < Math.min(this.width, image.width); x++ ){
			for( let y = 0; y < Math.min(this.height, image.height); y++ ){
				const colour = Colour.multiply( this.buffer[x][y], new Colour(1/this.iterations) )
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