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
		
		const dir = new Vector( Math.random()*2-1, Math.random()*2-1 )
		while( dir.dot( dir ) > 1 ){
			dir.set( Math.random()*2-1, Math.random()*2-1 )
		}
		dir.normalize()
		
		// Ensure ray goes in right direction
		dir.multiply( -Math.sign( ray.dir.dot( ray.to.normal ) * dir.dot( ray.to.normal ) ) )
		return new Ray( ray.to.point, dir.toAngles(), ray.depth-1, colour )
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