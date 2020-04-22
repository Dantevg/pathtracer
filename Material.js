class Material {
	constructor( colour, scattering, transparency, emission ){
		this.colour = colour ?? Colour.WHITE
		this.scattering = scattering ?? 30
		this.transparency = transparency ?? 0
		this.emission = emission ?? 0
	}
	
	reflect(){
		
	}
	
	emit(){
		
	}
	
	transmit(){
		
	}
	
}