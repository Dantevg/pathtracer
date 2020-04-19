class Reflective {
	
	constructor( scattering = 90 ){
		this.scattering = scattering
	}
	
	bounce( ray ){
		const normal = ray.object.getNormalFromPoint( ray.to )
		const direction = Vector.subtract( ray.dir, Vector.multiply( normal, 2*normal.dot(ray.dir) ) )
		const colour = Colour.multiply( ray.colour, ray.object.colour )
		// colour.setAlpha( colour.getAlpha()*(10/Math.sqrt(ray.dist)) ) // TODO: weigh colour by angle
		// if( colour.getAlpha() < 0.01 ){ return }
		
		const min = mod( normal.toAngles()-Math.PI/2, Math.PI*2 )
		const max = mod( normal.toAngles()+Math.PI/2, Math.PI*2 )
		const rot = (Math.random()*this.scattering - this.scattering/2) / 180*Math.PI
		const angle = mod( direction.toAngles() + rot, Math.PI*2 )
		const inside = Raytracer.angleBetween( ray.angle, min, max )
		
		if( (inside && flags.reflectiveInside) ? Raytracer.angleBetween( angle, max, min ) : Raytracer.angleBetween( angle, min, max ) ){
			ray.children.push( new Ray( ray.to, angle, ray.depth-1, colour ) )
		}
	}
	
	draw( canvas, object ){
		
	}
	
}