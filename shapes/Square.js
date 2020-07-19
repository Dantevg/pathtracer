import Rect from "./Rect.js"

export default class Square extends Rect {
	constructor(x, y, size, colour, material){
		super(x, y, size, size, colour, material)
	}
	
}