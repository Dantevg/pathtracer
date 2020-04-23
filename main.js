const FPS = 100
const mouse = new Vector( 0, 0 )
const scene = []
const keys = {}
const flags = {
	drawObjectFills: false,
	drawObjectBorders: true,
	drawRays: true,
	drawRayHits: true,
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
	const canvasElement = document.getElementById("canvas")
	canvasElement.width = window.innerWidth
	canvasElement.height = window.innerHeight
	const raytracer = new Raytracer( canvasElement, scene )
	
	// Set event listeners
	canvasElement.addEventListener( "mousemove", e => mouse.set( e.x, e.y ) )
	document.addEventListener( "keydown", e => {
		keys[e.key] = true
		if( e.shiftKey ){
			if( e.key == "R" ){
				flags.selected = Material.glossy
			}else if( e.key == "T" ){
				flags.selected = Material.transmissive
			}else if( e.key == "E" ){
				flags.selected = Material.emissive
			}
		}else{
			if( e.key == "n" ){
				flags.drawNormals = !flags.drawNormals
				raytracer.init()
			}else if( e.key == "f" ){
				flags.drawObjectFills = !flags.drawObjectFills
				raytracer.init()
			}else if( e.key == "l" ){
				flags.drawObjectBorders = !flags.drawObjectBorders
				raytracer.init()
			}else if( e.key == "r" ){
				flags.drawRays = !flags.drawRays
				raytracer.init()
			}else if( e.key == "h" ){
				flags.drawRayHits = !flags.drawRayHits
				raytracer.init()
			}else if( e.key == "c" ){
				flags.selectedRandomColour = !flags.selectedRandomColour
			}else if( e.key == "ArrowUp" ){
				flags.nBounces++
				raytracer.init()
				camera.init()
			}else if( e.key == "ArrowDown" ){
				flags.nBounces = Math.max( --flags.nBounces, 0 )
				raytracer.init()
				camera.init()
			}
		}
	} )
	document.addEventListener( "keyup", e => keys[e.key] = false )
	document.addEventListener( "mousedown", e => {
		const x = Math.floor( e.x / flags.blockScale ) * flags.blockScale
		const y = Math.floor( e.y / flags.blockScale ) * flags.blockScale
		if( e.button == 0 ){ // Primary button, add block
			const colour = flags.selectedRandomColour ? Colour.random() : Colour.WHITE
			scene.push( new Rect( x, y, flags.blockScale, flags.blockScale, colour, flags.selected ) )
		}else{ // Secondary button, remove block
			for( const block in scene ){
				if( scene[block].x == x && scene[block].y == y ){
					scene.splice( block, 1 )
				}
			}
		}
		raytracer.init()
	} )
	
	// Build scene
	scene.push( new Rect( 0, 0, canvasElement.width, canvasElement.height-50, Colour.WHITE,
		Material.matte ) ) // Background
	
	const objects = []
	randomBlocks( objects, 25, false, Material.matte )
	randomBlocks( objects, 5, true, Material.matte )
	// randomBlocks( objects, 50, true, new Transmissive( 45, 1, 1 ) )
	// randomBlocks( objects, 1, false, new Emissive() )
	fillScene( canvasElement, scene, objects )
	
	camera = scene[ scene.push( new Camera( 200, 200, 0, 1000 ) ) - 1 ]
	
	// Start draw loop
	setInterval( raytracer.draw.bind(raytracer), 1/FPS*1000 )
}

// Fix JavaScript's modulo function
// Now (-5) % 7 gives 3 instead of -5
// Source: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod( n, m ){
	return ((n % m) + m) % m
}

function randomBlocks( objects, n, randomColour, material ){
	for( let i = 0; i < n; i++ ){
		const colour = randomColour ? Colour.random() : Colour.WHITE
		objects.push( {colour: colour, material: material} )
	}
}

function fillScene( canvasElement, scene, objects ){
	const min = objects.length
	const xMax = canvasElement.width/flags.blockScale
	const yMax = (canvasElement.height-50)/flags.blockScale
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