import Vector from "../lib/Vector.js"
import Colour from "../lib/Colour.js"
import Scene from "../Scene.js"
import Camera from "../Camera.js"
import Material from "../Material.js"
import TriangleMesh from "../shapes/TriangleMesh.js"
import Plane from "../shapes/Plane.js"

const scene = new Scene()
const promises = []

// Camera
scene.camera = new Camera( new Vector(0, -350, 0), new Vector(1,0,0), new Vector(0,0,-1), 20, 20, 1 )
scene.camera.scene = scene

// Light
scene.objects.push( new Plane(new Vector(0, 0, 500), new Vector(1, 0, 0), new Vector(0, 11, 0), 1000, 1000, Colour.WHITE, Material.emissive) )

promises.push(fetch("./scenes/cube.obj")
	.then(response => response.text())
	.then(data => {
		const [vertices, faces] = Scene.parseOBJ(data, 50, new Vector(0, 100, 0))
		scene.objects.push(new TriangleMesh(vertices, faces, Colour.MAGENTA, Material.matte))
	}))

export default async function(){
	await Promise.all(promises)
	return scene
}