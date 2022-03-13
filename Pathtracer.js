import Colour from "./lib/Colour.js"
import Canvas from "./lib/Canvas.js"

export default class Pathtracer {
	constructor(sceneSrc, width, height, nWorkers = 1, obj){
		this.width = width
		this.height = height
		
		// Create workers
		this.workers = []
		for( let i = 0; i < nWorkers; i++ ){
			this.workers.push( new Worker("./RenderWorker.js", {type: "module"}) )
			this.workers[i].postMessage({
				type: "init",
				src: sceneSrc,
				obj: obj,
			})
		}
		
		this.running = 0 // The number of workers currently working
		this.iterations = 0 // The number of finished iterations
		
		this.buffer = []
		for( let x = 0; x < this.width+10; x++ ){
			this.buffer[x] = []
			for( let y = 0; y < this.height+10; y++ ){
				this.buffer[x][y] = Colour.BLACK
			}
		}
	}
	
	displayProgress(nIterations){
		let str = this.iterations+" i"
		if(nIterations){
			str += " - "+Math.floor(this.iterations / nIterations / this.workers.length * 100)+"%"
		}
		document.title = "Path tracing " + str
	}
	
	startWorker(worker, nBounces, batchSize, sx, sy, sw, sh){
		worker.postMessage({
			type: "render",
			nBounces: nBounces,
			batchSize: batchSize,
			width: this.width,
			height: this.height,
			sx: sx,
			sy: sy,
			sw: sw,
			sh: sh,
		})
	}
	
	render(canvas, {scale, nBounces = 0, nIterations, batchSize = 1, onlyFinal}){
		const rows = Pathtracer.findTiling(this.workers.length)
		const w = Math.floor(this.width / this.workers.length * rows)
		const h = Math.floor(this.height / rows)
		for( let i = 0; i < this.workers.length; i++ ){
			const worker = this.workers[i]
			// Initialize worker callback
			worker.onmessage = function(e){
				if(e.data.type == "ready"){
					// Worker is done loading scene, start it
					console.log("Starting worker")
					this.startWorker(worker, nBounces, batchSize, w*Math.floor(i/rows), h*(i%rows), w, h)
				}else if(e.data.type == "result"){
					// Worker is done tracing, restart if limit not reached
					console.log("Render result")
					this.iterations++
					this.displayProgress(nIterations)
					
					// Restart worker if limit not reached, or if no limit set
					if(!nIterations || e.data.iterations < nIterations){
						this.startWorker(worker, nBounces, batchSize, w*Math.floor(i/rows), h*(i%rows), w, h)
					}else{
						this.running--
					}
					
					// Add the data to the buffer
					this.result(e.data.data, w*Math.floor(i/rows), h*(i%rows))
					
					// Draw the buffer to the canvas
					if(onlyFinal && this.running == 0){
						this.draw(canvas, scale, this.iterations/this.workers.length) // Do a full draw
					}else if(!onlyFinal){
						this.draw(canvas, scale, e.data.iterations, w*Math.floor(i/rows), h*(i%rows), w, h)
					}
				}else if(e.data.type == "log"){
					// Worker sent a message, log it
					console.log(`[Worker ${i}]`, ...e.data.data)
				}else if(e.data.type == "import not supported"){
					document.getElementById("webworker-import-not-supported").style.display = "block"
					this.stop()
				}
			}.bind(this) // Make sure I can use 'this'
			
			this.running++
		}
	}
	
	// Discards the worker's results
	stop(){
		for( const worker of this.workers ){
			worker.terminate()
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
	draw(canvas, scale, iterations = 1, sx = 0, sy = 0, sw = this.width, sh = this.height){
		const weight = new Colour(1/iterations)
		Canvas.draw(
			this.buffer, canvas,
			(pixel) => Colour.multiply( pixel, weight ).rgb255,
			scale, sx, sy, sw, sh
		)
	}
	
	static findTiling(n){
		let rows = Math.floor( Math.sqrt(n) )
		while( (n/rows) % 1 != 0 && rows > 1 ){
			rows--
		}
		return rows
	}
	
}
