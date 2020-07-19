export default class Canvas {
	static draw(buffer, canvas, sx, sy, width, height, scale = 1, map = (pixel) => pixel){
		const image = canvas.getImageData( sx*scale, sy*scale, width*scale, height*scale )
		
		for( let x = sx; x < sx+width; x++ ){
			for( let y = sy; y < sy+height; y++ ){
				
				const pixel = map(buffer[x][y])
				for( let ox = 0; ox < scale; ox++ ){
					for( let oy = 0; oy < scale; oy++ ){
						Canvas.setImagePixel(image, (x*scale)+ox, (y*scale)+oy, pixel)
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