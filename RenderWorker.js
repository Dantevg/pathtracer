import scene from "./scenes/cornellBox.js"

const console = {
	log: (...data) => postMessage({type: "log", data: [...data]})
}

let iterations = 0

onmessage = function(e){
	if(e.data.type == "render"){
		scene.camera.init(e.data.width, e.data.height, e.data.sx, e.data.sy, e.data.sw, e.data.sh)
		scene.camera.trace(e.data.nBounces ?? 0)
		iterations++
		postMessage({
			type: "result",
			data: scene.camera.buffer,
			iterations: iterations,
		})
	}
}