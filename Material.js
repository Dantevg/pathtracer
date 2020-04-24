class Material {
	constructor( {roughness, metal, transparency, emission} ){
		this.roughness = roughness ?? 0.5
		this.metal = metal ?? 0
		this.transparency = transparency ?? 0
		this.emission = emission ?? 0
	}
	
	bounce( ray ){
		const normal = ray.to.normal
		let direction
		
		const colour = Colour.multiply( ray.colour, ray.to.object.colour, ray.colour.a ) // Only for ray visualising
		
		// TODO: use proprer measure of reflectance vs transmittance
		if( Math.random() >= this.transparency ){ // Reflect
			direction = Vector.subtract( ray.dir, Vector.multiply( normal, 2*normal.dot(ray.dir) ) )
		}else{ // Transmit
			direction = ray.dir
		}
		
		const min = mod( normal.toAngles()-Math.PI/2, Math.PI*2 )
		const max = mod( normal.toAngles()+Math.PI/2, Math.PI*2 )
		const rot = (Math.random()-0.5)*this.roughness * Math.PI*2
		const angle = mod( direction.toAngles() + rot, Math.PI*2 )
		const inside = Raytracer.angleBetween( ray.angle, min, max )
		
		if( inside ? Raytracer.angleBetween( angle, max, min ) : Raytracer.angleBetween( angle, min, max ) ){
			// ray.children.push( new Ray( ray.to, angle, ray.depth-1, colour ) )
			return new Ray( ray.to.point, angle, ray.depth-1, colour )
		}
	}
	
	// Some default materials
	static get glossy(){
		return new Material({roughness: 0})
	}
	static get matte(){
		return new Material({roughness: 1})
	}
	static get transmissive(){
		return new Material({roughness: 0, transparency: 1})
	}
	static get emissive(){
		return new Material({emission: 10})
	}
	
}