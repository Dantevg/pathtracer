class Rect extends Polygon {
	constructor( x, y, w, h, colour, material ){
		super( [[x,y], [x+w,y], [x+w,y+h], [x,y+h]], colour, material )
	}
	
}