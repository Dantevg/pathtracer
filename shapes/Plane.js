import Vector from "../lib/Vector.js"

export default class Plane {
	constructor(pos, u, v, w, h, colour, material){
		this.pos = pos
		this.u = u.normalize()
		this.v = v.normalize()
		this.w = w
		this.h = h
		this.colour = colour
		this.material = material
	}
	
	getIntersection(ray){
		const normal = this.getNormal()
		const denominator = normal.dot(ray.dir)
		if(Math.abs(denominator) < Number.EPSILON) return false // Parallel
		
		const t = normal.dot(Vector.subtract(this.pos, ray.pos)) / denominator
		if(t < 0) return false // Behind ray
		
		const point = Vector.multiply(ray.dir, t).add(ray.pos)
		const u = Vector.subtract(point, this.pos).dot(this.u)
		const v = Vector.subtract(point, this.pos).dot(this.v)
		
		if( u > -this.w/2 && u < this.w/2 && v > -this.h/2 && v < this.h/2 ){
			return {
				object: this,
				point: point,
				distSq: t*t,
				normal: normal,
			}
		}
		
		return false
	}
	
	getNormal(){
		return Vector.cross(this.u, this.v).normalize()
	}
	
	draw(canvas, flags){
		if(flags.drawObjectBorders){
			const uHalf = Vector.multiply(this.u, 0.5*this.w)
			const vHalf = Vector.multiply(this.v, 0.5*this.h)
			const a = Vector.subtract(this.pos, uHalf).subtract(vHalf)
			const b = Vector.add(this.pos, uHalf).subtract(vHalf)
			const c = Vector.subtract(this.pos, uHalf).add(vHalf)
			const d = Vector.add(this.pos, uHalf).add(vHalf)
			
			canvas.strokeStyle = this.colour.toString()
			canvas.beginPath()
			canvas.moveTo(a.x+0.5, a.y+0.5)
			canvas.lineTo(b.x+0.5, b.y+0.5)
			canvas.lineTo(d.x+0.5, d.y+0.5)
			canvas.lineTo(c.x+0.5, c.y+0.5)
			canvas.lineTo(a.x+0.5, a.y+0.5)
			canvas.stroke()
			canvas.closePath()
		}
		
		// Draw normals
		if(flags.drawNormals){
			const normal = this.getNormal().multiply(20)
			canvas.strokeStyle = "#00FF00"
			canvas.beginPath()
			canvas.moveTo(this.pos.x, this.pos.y)
			canvas.lineTo(this.pos.x+normal.x, this.pos.y+normal.y)
			canvas.stroke()
			canvas.closePath()
		}
	}
	
}