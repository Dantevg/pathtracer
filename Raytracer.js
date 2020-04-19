// To be precise, not really a ray tracer, but a path tracer:
// Ray casting - 1 ray per pixel, no bounces, real time (wolfenstein 3D)
// Ray tracing - 1 ray per pixel, bounce towards point light source, not real time
// Path tracing - multiple rays per pixel, bounce like physics, not real time (rendering)

class Raytracer {
	constructor( cvs, scene ){
		this.canvas = cvs.getContext("2d")
		this.width = cvs.width
		this.height = cvs.height
		this.scene = scene
		this.pos = new Vector( this.width/2, this.height/2 )
		this.angle = 0
		this.init()
	}
	
	init(){
		this.ray = new Ray( this.pos, 0, flags.nBounces, "#FFFFFF" )
		
		// Clear canvas
		this.canvas.fillStyle = "#000000"
		this.canvas.fillRect( 0, 0, this.width, this.height )
	}
	
	draw(){
		this.pos.set( mouse.x, mouse.y ) // Set light source on mouse position
		
		// Set single ray direction
		if( keys.ArrowLeft ){
			camera.angle = mod( camera.angle-0.05, Math.PI*2 )
			camera.init()
		}else if( keys.ArrowRight ){
			camera.angle = mod( camera.angle+0.05, Math.PI*2 )
			camera.init()
		}
		
		// Background
		this.canvas.fillStyle = "rgba(0,0,0,0.1)"
		this.canvas.fillRect( 0, 0, this.width, this.height-49 )
		
		// Objects
		for( const object of this.scene ){
			object.draw( this.canvas, this.scene )
		}
		
		// Cast rays from mouse
		// for( let i = 0; i < flags.nRays; i++ ){
		// 	// Randomise angle
		// 	this.ray.angle = (this.angle + Math.random()*flags.fov - flags.fov/2)/360*Math.PI*2
		// 	this.ray.dir.set( Math.cos(this.ray.angle), Math.sin(this.ray.angle) )
			
		// 	this.ray.cast( this.scene )
		// 	if( flags.drawRays ) this.ray.drawLine( this.canvas )
		// 	if( flags.drawRayHits ) this.ray.drawPoint( this.canvas )
		// }
		
		// Draw camera vision
		camera.drawCanvas( this.canvas, this.height )
		
		// Print settings
		this.canvas.fillStyle = "#000000"
		this.canvas.fillRect( 0, 0, 180, 160 )
		this.canvas.font = "10px monospace"
		let i = 1
		for( const flag in flags ){
			if( typeof flags[flag] == "function" ){
				continue
			}
			this.canvas.fillStyle = "#FFFFFF"
			if( typeof flags[flag] == "boolean" ){
				this.canvas.fillStyle = flags[flag] ? "#44FF44" : "#FF4444"
			}
			this.canvas.fillText( flag + ": " + flags[flag], 10, 15*i )
			i++
		}
	}
	
	static blendColour( c1, c2 ){
		return tinycolor({
			r: (c1._r/255 * c2._r/255) * 255,
			g: (c1._g/255 * c2._g/255) * 255,
			b: (c1._b/255 * c2._b/255) * 255,
			a: c1._a,
		})
	}
	
	static blendColours( colours ){
		let r = 0
		let g = 0
		let b = 0
		let a = 0
		
		for( let i = 0; i < colours.length; i++ ){
			const c = tinycolor( colours[i] )
			r += c._r * c._a
			g += c._g * c._a
			b += c._b * c._a
			a += c._a
		}
		
		return tinycolor( {r: r/colours.length, g: g/colours.length, b: b/colours.length, a: a/colours.length} ).toString()
	}
	
	static angleBetween( a, min, max ){
		a = mod( a, Math.PI*2 )
		min = mod( min, Math.PI*2 )
		max = mod( max, Math.PI*2 )
		if( min < max ){
			return a > min && a < max
		}else{
			return a > min || a < max
		}
	}
	
}