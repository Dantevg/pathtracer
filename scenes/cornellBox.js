function createScene( canvasElement ){
	const scene = []
	const material = new Material({roughness: 1})
	const [width, height] = [canvasElement.width, canvasElement.height-50]
	
	scene.push( new Line( 200, 0, width-200, 0, Colour.WHITE, Material.emissive ) ) // Top
	scene.push( new Line( 200, 0, 200, height, Colour.RED, material ) ) // Left
	scene.push( new Line( width-200, 0, width-200, height, Colour.BLUE, material ) ) // Right
	scene.push( new Line( 200, height, width-200, height, Colour.WHITE, material ) ) // Bottom
	
	const x = Math.random() * (width-300) + 150
	const y = Math.random() * (height-300) + 150
	scene.push( new Circle( x, y, 50, Colour.WHITE, material ) )
	
	return scene
}