import { WebGLRenderer, PCFShadowMap } from "three";

export function createRenderer(canvas : HTMLCanvasElement) {
	const renderer =  new WebGLRenderer({ 
    antialias: true,
    canvas, 
    alpha: true
  })
		
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = PCFShadowMap
	
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
	renderer.setPixelRatio(window.devicePixelRatio)

	return renderer
}