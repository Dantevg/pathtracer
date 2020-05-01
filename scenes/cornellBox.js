function createScene( canvasElement ){
	const scene = []
	const [width, height] = [canvasElement.width, canvasElement.height-50]
	
	scene.push( new Line( width-200, 0, 200, 0, Colour.WHITE, Material.emissive ) ) // Top
	scene.push( new Line( 200, 0, 200, height, Colour.RED, Material.matte ) ) // Left
	scene.push( new Line( width-200, height, width-200, 0, Colour.BLUE, Material.matte ) ) // Right
	scene.push( new Line( 200, height, width-200, height, Colour.WHITE, Material.glossy ) ) // Bottom
	
	let x = Math.random() * (width-300) + 150
	let y = Math.random() * (height-300) + 150
	scene.push( new Circle( x, y, 50, Colour.WHITE, Material.matte ) )
	
	x = Math.random() * (width-300) + 150
	y = Math.random() * (height-300) + 150
	scene.push( new Circle( x, y, 50, Colour.WHITE, Material.transparent ) )
	
	return scene
}