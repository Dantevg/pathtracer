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
scene.objects.push( new Plane( new Vector(0, 0, -128), new Vector(1,0,0), new Vector(0,1,0), 512, 1024, Colour.WHITE, Material.transparent ) )

// Sphere
scene.objects.push( new Sphere( new Vector(0, 0, -256), 64, Colour.WHITE, Material.matte ) )
scene.objects.push( new Sphere( new Vector(0, -128, -256), 64, Colour.WHITE, Material.matte ) )
scene.objects.push( new Sphere( new Vector(0, -256, -256), 64, Colour.YELLOW, Material.matte ) )
scene.objects.push( new Plane( new Vector(128, 512, 128), new Vector(1,0,0), new Vector(0,0,1), 256, 512, Colour.WHITE, Material.emissive ) )

// Camera
scene.camera = new Camera( new Vector(0, -512, 0), new Vector(1,0,0), new Vector(0,0,-1), 20, 20, 1 )
scene.camera.scene = scene

export default async () => scene