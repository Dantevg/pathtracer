import scene from "./scenes/cornellBox.js"

const console = {
	log: (...data) => postMessage({type: "log", data: [...data]})
}

onmessage = function(e){
	if(e.data.type == "render"){
		scene.camera.init()
		scene.camera.trace(e.data.nBounces ?? 0)
		postMessage({
			type: "result",
			data: scene.camera.buffer,
		})
	}
}