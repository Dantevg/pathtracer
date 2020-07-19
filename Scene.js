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
	
}