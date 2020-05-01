class Material {
	constructor( {roughness, metal, transparency, emission, refraction} ){
		this.roughness = roughness ?? 0.5
		this.metal = metal ?? 0
		this.transparency = transparency ?? 0
		this.emission = emission ?? 0
		this.refraction = refraction ?? 1.5
	}
	
	specular( ray ){
		return Vector.subtract( ray.dir, Vector.multiply( ray.to.normal, 2*ray.to.normal.dot(ray.dir) ) )
	}
	
	diffuse( ray ){
		const dir = Vector.random2DAngle()
		
		// Ensure ray goes in right direction
		dir.multiply( -Math.sign( ray.dir.dot( ray.to.normal ) * dir.dot( ray.to.normal ) ) )
		return dir
	}
	
	transmit( ray ){
		// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/reflection-refraction-fresnel
		// const n = ray.ior / ((ray.dir.dot(ray.to.normal) < 0) ? this.refraction : 1) // TODO: Is this right for outgoing rays?
		const n = ray.ior/this.refraction
		const c1 = ray.to.normal.dot( ray.dir )
		const c2 = Math.sqrt( 1 - n*n * (1-c1*c1) )
		const dir = Vector.multiply( ray.dir, n ).add( Vector.multiply( ray.to.normal, n*c1 - c2 ) )
		return dir
	}
	
	fresnel( ray ){
		let cosi = Math.min( Math.max( -1, ray.dir.dot(ray.to.normal) ), 1 )
		let etai = ray.ior
		let etat = this.refraction
		if( cosi > 0 ) [etai, etat] = [etat, etai]
		
		const sint = etai / etat * Math.sqrt( 1-cosi*cosi )
		if( sint >= 1 ){
			return 1
		}else{
			const cost = Math.sqrt( 1 - sint*sint )
			cosi = Math.abs(cosi)
			const rs = (etat*cosi - etai*cost) / (etat*cosi + etai*cost)
			const rp = (etai*cosi - etat*cost) / (etai*cosi + etat*cost)
			return (rs*rs + rp*rp) / 2
		}
	}
	
	bounce( ray ){
		let colour = Colour.multiply( ray.colour, ray.to.object.colour, ray.colour.a ) // Only for ray visualising
		let dir
		
		if( Math.random() < this.fresnel(ray) ){
			dir = this.specular(ray)
		}else if( Math.random() < this.transparency ){
			dir = this.transmit(ray)
		}else{
			dir = this.diffuse(ray)
		}
		return new Ray( Vector.add( ray.to.point, Vector.multiply(dir, 0.001) ), dir, ray.depth-1, colour, this.refraction )
	}
	
	// Some default materials
	static get glossy(){
		return new Material({roughness: 0})
	}
	static get matte(){
		return new Material({roughness: 1})
	}
	static get transparent(){
		return new Material({roughness: 0, transparency: 1})
	}
	static get emissive(){
		return new Material({emission: 1})
	}
	
}