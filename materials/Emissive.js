class Emissive {
	
	constructor(){
		// this.scattering = scattering
		// this.emission = emission
	}
	
	bounce( ray ){
		const normal = ray.object.getNormalFromPoint( ray.to )
		const direction = ray.dir
		// const colour = Colour.multiply( ray.colour, ray.object.colour )
		if( ray.colour.getAlpha() < 0.1 ){ return }
		
		const min = mod( normal.toAngles()-Math.PI/2, Math.PI*2 )
		const max = mod( normal.toAngles()+Math.PI/2, Math.PI*2 )
		const angle = mod( direction.toAngles(), Math.PI*2 )
		const inside = Raytracer.angleBetween( ray.angle, min, max )
		
		if( inside && Raytracer.angleBetween( angle, min, max ) ){
			ray.children.push( new Ray( ray.to, angle, ray.depth-1, ray.colour ) )
		}
	}
	
	draw( canvas, object, scene ){
		const pos = new Vector( object.x + object.w/2, object.y + object.h/2 )
		
		for( let i = 0; i < flags.nRays; i++ ){
			// Randomise angle
			const angle = Math.random()*Math.PI*2
			const ray = new Ray( pos, angle, flags.nBounces, object.colour )
			
			ray.cast( scene )
			if( flags.drawRays ) ray.drawLine( canvas )
			if( flags.drawRayHits ) ray.drawPoint( canvas )
		}
	}
	
}