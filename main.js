import Pathtracer from "./Pathtracer.js"
import scene from "./scenes/cornellBox.js"

// Constants and settings
const width = 300
const height = 300

const flags = {
	drawObjectFills: false,
	drawObjectBorders: true,
	drawRays: true,
	drawRayHits: false,
	drawNormals: false,
	nBounces: 2,
	fov: 60,
}

// Fix JavaScript's modulo function
// Now (-5) % 7 gives 3 instead of -5
// Source: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, m){
	return ((n % m) + m) % m
}

function drawFlags(canvas){
	canvas.fillStyle = "#000000"
	canvas.fillRect(0, 0, 180, 190)
	canvas.font = "10px monospace"
	canvas.fillStyle = "#FFFFFF"
	// canvas.fillText(Math.round(this.fps), 10, 15)
	let i = 2
	for( const flag in flags ){
		if(typeof flags[flag] == "object"){
			continue
		}
		canvas.fillStyle = "#FFFFFF"
		if(typeof flags[flag] == "boolean"){
			canvas.fillStyle = flags[flag] ? "#44FF44" : "#FF4444"
		}
		canvas.fillText(flag+": "+flags[flag], 10, 15*i)
		i++
	}
}

// Initialize
console.log("Loading")

const previewElement = document.getElementById("preview")
previewElement.width = window.innerWidth
previewElement.height = window.innerHeight-height
const previewCanvas = previewElement.getContext("2d")

const renderElement = document.getElementById("render")
renderElement.width = width
renderElement.height = height
const renderCanvas = renderElement.getContext("2d")

const pathtracer = new Pathtracer(scene, width, height, 4)

scene.ox = previewElement.width/2
scene.oy = 200

// Draw preview
previewCanvas.fillStyle = "#000000"
previewCanvas.fillRect(0, 0, previewElement.width, previewElement.height)
scene.preview(previewCanvas, flags)

drawFlags(previewCanvas)

function render(){
	pathtracer.render(() => pathtracer.draw(renderCanvas, 1), () => requestAnimationFrame(render), flags.nBounces)
}

render()