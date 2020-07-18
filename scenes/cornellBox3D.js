function createScene( canvasElement ){
	const scene = []
	
	// Ceiling
	scene.push( new Plane( new Vector(0, 0, 128), new Vector(1,0,0), new Vector(0,-1,0), 256, 256, Colour.WHITE, Material.emissive ) )
	// Floor
	scene.push( new Plane( new Vector(0, 0, -128), new Vector(1,0,0), new Vector(0,1,0), 256, 256, Colour.WHITE, Material.matte ) )
	// Back wall
	scene.push( new Plane( new Vector(0, 128, 0), new Vector(1,0,0), new Vector(0,0,1), 256, 256, Colour.WHITE, Material.matte ) )
	// Left wall
	scene.push( new Plane( new Vector(-128, 0, 0), new Vector(0,1,0), new Vector(0,0,1), 256, 256, Colour.RED, Material.matte ) )
	// Right wall
	scene.push( new Plane( new Vector(128, 0, 0), new Vector(0,-1,0), new Vector(0,0,1), 256, 256, Colour.GREEN, Material.matte ) )
	
	scene.push( new Sphere( new Vector(0, 0, -100), 50, Colour.WHITE, Material.matte ) )
	
	return scene
}