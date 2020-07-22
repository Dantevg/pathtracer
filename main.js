import Pathtracer from "./Pathtracer.js"
import Scene from "./Scene.js"

const sceneSrc = "./scenes/obj.js"

// Constants and settings
const width = 300
const height = 300

const flags = {
	drawObjectFills: false,
	drawObjectBorders: true,
	drawRays: true,
	drawRayHits: false,
	drawNormals: false,
	fov: 60,
	nBounces: 2,
	nIterations: 8,
	batchSize: 1,
	nWorkers: 8,
}

let startTime = performance.now()
let endTime = performance.now()

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
	canvas.fillText(Math.round(pathtracer.iterations / (endTime - startTime) * 10000)/10, 10, 15)
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

function init(scene){
	scene.ox = previewElement.width/2
	scene.oy = 200

	draw(scene)
}

function draw(scene){
	if(pathtracer.running > 0){
		endTime = performance.now()
	}
	
	previewCanvas.fillStyle = "#000000"
	previewCanvas.fillRect(0, 0, previewElement.width, previewElement.height)
	scene.preview(previewCanvas, flags)
	drawFlags(previewCanvas)
	
	requestAnimationFrame(() => draw(scene))
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

const pathtracer = new Pathtracer(sceneSrc, 200, 200, flags.nWorkers)

Scene.load(sceneSrc).then(scene => {
	scene.ox = previewElement.width/2
	scene.oy = 200
	
	draw(scene)
})

pathtracer.render(renderCanvas, {
	scale: 1,
	nBounces: flags.nBounces,
	nIterations: flags.nIterations,
	batchSize: flags.batchSize,
})

// Update time points
startTime = performance.now()
endTime = performance.now()