import Vector from "./lib/Vector.js"
import Colour from "./lib/Colour.js"
import Ray from "./Ray.js"

export default class Material {
	constructor( {roughness, metal, transparency, emission, ior} ){
		this.roughness = roughness ?? 0.5
		this.metal = metal ?? 0
		this.transparency = transparency ?? 0
		this.emission = emission ?? 0
		this.ior = ior ?? 1.5
	}
	
	specular(ray){
		return Vector.subtract( ray.dir, Vector.multiply(ray.to.normal, 2*ray.to.normal.dot(ray.dir)) )
	}
	
	diffuse(ray){
		const dir = Vector.random3DAngles()
		
		// Ensure ray goes in right direction
		dir.multiply( -Math.sign(ray.dir.dot(ray.to.normal) * dir.dot(ray.to.normal)) )
		return dir
	}
	
	transmit(ray){
		// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/reflection-refraction-fresnel
		// const n = ((ray.dir.dot(ray.to.normal) < 0) ? ray.ior : 1) / this.ior
		let N = Vector.clone(ray.to.normal)
		let c1 = ray.to.normal.dot(ray.dir)
		
		if(c1 < 0){ // Ray incoming
			c1 = -c1
			var n = 1 / this.ior
		}else{ // Ray outgoing
			N = Vector.multiply(N, -1);
			var n = this.ior / 1
		}
		const c2 = Math.sqrt( 1 - n*n * (1-c1*c1) )
		const dir = Vector.multiply(ray.dir, n).add( Vector.multiply(N, n*c1 - c2) )
		return dir
	}
	
	fresnel(ray){
		let cosi = Math.min( Math.max(-1, ray.dir.dot(ray.to.normal)), 1 )
		let etai = 1
		let etat = this.ior
		if(cosi > 0) [etai, etat] = [etat, etai]
		
		const sint = etai / etat * Math.sqrt(1-cosi*cosi)
		if(sint >= 1){
			return 1
		}else{
			const cost = Math.sqrt(1 - sint*sint)
			cosi = Math.abs(cosi)
			const rs = (etat*cosi - etai*cost) / (etat*cosi + etai*cost)
			const rp = (etai*cosi - etat*cost) / (etai*cosi + etat*cost)
			return (rs*rs + rp*rp) / 2
		}
	}
	
	bounce(ray){
		let colour = Colour.multiply(ray.colour, ray.to.object.colour, ray.colour.a) // Only for ray visualising
		let dir
		
		if( Math.random() < this.fresnel(ray) ){
			dir = this.specular(ray)
		}else if( Math.random() < this.transparency ){
			dir = this.transmit(ray)
		}else{
			dir = this.diffuse(ray)
		}
		return new Ray( Vector.add(ray.to.point, Vector.multiply(dir, 0.001)), dir, ray.depth-1, colour )
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