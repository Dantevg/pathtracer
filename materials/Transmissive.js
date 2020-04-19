class Transmissive {
	// TODO: refraction
	
	constructor( scattering = 0, transparency = 1, refraction = 1 ){
		this.scattering = scattering
		this.transparency = transparency
		this.refraction = refraction
	}
	
	bounce( ray ){
		const normal = ray.object.getNormalFromPoint( ray.to )
		const direction = ray.dir
		const colour = Colour.multiply( ray.colour, ray.object.colour, ray.colour.a )
		colour.a *= this.transparency
		if( colour.a < 0.1 ){ return }
		
		const min = mod( normal.toAngles()-Math.PI/2, Math.PI*2 )
		const max = mod( normal.toAngles()+Math.PI/2, Math.PI*2 )
		const rot = (Math.random()*this.scattering - this.scattering/2) / 180*Math.PI
		const angle = mod( direction.toAngles() + rot, Math.PI*2 )
		const inside = Raytracer.angleBetween( ray.angle, min, max )
		
		if( inside ? Raytracer.angleBetween( angle, min, max ) : Raytracer.angleBetween( angle, max, min ) ){
			ray.children.push( new Ray( ray.to, angle, ray.depth-1, colour ) )
		}
	}
	
	draw( canvas, object ){
		
	}
	
}