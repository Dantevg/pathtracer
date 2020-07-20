export default class Canvas {
	static draw(buffer, canvas, map = (pixel) => pixel, scale = 1, sx = 0, sy = 0, sw = buffer.length, sh = buffer[0].length){
		const image = canvas.getImageData( sx, sy, buffer.length*scale, buffer[0].length*scale )
		
		for( let x = sx; x < Math.min(buffer.length, sx+sw); x++ ){
			for( let y = sy; y < Math.min(buffer[x].length, sy+sh); y++ ){
				
				const pixel = map(buffer[x][y])
				for( let ox = 0; ox < scale; ox++ ){
					for( let oy = 0; oy < scale; oy++ ){
						Canvas.setImagePixel(image, (x*scale)+ox-sx, (y*scale)+oy-sy, pixel)
					}
				}
				
			}
		}
		
		canvas.putImageData(image, sx, sy)
	}
	
	static getImagePixel(image, x, y, offset){
		if(offset){
			return image.data[ (x + y*image.width)*4 + offset ]
		}else{
			return [
				getImagePixel(image, x, y, 0),
				getImagePixel(image, x, y, 1),
				getImagePixel(image, x, y, 2),
				getImagePixel(image, x, y, 3),
			]
		}
	}
	
	static setImagePixel(image, x, y, colour){
		image.data[ (x + y*image.width)*4 + 0 ] = colour[0]
		image.data[ (x + y*image.width)*4 + 1 ] = colour[1]
		image.data[ (x + y*image.width)*4 + 2 ] = colour[2]
		image.data[ (x + y*image.width)*4 + 3 ] = colour[3]
	}
	
}