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
	
	// https://29a.ch/sandbox/2010/cornellbox/worker.js
	fresnel2(ray){
		var theta1 = Math.abs(ray.dir.dot(ray.to.normal));
		if(theta1 >= 0.0) {
				var internalIndex = this.ior;
				var externalIndex = 1.0;
		}
		else {
				var internalIndex = 1.0;
				var externalIndex = this.ior;
		}
		var eta = externalIndex/internalIndex;
		var theta2 = Math.sqrt(1.0 - (eta * eta) * (1.0 - (theta1 * theta1)));
		var rs = (externalIndex * theta1 - internalIndex * theta2) / (externalIndex*theta1 + internalIndex * theta2);
		var rp = (internalIndex * theta1 - externalIndex * theta2) / (internalIndex*theta1 + externalIndex * theta2);
		var reflectance = (rs*rs + rp*rp);
		// reflection
		if(Math.random() < reflectance+0.1) {
			return Vector.add(ray.dir, Vector.multiply(ray.to.normal, theta1*2))
		}
		// refraction
		return Vector.add(ray.dir, Vector.multiply(ray.to.normal, theta1).multiply(eta).add(
			Vector.multiply(ray.to.normal, -theta2)
		))
		//return ray.dir.muls(eta).sub(normal.muls(theta2-eta*theta1));
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
	
	schlick(dir, normal){
		const cosIncident = Vector.multiply(dir, -1).dot(normal)
		const fresnel = new Vector(0.04, 0.04, 0.04)
		return fresnel.add( new Vector(1, 1, 1).subtract(fresnel) ).multiply( Math.pow(1 - cosIncident, 5) )
	}
	
	bounce(ray){
		let colour = Colour.multiply(ray.colour, ray.to.object.colour, ray.colour.a) // Only for ray visualising
		
		if( this.emission == 1 ){
			return // Don't reflect off fully emissive objects
		}else if(Math.random() < this.transparency){
			const dir = this.fresnel2(ray)
			return new Ray( Vector.add(ray.to.point, Vector.multiply(dir, 0.001)), dir, ray.depth-1, colour )
		}else{
			return this.diffuse(ray, colour)
		}
		
		// if( Math.random() < this.fresnel(ray) ){
		// 	return this.specular(ray, colour)
		// }else if( Math.random() < this.transparency ){
		// 	return this.transmit(ray, colour)
		// }else{
		// 	return this.diffuse(ray, colour)
		// }
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