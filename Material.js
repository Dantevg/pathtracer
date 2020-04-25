class Material {
	constructor( {roughness, metal, transparency, emission} ){
		this.roughness = roughness ?? 0.5
		this.metal = metal ?? 0
		this.transparency = transparency ?? 0
		this.emission = emission ?? 0
	}
	
	specular( ray ){
		return Vector.subtract( ray.dir, Vector.multiply( ray.to.normal, 2*ray.to.normal.dot(ray.dir) ) )
	}
	
	diffuse( ray ){
		const dir = new Vector( Math.random()*2-1, Math.random()*2-1 )
		while( dir.dot( dir ) > 1 ){
			dir.set( Math.random()*2-1, Math.random()*2-1 )
		}
		dir.normalize()
		
		// Ensure ray goes in right direction
		dir.multiply( -Math.sign( ray.dir.dot( ray.to.normal ) * dir.dot( ray.to.normal ) ) )
		return dir
	}
	
	transmit( ray ){
		return ray.dir.toAngles()
	}
	
	bounce( ray ){
		const colour = Colour.multiply( ray.colour, ray.to.object.colour, ray.colour.a ) // Only for ray visualising
		
		// TODO: use proprer measure of reflectance vs transmittance
		if( Math.random() < this.transparency ){
			return new Ray( ray.to.point, this.transmit(ray), ray.depth-1, colour )
		}else if( Math.random() < this.roughness ){
			return new Ray( ray.to.point, this.diffuse(ray), ray.depth-1, colour )
		}else{
			return new Ray( ray.to.point, this.specular(ray), ray.depth-1, colour )
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