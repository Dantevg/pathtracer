import Vector from "../lib/Vector.js"
import Colour from "../lib/Colour.js"
import Scene from "../Scene.js"
import Camera from "../Camera.js"
import Material from "../Material.js"
import Sphere from "../shapes/Sphere.js"
import Plane from "../shapes/Plane.js"
import Triangle from "../shapes/Triangle.js"

const scene = new Scene()

// Floor
scene.objects.push( new Plane( new Vector(0, 0, -128), new Vector(1,0,0), new Vector(0,1,0), 256, 256, Colour.WHITE, Material.matte ) )

// Sphere
scene.objects.push( new Sphere( new Vector(0, 256, 0), 50, Colour.WHITE, Material.emissive ) )

// Camera
scene.camera = new Camera( new Vector(0, -350, 0), new Vector(1,0,0), new Vector(0,0,-1), 20, 20, 1 )
scene.camera.scene = scene

export default scene