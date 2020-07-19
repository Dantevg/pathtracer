import Vector from "../lib/Vector.js"

export default class Sphere {
	constructor(pos, r, colour, material){
		this.pos = pos
		this.r = r
		this.colour = colour
		this.material = material
	}
	
	getIntersection(ray){
		const sphereToRay = Vector.subtract(ray.pos, this.pos)
		
		const a = ray.dir.dot(ray.dir)
		const b = 2 * ray.dir.dot(sphereToRay)
		const c = sphereToRay.dot(sphereToRay) - this.r**2
		
		const D = b*b - 4*a*c
		let t
		if(D < 0){
			return
		}else if(D == 0){
			t = -0.5*b / a
			if(t <= 0) return
		}else{
			const q = (b>0) ? -0.5*(b+Math.sqrt(D)) : -0.5*(b-Math.sqrt(D))
			const t0 = q/a
			const t1 = c/q
			t = Math.min(t0, t1) > 0 ? Math.min(t0, t1) : Math.max(t0, t1)
			if(t <= 0) return
		}
		
		const point = Vector.multiply(ray.dir, t).add(ray.pos)
		return {
			object: this,
			point: point,
			distSq: t*t,
			normal: Vector.subtract(point, this.pos).normalize(),
		}
	}
	
	draw(canvas, flags){
		if(flags.drawObjectFills || this.material.emission != 0){
			canvas.fillStyle = this.colour.toString()
			canvas.beginPath()
			canvas.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2)
			canvas.fill()
		}
		if(flags.drawObjectBorders){
			canvas.strokeStyle = this.colour.toString()
			canvas.beginPath()
			canvas.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2)
			canvas.closePath()
			canvas.stroke()
		}
		if(flags.drawNormals){
			const pos = new Vector(this.pos.x, this.pos.y)
			for( let i = 0; i < 8; i++ ){ // Draw 8 normals
				const angle = i / 8 * Math.PI*2
				const point = new Vector( this.pos.x + Math.cos(angle)*this.r, this.pos.y + Math.sin(angle)*this.r )
				const normal = Vector.subtract(point, pos).normalize().multiply(10)
				canvas.strokeStyle = "#00FF00"
				canvas.beginPath()
				canvas.moveTo(point.x, point.y)
				canvas.lineTo(point.x+normal.x, point.y+normal.y)
				canvas.stroke()
				canvas.closePath()
			}
		}
	}
	
}