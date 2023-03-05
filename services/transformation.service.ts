import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TransformationService {

  constructor() { }

  public toPixel(value: number | string, extent: number): number {
    if (typeof value === 'number') {
      return value
    } else {
      const cleaned = value.replace(/\s/g,'')
      if (cleaned.endsWith('%')) {
        const parsed = Number(cleaned.slice(0, -1))
        if (isNaN(parsed)) {
          throw(new Error(`Cannot transform to pixel: ${value}`))
        }
        return extent*parsed/100
      }
      throw(new Error(`Cannot transform to pixel: ${value}`))
    }
  }
}
