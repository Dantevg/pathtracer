import Vector from "./lib/Vector.js"

export default class Scene {
	constructor(ox = 0, oy = 0){
		this.objects = []
		this.ox = ox
		this.oy = oy
	}
	
	preview(canvas, flags){
		canvas.save()
		canvas.translate(this.ox, this.oy)
		canvas.scale(1, -1)
		for( const object of this.objects ){
			object.draw(canvas, flags)
		}
		canvas.restore()
	}
	
	static async load(src){
		return (await import(src)).default()
	}
	
	static parseOBJ(obj, scale = 1, offset = new Vector(0, 0, 0)){
		const vertices = (obj.match(/^v(\s+-?\d+(\.\d+)?){3}$/gm) ?? [])
			.map( vertex => new Vector( ...vertex.split(" ").map(x => Number(x)*scale).slice(1) ).add(offset) )
		vertices.unshift(0) // Add an element to the start, because vertex indices start at 1
		
		const faces = (obj.match(/^f(\s+[\d+\/?]+){3}$/gm) ?? [])
			.map( face => face.split(" ").map(x => Number(x.split("/")[0])).slice(1) )
		
		return [vertices, faces]
	}
	
}