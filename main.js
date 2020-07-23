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
	nIterations: 16,
	batchSize: 1,
	nWorkers: 4,
}

let pathtracer

// Fix JavaScript's modulo function
// Now (-5) % 7 gives 3 instead of -5
// Source: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, m){
	return ((n % m) + m) % m
}

function createUI(){
	const options = document.querySelector("#options")
	for( const name in flags ){
		const row = options.insertRow()
		const label = document.createElement("label")
		label.for = "options-"+name
		label.innerText = name
		row.insertCell().appendChild(label)
		
		if(typeof flags[name] == "boolean"){
			const option = document.createElement("input")
			option.type = "checkbox"
			option.id = "options-"+name
			option.name = "options-"+name
			option.checked = flags[name]
			option.onchange = (event) => flags[name] = event.target.checked
			row.insertCell().appendChild(option)
		}else if(typeof flags[name] == "number"){
			const option = document.createElement("input")
			option.type = "number"
			option.id = "options-"+name
			option.name = "options-"+name
			option.value = flags[name]
			option.onchange = (event) => flags[name] = Number(event.target.value)
			row.insertCell().appendChild(option)
		}
	}
	
	const buttons = document.querySelector("#buttons")
	const button = document.createElement("button")
	button.innerText = "Retrace"
	button.onclick = function(event){
		pathtracer.rendering = false
		init()
	}
	buttons.appendChild(button)
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

function init(){
	console.log("Loading")
	pathtracer = new Pathtracer(sceneSrc, width, height, flags.nWorkers)
	pathtracer.render(renderCanvas, {
		scale: 1,
		nBounces: flags.nBounces,
		nIterations: flags.nIterations,
		batchSize: flags.batchSize,
	})
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
const previewElement = document.getElementById("preview")
previewElement.width = window.innerWidth
previewElement.height = window.innerHeight-height
const previewCanvas = previewElement.getContext("2d")

const renderElement = document.getElementById("render")
renderElement.width = width
renderElement.height = height
const renderCanvas = renderElement.getContext("2d")

init()
createUI()

Scene.load(sceneSrc).then(scene => {
	scene.ox = previewElement.width/2
	scene.oy = 200
	
	draw(scene)
})

// Update time points
let startTime = performance.now()
let endTime = performance.now()