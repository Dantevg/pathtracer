import Polygon from "./Polygon.js"

export default class RegularPolygon extends Polygon {
	constructor(x, y, r, nSides, angle, colour, material){
		const points = []
		for( let i = 0; i < nSides; i++ ){
			points.push([
				x + r * Math.cos(i*Math.PI*2/nSides + angle),
				y + r * Math.sin(i*Math.PI*2/nSides + angle)
			])
		}
		
		super(points, colour, material)
	}
	
}