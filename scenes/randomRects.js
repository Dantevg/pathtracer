function createScene( canvasElement ){
	function randomObjects( objects, n, randomColour, material ){
		for( let i = 0; i < n; i++ ){
			const colour = randomColour ? Colour.random() : Colour.WHITE
			objects.push( {colour: colour, material: material} )
		}
	}
	
	function fillScene( scene, objects ){
		const min = objects.length
		const xMax = canvasElement.width/flags.blockScale
		const yMax = (canvasElement.height-50)/flags.blockScale
		const halfScale = flags.blockScale / 2
		objects.length = Math.floor(xMax) * Math.floor(yMax)
		objects.fill( false, min )
		for( let x = 0; x < canvasElement.width-flags.blockScale; x += flags.blockScale ){
			for( let y = 0; y < canvasElement.height-flags.blockScale-50; y += flags.blockScale ){
				const obj = objects.splice( Math.floor(Math.random()*objects.length), 1 )[0]
				if( obj ){
					scene.push(
						new Rect( x, y, flags.blockScale, flags.blockScale, obj.colour, obj.material )
					)
				}
			}
		}
	}
	
	const scene = []
	const material = new Material({roughness: 0.8})
	
	scene.push( new Rect( 0, 0, canvasElement.width, canvasElement.height-50, Colour.WHITE,
		material ) ) // Background
	
	const objects = []
	randomObjects( objects, 25, false, material )
	randomObjects( objects, 5, true, material )
	// randomObjects( objects, 50, true, new Transmissive( 45, 1, 1 ) )
	// randomObjects( objects, 1, false, new Emissive() )
	fillScene( scene, objects )
	
	return scene
}