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
	
	scene.push( new Sphere( new Vector(500, 300, 0), 50, Colour.WHITE, Material.matte ) )
	scene.push( new Plane( new Vector(500, 100, 0), new Vector(1,0,0), new Vector(0,0,1), 100, 100, Colour.WHITE, Material.matte ) )
	scene.push( new Sphere( new Vector(500, 500, 0), 50, Colour.WHITE, Material.emissive ) )
	
	return scene
}