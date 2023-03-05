import { scaleLinear, interpolateRound, interpolateNumber } from 'd3'
import { TransformationService } from '../services/transformation.service'
import { interval, minmaxnum } from './types'


export class Offset {
  constructor(xy: any = {}) {
    this.x = xy.x || 0
    this.y = xy.y || 0
  }
  x: number | string = 0
  y: number | string = 0
}

export class Size {
  width = 0
  height = 0
}


export class Scales {
  private _x = scaleLinear().interpolate(interpolateRound)
  private _y = scaleLinear().interpolate(interpolateRound)
  // public readonly x = scaleLinear()
  // public readonly y = scaleLinear()

  private _xRange: interval = [0, 1]
  private _yRange: interval = [0, 1]
  private _xDomain: interval = [Infinity, -Infinity]
  private _yDomain: interval = [Infinity, -Infinity]

  public x(value: minmaxnum): number {
    return this._x(this.parseDomainValue(value, this._xDomain))
  }

  public y(value: minmaxnum): number {
    return this._y(this.parseDomainValue(value, this._yDomain))
  }

  public xInvert(pixelValue: number): number  {
    return this._x.invert(pixelValue)
  }

  public yInvert(pixelValue: number): number  {
    return this._y.invert(pixelValue)
  }

  private parseDomainValue(value: minmaxnum, domain: interval): number {
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'string') {
      if (value === 'min') {
        return domain[0]
      }
      if (value === 'max') {
        return domain[1]
      }
    }
    throw('Could not parse value: ' + value)
  }

  public get xScale() {
    return this._x
  }

  public get yScale() {
    return this._y
  }

  public get xRange() {
    return this._xRange
  }
  public set xRange(range: interval) {
    this._xRange = range
    this._x.range(range)
  }

  public get yRange() {
    return this._yRange
  }
  public set yRange(range: interval) {
    this._yRange = range
    this._y.range(range)
  }

  public get xDomain() {
    return this._xDomain
  }
  public set xDomain(domain: interval) {
    this._xDomain = domain
    this._x.domain(domain)
  }

  public get yDomain() {
    return this._yDomain
  }
  public set yDomain(domain: interval) {
    this._yDomain = domain
    this._y.domain(domain)
  }
}


export class Extents {
  constructor(
    x: interval = [Infinity, -Infinity],
    y: interval = [Infinity, -Infinity],
  ) {
    this.x = x
    this.y = y
  }

  public x: interval
  public y: interval

  public max(extents: Extents): Extents {
    return new Extents(
      this.maxInterval(this.x, extents.x),
      this.maxInterval(this.y, extents.y),
    )
  }

  public maxInterval(int1: interval, int2: interval): interval {
    return [Math.min(int1[0], int2[0]), Math.max(int1[1], int2[1])]
  }
}


export class Margins {
  constructor(margins: any = {}) {
    this.left = margins.left || 0
    this.right = margins.right || 0
    this.top = margins.top || 0
    this.bottom = margins.bottom || 0
  }

  left = 0
  right = 0
  top = 0
  bottom = 0
}


export class ViewDataItem {
  constructor(x: number, y: number, value: string | number | null = null) {
    this.x = x
    this.y = y
    this.value = value
  }

  x: number
  y: number
  value?: string | number | null
}


export class Domain {
  constructor(
    scales=new Scales(), size=new Size(), transformationService=new TransformationService()
  ) {
    this.scales = scales
    this.size = size
    this.transformationService = transformationService
  }

  scales = new Scales()
  extents = new Extents()
  size = new Size()
  private transformationService: TransformationService

  public xPixel(value: number | string): number {
    return this.transformationService.toPixel(value, this.size.width)
  }

  public yPixel(value: number | string): number {
    return this.transformationService.toPixel(value, this.size.height)
  }

  public update(p: DomainPatch): Domain {
    const domain = new Domain(this.scales, this.size)
    if (p.xRange) {
      domain.scales.xRange = p.xRange
    }
    if (p.yRange) {
      domain.scales.yRange  = p.yRange
    }
    if (p.xDomain) {
      domain.scales.xDomain = p.xDomain
    }
    if (p.yDomain) {
      domain.scales.yDomain = p.yDomain
    }
    if (p.width !== undefined) {
      domain.size.width = p.width
    }
    if (p.height !== undefined) {
      domain.size.height = p.height
    }
    return domain
  }
}

export class DomainPatch {
  xRange?: interval
  yRange?: interval
  xDomain?: interval
  yDomain?: interval
  width?: number
  height?: number
}

export class PixelOrigin {
  constructor(origin?: any) {
    if (!origin) {
      return
    }
    this.left = origin.left || 0
    this.top = origin.top || 0
  }

  left = 0
  top = 0
}

export class ChartMouseEvent {
  constructor(event?: MouseEvent, targetOrigin?: PixelOrigin) {
    if (!event || !targetOrigin) {
      return
    }
    this.type = event.type
    this.x = Math.round(event.clientX - targetOrigin.left)
    this.y = Math.round(event.clientY - targetOrigin.top)
  }

  type = ''
  x = 0
  y = 0
}