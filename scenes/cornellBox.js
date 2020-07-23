import Vector from "../lib/Vector.js"
import Colour from "../lib/Colour.js"
import Scene from "../Scene.js"
import Camera from "../Camera.js"
import Material from "../Material.js"
import Sphere from "../shapes/Sphere.js"
import Plane from "../shapes/Plane.js"
import Triangle from "../shapes/Triangle.js"
import Cube from "../shapes/Cube.js"
import TriangleMesh from "../shapes/TriangleMesh.js"

const scene = new Scene()

// Ceiling
scene.objects.push( new Plane( new Vector(0, 0, 128), new Vector(1,0,0), new Vector(0,-1,0), 256, 256, Colour.WHITE, Material.emissive ) )
// Floor
scene.objects.push( new Plane( new Vector(0, 0, -128), new Vector(1,0,0), new Vector(0,1,0), 256, 256, Colour.WHITE, Material.matte ) )
// Back wall
scene.objects.push( new Plane( new Vector(0, 128, 0), new Vector(1,0,0), new Vector(0,0,1), 256, 256, Colour.WHITE, Material.matte ) )
// Front wall
scene.objects.push( new Plane( new Vector(0, -128, 0), new Vector(-1,0,0), new Vector(0,0,1), 256, 256, Colour.WHITE, Material.matte ) )
// Left wall
scene.objects.push( new Plane( new Vector(-128, 0, 0), new Vector(0,1,0), new Vector(0,0,1), 256, 256, Colour.RED, Material.matte ) )
// Right wall
scene.objects.push( new Plane( new Vector(128, 0, 0), new Vector(0,-1,0), new Vector(0,0,1), 256, 256, Colour.GREEN, Material.matte ) )

// Spheres
scene.objects.push( new Sphere( new Vector(0, 0, -50), 50, Colour.WHITE, Material.matte ) )
scene.objects.push( new Sphere( new Vector(-75, -75, 50), 25, Colour.WHITE, Material.matte ) )
scene.objects.push( new Sphere( new Vector(75, 75, 50), 25, Colour.WHITE, Material.matte ) )

// Triangle
// scene.objects.push( new Triangle( new Vector(-100, -100, -100), new Vector(100, 100, -100), new Vector(-100, 100, -100), Colour.WHITE, Material.matte ) )

// Cube
// scene.objects.push( new Cube( new Vector(0, 0, -50), new Vector(1, 0, 0), new Vector(0, 1, 1), 100, Colour.YELLOW, Material.matte ) )

// Triangle mesh
// scene.objects.push( new TriangleMesh(
// 	[new Vector(-100, -100, -100), new Vector(100, -100, -100), new Vector(-100, 100, -100), new Vector(100, 100, -100),
// 	new Vector(-100, -100, 100), new Vector(100, -100, 100), new Vector(-100, 100, 100), new Vector(100, 100, 100)],
// 	[[0, 1, 2], [1, 3, 2]],
// 	Colour.YELLOW, Material.matte
// ) )

// Camera
scene.camera = new Camera( new Vector(0, -350, 0), new Vector(1,0,0), new Vector(0,0,-1), 20, 20, 1 )
scene.camera.scene = scene

export default async () => scene