import Vector from "./lib/Vector.js"
import Colour from "./lib/Colour.js"
import Ray from "./Ray.js"
import Null from "./Null.js"
import Plane from "./shapes/Plane.js"

export default class Camera extends Plane {
	constructor(pos, u, v, wPlane, hPlane, sensitivity = 1){
		super(pos, u, v, wPlane, hPlane, Colour.WHITE, new Null())
		this.sensitivity = sensitivity
	}
	
	init(width, height, sx = 0, sy = 0, sw, sh){
		this.width = width
		this.height = height
		this.sx = sx
		this.sy = sy
		this.sw = sw ?? width
		this.sh = sh ?? height
		
		const horizontal = Vector.multiply(this.u, 0.5*this.w)
		const vertical = Vector.multiply(this.v, 0.5*this.h)
		this.a = Vector.subtract(this.pos, horizontal).subtract(vertical)
		this.normal = this.getNormal()
		this.focusPoint = Vector.multiply(this.normal, -this.w).add(this.pos)
		
		this.iterations = 0
		this.buffer = []
		for( let x = 0; x < this.sw; x++ ){
			this.buffer[x] = []
			for( let y = 0; y < this.sh; y++ ){
				this.buffer[x][y] = Colour.BLACK
			}
		}
	}
	
	trace(nBounces){
		for( let x = 0; x < this.sw; x++ ){
			for( let y = 0; y < this.sh; y++ ){
				const ox = (x+this.sx) / this.width * this.w
				const oy = (y+this.sy) / this.height * this.h
				
				const pos = this.a.clone().add( Vector.multiply(this.u, ox) ).add(Vector.multiply(this.v, oy))
				const dir = Vector.subtract(pos, this.focusPoint).normalize()
				const ray = new Ray(pos, dir, nBounces, this.colour)
				
				this.buffer[x][y].add(ray.cast(this.scene.objects), true)
			}
		}
		this.iterations++
	}
	
}