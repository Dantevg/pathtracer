import Vector from "../lib/Vector.js"

export default class Triangle {
	constructor(a, b, c, colour, material){
		this.a = a
		this.b = b
		this.c = c
		this.ab = Vector.subtract(this.b, this.a)
		this.bc = Vector.subtract(this.c, this.b)
		this.ca = Vector.subtract(this.a, this.c)
		this.ac = Vector.subtract(this.c, this.a)
		this.normal = Vector.cross(this.ab, this.ac).normalize()
		this.colour = colour
		this.material = material
	}
	
	getIntersection(ray){
		const denominator = this.normal.dot(ray.dir)
		if(Math.abs(denominator) < Number.EPSILON) return false // Parallel
		
		const d = this.normal.dot(this.a)
		const t = -(this.normal.dot(ray.pos) - d) / denominator
		if(t < 0) return false // Behind ray
		
		const point = Vector.multiply(ray.dir, t).add(ray.pos)
		
		const p0 = Vector.subtract(point, this.a)
		if( this.normal.dot(this.ab.cross(p0)) < 0 ) return false
		
		const p1 = Vector.subtract(point, this.b)
		if( this.normal.dot(this.bc.cross(p1)) < 0 ) return false
		
		const p2 = Vector.subtract(point, this.c)
		if( this.normal.dot(this.ca.cross(p2)) < 0 ) return false
		
		return {
			object: this,
			point: point,
			distSq: t*t,
			normal: this.normal,
		}
	}
	
	draw(canvas, flags){
		if(flags.drawObjectBorders){
			canvas.strokeStyle = this.colour.toString()
			canvas.beginPath()
			canvas.moveTo(this.a.x+0.5, this.a.y+0.5)
			canvas.lineTo(this.b.x+0.5, this.b.y+0.5)
			canvas.lineTo(this.c.x+0.5, this.c.y+0.5)
			canvas.lineTo(this.a.x+0.5, this.a.y+0.5)
			canvas.stroke()
			canvas.closePath()
		}
		
		// Draw normals
		if(flags.drawNormals){
			const normal = Vector.multiply(this.normal, 20)
			canvas.strokeStyle = "#00FF00"
			canvas.beginPath()
			canvas.moveTo(this.a.x, this.a.y)
			canvas.lineTo(this.a.x+normal.x, this.a.y+normal.y)
			canvas.stroke()
			canvas.closePath()
		}
	}
}