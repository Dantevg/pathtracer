import Colour from "./lib/Colour.js"
import Canvas from "./lib/Canvas.js"

export default class Pathtracer {
	constructor(scene, width, height, nWorkers = 1){
		this.scene = scene
		this.width = width
		this.height = height
		
		// Create workers
		this.workers = []
		for( let i = 0; i < nWorkers; i++ ){
			this.workers.push( new Worker("./RenderWorker.js", {type: "module"}) )
		}
		
		this.running = 0
		this.iterations = 0
		
		this.buffer = []
		for( let x = 0; x < this.width+10; x++ ){
			this.buffer[x] = []
			for( let y = 0; y < this.height+10; y++ ){
				this.buffer[x][y] = Colour.BLACK
			}
		}
	}
	
	startWorker(worker, nBounces, sx, sy, sw, sh){
		worker.postMessage({
			type: "render",
			nBounces: nBounces,
			width: this.width,
			height: this.height,
			sx: sx,
			sy: sy,
			sw: sw,
			sh: sh,
		})
	}
	
	// Issues all workers to render
	frame(result, all, nBounces = 0){
		for( let i = 0; i < this.workers.length; i++ ){
			const worker = this.workers[i]
			// Initialize worker callback
			worker.onmessage = function(e){
				if( e.data.type == "result" ){
					console.log("Render result")
					this.running--
					this.iterations++
					this.result(e.data.data, 0, 0)
					if(this.running == 0){
						all()
					}
					result()
				}else if(e.data.type == "log"){
					console.log("[Worker]", ...e.data.data)
				}
			}.bind(this)
			
			this.startWorker(worker, nBounces)
			
			this.running++
		}
	}
	
	render(canvas, scale, nBounces = 0){
		const w = this.width/this.workers.length
		for( let i = 0; i < this.workers.length; i++ ){
			const worker = this.workers[i]
			// Initialize worker callback
			worker.onmessage = function(e){
				if( e.data.type == "result" ){
					console.log("Render result")
					this.iterations++
					this.startWorker(worker, nBounces, w*i, 0, w)
					this.result(e.data.data, w*i, 0)
					this.draw(canvas, scale, w*i, 0, w)
				}else if(e.data.type == "log"){
					console.log("[Worker]", ...e.data.data)
				}
			}.bind(this)
			
			this.startWorker(worker, nBounces, w*i, 0, w)
			
			this.running++
		}
	}
	
	// Called when RenderWorker finishes render cycle,
	// Adds data with pre-existing data
	result(buffer, ox, oy){
		for( let x = 0; x < buffer.length; x++ ){
			for( let y = 0; y < buffer[x].length; y++ ){
				this.buffer[x+ox][y+oy].add( new Colour(...buffer[x][y].items) )
			}
		}
	}
	
	// Draws buffer to canvas
	draw(canvas, scale, sx = 0, sy = 0, sw = this.width, sh = this.height){
		Canvas.draw(
			this.buffer, canvas, sx, sy, sw, sh, scale,
			(pixel) => Colour.multiply( pixel, new Colour(1/this.iterations*this.workers.length) ).setAlpha(1).rgb255
		)
	}
	
}