import { BoxGeometry, DoubleSide, InstancedMesh, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, BufferGeometry, Vector3 } from "three";

import { createScene } from "../core/scene.ts";
import { createCamera } from '../core/camera.ts';
import { createRenderer } from '../core/renderer.ts';
import { createOrbitControls } from '../core/orbit-controls.ts';
import { createAmbientLight, createDirectionalLight } from "../core/lights.ts";
import { createCanvas, isCollition, resizeRendererAndCamera } from "../utils.ts";

export function elementsInstances(){

    const article = {
      title: '',
      description: '',
    }
    
    const canvas = createCanvas(article)

    const scene = createScene()
    const camera = createCamera()
    const renderer = createRenderer(canvas)
    const controls = createOrbitControls(camera, renderer)
    const directionalLight = createDirectionalLight()
    const ambientLight =  createAmbientLight()
    // controls.enableZoom =  

    camera.position.set(10,20,10)
    controls.target.set(0,0,0)
    controls.autoRotate = true
    
    scene.add(directionalLight)
    scene.add(ambientLight)

    const boxSize = 2
    const cubeGeometry = new BoxGeometry(boxSize, boxSize, boxSize)
    const cubeMaterial = new MeshStandardMaterial({color: 0x00ff00, wireframe: false})

    const sizePlane = 30
    const plane = new Mesh(
      new PlaneGeometry(sizePlane, sizePlane),
      new MeshBasicMaterial({
        color: 0x858585,
        side: DoubleSide
      })
    ).rotateX(Math.PI / 180 * -90)
    
    const gridSize = 3
    const spacing = 2 // Espaciado entre cubos

    // Crear el InstancedMesh
    const count = gridSize * gridSize // Total de cubos
    const mesh = new InstancedMesh(cubeGeometry, cubeMaterial, count)
    scene.add(mesh)

    const y = 1
    const dummy = new Object3D()

    // Arreglo para almacenar las posiciones iniciales y direcciones de movimiento
    const positions: { x: number, z: number, dx: number, dz: number }[] = []
    let index = 0
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing
        const z = (j - gridSize / 2) * spacing

        dummy.position.set(x, y, z)
        dummy.updateMatrix()

        mesh.setMatrixAt(index, dummy.matrix)

        // Inicializar posiciones y direcciones aleatorias
        const dx = Math.random() * 0.2 // velocidad en X
        const dz = Math.random() * 0.2 // velocidad en Z
        positions.push({ x, z, dx, dz })

        index++
      }
    }

    scene.add(plane)

    // Crear líneas entre las posiciones de los cubos
    const lines: Line[] = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const lineGeometry = new BufferGeometry().setFromPoints([new Vector3(positions[i].x, y, positions[i].z), new Vector3(positions[j].x, y, positions[j].z)])
        const line = new Line(lineGeometry, new LineBasicMaterial({ color: 0xff0000 }))
        lines.push(line)
        scene.add(line)
      }
    }

    function updatePosition() {
      positions.forEach((pos, i) => {
        // Actualizar la posición
        pos.x += pos.dx
        pos.z += pos.dz

        // Verificar límites y revertir dirección si se sale del plano
        if (pos.x > sizePlane / 2 || pos.x < -sizePlane / 2) pos.dx *= -1
        if (pos.z > sizePlane / 2 || pos.z < -sizePlane / 2) pos.dz *= -1

        // Actualizar la posición de la instancia
        dummy.position.set(pos.x, y, pos.z)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })

      mesh.instanceMatrix.needsUpdate = true
    }

    function updateLines() {
      let lineIndex = 0
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const line = lines[lineIndex]
          const points = [new Vector3(positions[i].x, y, positions[i].z), new Vector3(positions[j].x, y, positions[j].z)]
          line.geometry.setFromPoints(points)
          lineIndex++
        }
      }
    }

    function detectCollisions() {
      const div = document.querySelector('#mensaje') as HTMLDivElement;
      let colisionDetected = false;
  
      // Revisar colisiones entre todas las instancias
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const posA = new Vector3();
          const posB = new Vector3();
          
          // Obtener la posición de cada instancia
          mesh.getMatrixAt(i, dummy.matrix);
          dummy.position.setFromMatrixPosition(dummy.matrix);
          posA.copy(dummy.position);
          
          mesh.getMatrixAt(j, dummy.matrix);
          dummy.position.setFromMatrixPosition(dummy.matrix);
          posB.copy(dummy.position);
          
          // Comprobar si las posiciones están cerca
          if (isCollition(posA, posB, boxSize)) { 
            colisionDetected = true;
            break;
          }
        }
      }
  
      // Mostrar mensaje de colisión
      if (colisionDetected) {
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    }

    function animate() {
      detectCollisions()
      updatePosition()
      updateLines()

      resizeRendererAndCamera(renderer, camera)
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
      controls.update()
    }
      
    animate()
}
