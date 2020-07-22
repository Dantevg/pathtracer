import Vector from "../lib/Vector.js"
import Plane from "./Plane.js"

export default class Cube {
	constructor(pos, u, v, size, colour, material){
		this.pos = pos
		this.u = u.normalize()
		this.v = v.normalize()
		this.size = size
		this.colour = colour
		this.material = material
		
		this.normal = Vector.cross(this.u, this.v).normalize()
		
		this.faces = []
		// Front
		this.faces.push( new Plane( Vector.subtract(this.pos, Vector.multiply(this.normal, this.size/2)), this.u, this.v, this.size, this.size, this.colour, this.material ) )
		// Back
		this.faces.push( new Plane( Vector.add(this.pos, Vector.multiply(this.normal, this.size/2)), this.u, this.v, this.size, this.size, this.colour, this.material ) )
		// Left
		this.faces.push( new Plane( Vector.subtract(this.pos, Vector.multiply(this.u, this.size/2)), this.normal, this.v, this.size, this.size, this.colour, this.material ) )
		// Right
		this.faces.push( new Plane( Vector.add(this.pos, Vector.multiply(this.u, this.size/2)), this.normal, this.v, this.size, this.size, this.colour, this.material ) )
		// Top
		this.faces.push( new Plane( Vector.subtract(this.pos, Vector.multiply(this.v, this.size/2)), this.normal, this.u, this.size, this.size, this.colour, this.material ) )
		// Bottom
		this.faces.push( new Plane( Vector.add(this.pos, Vector.multiply(this.v, this.size/2)), this.normal, this.u, this.size, this.size, this.colour, this.material ) )
	}
	
	getIntersection(ray){
		let min = {
			distSq: Infinity
		}
		
		for( const face of this.faces ){
			const hit = face.getIntersection(ray)
			if(hit && hit.distSq < min.distSq){
				min = hit
			}
		}
		
		min.object = this
		if(min.point) return min
	}
	
	draw(canvas, flags){
		for( const face of this.faces ){
			face.draw(canvas, flags)
		}
	}
	
}