import { LineSegments, LineBasicMaterial } from 'three'
import { BufferGeometryController } from './buffer-geometry-controller.js'

export class LinesController extends BufferGeometryController {
  constructor({ ...args } = {}) {
    super({
      attributeSizes: {
        // overwriting default for position
        position: [
          // number of values per vertex (3 for vec3)
          3,
          // number of vertices per item (start and end = 2)
          2,
        ],
      },
      ...args,
    })
  }

  createMaterial({ color = 'white', opacity = 0.2 }) {
    return new LineBasicMaterial({
      color,
      opacity,
      transparent: opacity < 1,
      depthWrite: opacity >= 1,
    })
  }

  createObject(geometry, material) {
    const object = new LineSegments(geometry, material)
    object.renderOrder = 10
    return object
  }
}
