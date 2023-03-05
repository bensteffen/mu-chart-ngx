import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { select, axisBottom, axisLeft, axisTop, axisRight, Axis, NumberValue } from 'd3';
import { Offset, Size } from '../../entity/entities';
import { ScaleStoreService } from '../../services/scale-store.service';
import { View } from '../view'


class AxisLabel {
  constructor(label: any = {}) {
    this.content = label.content || ''
    this.rotate = label.rotate || 0
    this.offset = new Offset(label.offset) || new Offset()
  }
  content = ''
  rotate? = 0
  offset? = new Offset()
}


@Component({
  selector: '[mu-chart-axis]',
  templateUrl: './axis.component.html',
  styleUrls: ['./axis.component.css']
})
export class AxisComponent extends View {

  @ViewChild('axisContainer') axisContainer!: ElementRef

  private _orient = "bottom"
  @Input() set orient(value: string) {
    this._orient = value
    this.update()
  }

  private _position = "bottom"
  @Input() set position(value: string) {
    this._position = value
    this.update()
  }

  private _tickSize = 5
  @Input() set tickSize(value: number) {
    this._tickSize = value
    this.update()
  }

  private _label = new AxisLabel()
  @Input() set label(value: any) {
    this._label = new AxisLabel(value)
    this.update()
  }
  public labelText: any = null

  private baseOffsetFactories: {[key: string]: (s: Size) => Offset} = {
    bottom: size => new Offset({ x: 0.5*size.width, y: size.height }),
    top: size => new Offset({ x: 0.5*size.width, y: 0 }),
    left: size => new Offset({ x: 0, y: 0.5*size.height }),
    right: size => new Offset({ x: size.width, y: 0.5*size.height })
  }

  public transform = 'translate(0,0)'

  private axisFactories: {[key: string]: () => Axis<NumberValue>} = {
    bottom: () => axisBottom(this.domain.scales.xScale),
    left: () => axisLeft(this.domain.scales.yScale),
    top: () => axisTop(this.domain.scales.xScale),
    right: () => axisRight(this.domain.scales.yScale),
  }

  constructor(protected override scaleStore: ScaleStoreService) {
    super(scaleStore)
  }

  protected update() {
    if (!this.axisContainer) {
      return
    }
    const axis = this.axisFactories[this._position]().tickSize(this._tickSize)
    select(this.axisContainer.nativeElement).call(axis)
    if (this._position === 'bottom') {
      this.transform = `translate(0,${this.domain.size.height})`
    }
    if (this._position === 'right') {
      this.transform = `translate(${this.domain.size.width},0)`
    }

    this.updateLabel()
  }

  protected updateLabel() {
    const position = this.baseOffsetFactories[this._position](this.domain.size)
    const xPos = (position.x as number) + this.domain.xPixel(this._label.offset?.x || 0)
    const yPos = (position.y as number ) + this.domain.yPixel(this._label.offset?.y || 0)
    this.labelText = {
      content: this._label.content,
      transform: `translate(${xPos},${yPos}) rotate(${this._label.rotate})`
    }
  }
}
