function createScene( canvasElement ){
	function randomX(){
		return x1 + r/2 + Math.random() * (x2-x1-r)
	}
	function randomY(){
		return y1 + r/2 + Math.random() * (y2-y1-r)
	}
	function randomZ(){
		return z1 + r/2 + Math.random() * (z2-z1-r)
	}
	
	const scene = []
	const [x1, y1, z1, x2, y2, z2] = [200, 0, 0, canvasElement.width-200, canvasElement.height-50, 500]
	const r = 50
	
	// Ceiling
	scene.push( new Plane( new Vector(128, 128, 0), new Vector(1,0,0), new Vector(0,1,0), 256, 256, Colour.WHITE, Material.emissive ) )
	// Floor
	scene.push( new Plane( new Vector(128, 128, 256), new Vector(1,0,0), new Vector(0,-1,0), 256, 256, Colour.WHITE, Material.matte ) )
	// Back wall
	scene.push( new Plane( new Vector(128, 0, 128), new Vector(1,0,0), new Vector(0,0,1), 256, 256, Colour.WHITE, Material.matte ) )
	// Left wall
	scene.push( new Plane( new Vector(0, 128, 128), new Vector(0,1,0), new Vector(0,0,1), 256, 256, Colour.RED, Material.matte ) )
	// Right wall
	scene.push( new Plane( new Vector(256, 128, 128), new Vector(0,-1,0), new Vector(0,0,1), 256, 256, Colour.GREEN, Material.matte ) )
	
	scene.push( new Sphere( new Vector(128, 128, 200), 50, Colour.WHITE, Material.matte ) )
	
	return scene
}