import { AmbientLight, DirectionalLight } from "three"

export function createAmbientLight(){
    const ambientLight = new AmbientLight(0xffffff, 1)

    return ambientLight
}
export function createDirectionalLight(){
    const directionalLight = new DirectionalLight(0xffffff,2)

    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024,1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0, 5, 0)

    return directionalLight
}