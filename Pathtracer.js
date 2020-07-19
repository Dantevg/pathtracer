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
		for( let x = 0; x < this.width; x++ ){
			this.buffer[x] = []
			for( let y = 0; y < this.height; y++ ){
				this.buffer[x][y] = Colour.BLACK
			}
		}
	}
	
	// Issues all workers to render
	render(result, all, nBounces = 0){
		for( const worker of this.workers ){
			// Initialize worker callback
			worker.onmessage = function(e){
				if( e.data.type == "result" ){
					console.log("Render result")
					this.running--
					this.iterations++
					this.result(e.data.data)
					result()
					if(this.running == 0){
						all()
					}
				}else if(e.data.type == "log"){
					console.log("[Worker]", ...e.data.data)
				}
			}.bind(this)
			
			worker.postMessage({
				type: "render",
				nBounces: nBounces,
			})
			
			this.running++
		}
	}
	
	// Called when RenderWorker finishes render cycle,
	// Adds data with pre-existing data
	result(buffer){
		for( let x = 0; x < Math.min(buffer.length, this.buffer.length); x++ ){
			for( let y = 0; y < Math.min(buffer[x].length, this.buffer.length); y++ ){
				this.buffer[x][y].add( new Colour(...buffer[x][y].items) )
			}
		}
	}
	
	// Draws buffer to canvas
	draw(canvas, scale){
		Canvas.draw(
			this.buffer, canvas, this.width, this.height, 1,
			(pixel) => Colour.multiply( pixel, new Colour(1/this.iterations) ).setAlpha(1).rgb255
		)
	}
	
}