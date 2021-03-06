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
	
	specular(ray, colour){
		const dir = Vector.subtract( ray.dir, Vector.multiply(ray.to.normal, 2*ray.to.normal.dot(ray.dir)) )
		return new Ray( Vector.add(ray.to.point, Vector.multiply(dir, 0.001)), dir, ray.depth-1, colour )
	}
	
	diffuse(ray, colour){
		const dir = Vector.random3DAngles()
		
		// Ensure ray goes in right direction
		dir.multiply( -Math.sign(ray.dir.dot(ray.to.normal) * dir.dot(ray.to.normal)) )
		return new Ray( Vector.add(ray.to.point, Vector.multiply(dir, 0.001)), dir, ray.depth-1, colour )
	}
	
	transmit(ray, colour){
		// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/reflection-refraction-fresnel
		// const n = ((ray.dir.dot(ray.to.normal) < 0) ? ray.ior : 1) / this.ior
		let N = Vector.clone(ray.to.normal)
		let c1 = ray.to.normal.dot(ray.dir)
		
		if(c1 < 0){ // Ray incoming
			c1 = -c1
			var n = 1 / this.ior
		}else{ // Ray outgoing
			N = Vector.multiply(N, -1)
			var n = this.ior / 1
		}
		const c2 = Math.sqrt( 1 - n*n * (1-c1*c1) )
		const dir = Vector.multiply(ray.dir, n).add( Vector.multiply(N, n*c1 - c2) )
		return new Ray( Vector.add(ray.to.point, Vector.multiply(dir, 0.001)), dir, ray.depth-1, colour )
	}
	
	fresnel(ray){
		let cosi = Math.min( Math.max(-1, ray.dir.dot(ray.to.normal)), 1 )
		let etai = 1
		let etat = this.ior
		if(cosi > 0) [etai, etat] = [etat, etai]
		
		const sint = etai / etat * Math.sqrt(Math.max(0, 1-cosi*cosi))
		if(sint >= 1){
			return 1
		}else{
			const cost = Math.sqrt(Math.max(0, 1 - sint*sint))
			cosi = Math.abs(cosi)
			const rs = (etat*cosi - etai*cost) / (etat*cosi + etai*cost)
			const rp = (etai*cosi - etat*cost) / (etai*cosi + etat*cost)
			return (rs*rs + rp*rp) / 2
		}
	}
	
	// https://stackoverflow.com/a/33002487
	schlick(ray){
		return Math.pow( 1 - Math.abs(Vector.dot(ray.to.normal,ray.dir)), 5 )
	}
	
	bounce(ray){
		let colour = Colour.multiply(ray.colour, ray.to.object.colour, ray.colour.a) // Only for ray visualising
		
		if( this.emission == 1 ){
			return // Don't reflect off fully emissive objects
		}else if( Math.random() < this.fresnel(ray)*(1-this.roughness) ){
			return this.specular(ray, colour)
		}else if( Math.random() < this.transparency ){
			return this.transmit(ray, colour)
		}else{
			return this.diffuse(ray, colour)
		}
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