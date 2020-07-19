import Polygon from "./Polygon.js"

export default class Rect extends Polygon {
	constructor(x, y, w, h, colour, material){
		super( [[x,y], [x+w,y], [x+w,y+h], [x,y+h]], colour, material )
	}
	
}