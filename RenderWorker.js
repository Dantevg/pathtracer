import Scene from "./Scene.js"

const console = {
	log: (...data) => postMessage({type: "log", data: [...data]})
}

let scene
let iterations = 0

onmessage = function(e){
	if(e.data.type == "init"){
		// Load the specified scene
		Scene.load(e.data.src).then(module => {
			scene = module
			postMessage({type: "ready"})
		})
	}else if(e.data.type == "render"){
		// Start tracing
		scene.camera.init(e.data.width, e.data.height, e.data.sx, e.data.sy, e.data.sw, e.data.sh)
		for( let i = 0; i < e.data.batchSize; i++ ){
			scene.camera.trace(e.data.nBounces ?? 0)
			iterations++
		}
		postMessage({
			type: "result",
			data: scene.camera.buffer,
			iterations: iterations,
		})
	}
}