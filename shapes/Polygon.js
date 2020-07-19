export default class Polygon {
	constructor(points, colour, material){
		this.points = points
		this.colour = colour
		this.material = material
		
		this.sides = []
		for( let i = 0; i < this.points.length; i++ ){
			const x1 = this.points[i][0]
			const y1 = this.points[i][1]
			const x2 = this.points[(i+1) % this.points.length][0]
			const y2 = this.points[(i+1) % this.points.length][1]
			this.sides.push( new Line(x1, y1, x2, y2, this.colour, this.material) )
		}
	}
	
	getIntersection(ray){
		let min = {
			distSq: Infinity
		}
		
		for( const side of this.sides ){
			const hit = side.getIntersection(ray)
			if(hit && hit.distSq < min.distSq){
				min = hit
			}
		}
		
		min.object = this
		if(min.point) return min
	}
	
	draw(canvas, scene){
		for( const side of this.sides ){
			side.draw(canvas)
		}
		// this.material.draw( canvas, this, scene ) // only for ray tracing (not for path tracing)
	}
	
}