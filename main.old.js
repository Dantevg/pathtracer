const mouse = new Vector( 0, 0 )
const keys = {}
const flags = {
	drawObjectFills: false,
	drawObjectBorders: true,
	drawRays: true,
	drawRayHits: false,
	drawNormals: false,
	nBounces: 0,
	nRays: 10,
	fov: 60,
	blockScale: 50,
	selected: Material.emissive,
	selectedRandomColour: false,
	reflectiveInside: true,
}

console.log("Keybindings:")
console.log("<-/->: Rotate ray")
console.log("^/v:   Increase/decrease # bounces")
console.log("n:     Toggle normals")
console.log("f:     Toggle object fill")
console.log("l:     Toggle object lines")
console.log("r:     Toggle rays")
console.log("h:     Toggle ray hits")

function main(){
	const previewCanvasElement = document.getElementById("preview")
	previewCanvasElement.width = window.innerWidth
	previewCanvasElement.height = window.innerHeight-300
	const cameraCanvasElement = document.getElementById("camera")
	cameraCanvasElement.width = window.innerWidth
	cameraCanvasElement.height = 300
	
	previewOffsetX = previewCanvasElement.width/2
	previewOffsetY = 200
	
	// Set event listeners
	previewCanvasElement.addEventListener( "mousemove", e => mouse.set( e.x-previewOffsetX, previewOffsetY-e.y ) )
	document.addEventListener( "keydown", e => {
		keys[e.key] = true
		if( e.shiftKey ){
			if( e.key == "R" ){
				flags.selected = Material.matte
			}else if( e.key == "T" ){
				flags.selected = Material.transparent
			}else if( e.key == "E" ){
				flags.selected = Material.emissive
			}
		}else{
			if( e.key == "n" ){
				flags.drawNormals = !flags.drawNormals
				pathtracer.init()
			}else if( e.key == "f" ){
				flags.drawObjectFills = !flags.drawObjectFills
				pathtracer.init()
			}else if( e.key == "l" ){
				flags.drawObjectBorders = !flags.drawObjectBorders
				pathtracer.init()
			}else if( e.key == "r" ){
				flags.drawRays = !flags.drawRays
				pathtracer.init()
			}else if( e.key == "h" ){
				flags.drawRayHits = !flags.drawRayHits
				pathtracer.init()
			}else if( e.key == "c" ){
				flags.selectedRandomColour = !flags.selectedRandomColour
			}else if( e.key == "ArrowUp" ){
				flags.nBounces++
				pathtracer.init()
				camera.init()
			}else if( e.key == "ArrowDown" ){
				flags.nBounces = Math.max( --flags.nBounces, 0 )
				pathtracer.init()
				camera.init()
			}
		}
	} )
	document.addEventListener( "keyup", e => keys[e.key] = false )
	document.addEventListener( "mousedown", e => keys.mouse = true )
	document.addEventListener( "mouseup", e => keys.mouse = false )
	// document.addEventListener( "mousedown", e => {
	// 	const x = Math.floor( e.x / flags.blockScale ) * flags.blockScale
	// 	const y = Math.floor( e.y / flags.blockScale ) * flags.blockScale
	// 	if( e.button == 0 ){ // Primary button, add block
	// 		const colour = flags.selectedRandomColour ? Colour.random() : Colour.WHITE
	// 		scene.push( new Rect( x, y, flags.blockScale, flags.blockScale, colour, flags.selected ) )
	// 	}else{ // Secondary button, remove block
	// 		for( const block in scene ){
	// 			if( scene[block].x == x && scene[block].y == y ){
	// 				scene.splice( block, 1 )
	// 			}
	// 		}
	// 	}
	// 	pathtracer.init()
	// } )
	
	// Build scene
	scene = createScene( previewCanvasElement )
	
	// camera = new Camera( 200, 200, 0, 1000, 25 )
	camera = new Camera3D( new Vector(0, 0, 0), new Vector(1,0,0), new Vector(0,0,-1), 20, 20, 100, 100, 1 )
	scene.push(camera)
	
	const pathtracer = new Pathtracer( previewCanvasElement, cameraCanvasElement, scene )
	
	// Start draw loop
	pathtracer.draw()
}

// Fix JavaScript's modulo function
// Now (-5) % 7 gives 3 instead of -5
// Source: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod( n, m ){
	return ((n % m) + m) % m
}