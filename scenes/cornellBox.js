function createScene( canvasElement ){
	function randomX(){
		return x1 + r/2 + Math.random() * (x2-x1-r)
	}
	function randomY(){
		return y1 + r/2 + Math.random() * (y2-y1-r)
	}
	
	const scene = []
	const [x1, y1, x2, y2] = [200, 0, canvasElement.width-200, canvasElement.height-50]
	const r = 50
	
	scene.push( new Line( x2, y1, x1, y1, Colour.WHITE, Material.emissive ) ) // Top
	scene.push( new Line( x1, y1, x1, y2, Colour.RED, Material.matte ) ) // Left
	scene.push( new Line( x2, y2, x2, y1, Colour.BLUE, Material.matte ) ) // Right
	scene.push( new Line( x1, y2, x2, y2, Colour.WHITE, Material.glossy ) ) // Bottom
	
	scene.push( new Circle( randomX(), randomY(), r, Colour.WHITE, Material.matte ) )
	scene.push( new Circle( randomX(), randomY(), r, Colour.WHITE, Material.transparent ) )
	scene.push( new Polygon( randomX(), randomY(), r, 3, Math.PI/6, Colour.WHITE, Material.transparent ) )
	
	return scene
}