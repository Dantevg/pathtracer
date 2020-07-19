import Vector from "../lib/Vector.js"
import Colour from "../lib/Colour.js"
import Scene from "../Scene.js"
import Camera from "../Camera.js"
import Material from "../Material.js"
import Sphere from "../shapes/Sphere.js"
import Plane from "../shapes/Plane.js"

const scene = new Scene()

// Ceiling
scene.objects.push( new Plane( new Vector(0, 0, 128), new Vector(1,0,0), new Vector(0,-1,0), 256, 256, Colour.WHITE, Material.emissive ) )
// Floor
scene.objects.push( new Plane( new Vector(0, 0, -128), new Vector(1,0,0), new Vector(0,1,0), 256, 256, Colour.WHITE, Material.matte ) )
// Back wall
scene.objects.push( new Plane( new Vector(0, 128, 0), new Vector(1,0,0), new Vector(0,0,1), 256, 256, Colour.WHITE, Material.matte ) )
// Left wall
scene.objects.push( new Plane( new Vector(-128, 0, 0), new Vector(0,1,0), new Vector(0,0,1), 256, 256, Colour.RED, Material.matte ) )
// Right wall
scene.objects.push( new Plane( new Vector(128, 0, 0), new Vector(0,-1,0), new Vector(0,0,1), 256, 256, Colour.GREEN, Material.matte ) )

scene.objects.push( new Sphere( new Vector(0, 0, -100), 50, Colour.WHITE, Material.matte ) )

scene.camera = new Camera( new Vector(0, -256, 0), new Vector(1,0,0), new Vector(0,0,-1), 20, 20, 1 )
scene.camera.scene = scene

export default scene