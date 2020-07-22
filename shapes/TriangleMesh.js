import Triangle from "./Triangle.js"

export default class TriangleMesh {
	constructor(vertices, faces, colour, material){
		this.vertices = vertices
		this.colour = colour
		this.material = material
		
		this.faces = []
		for( const face of faces ){
			this.faces.push( new Triangle(this.vertices[face[0]], this.vertices[face[1]], this.vertices[face[2]], this.colour, this.material) )
		}
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