class Plane {
	constructor( pos, u, v, w, h, colour, material ){
		this.pos = pos
		this.u = u
		this.v = v
		this.w = w
		this.h = h
		this.colour = colour
		this.material = material
	}
	
	getIntersection( ray ){
		return false // TODO: implement
	}
	
	getNormal(){
		return Vector.cross( this.u, this.v ).normalize()
	}
	
	draw(){
		
	}
	
}