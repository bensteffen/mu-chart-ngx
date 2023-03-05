import { Component, Input, OnInit } from '@angular/core';
import { symbol, SymbolType, symbolAsterisk, symbolCircle, symbolDiamond } from 'd3'
import { ScaleStoreService } from '../../services/scale-store.service';
import { View } from '../view';

@Component({
  selector: '[mu-chart-symbol]',
  templateUrl: './symbol.component.html',
  styleUrls: ['./symbol.component.css']
})
export class SymbolComponent extends View {

  private _shape = 'circle'
  @Input() set shape(value: string) {
    this._shape = value
    this.update()
  }

  public paths: any[] = []
  public transform = ''

  private shapes: {[key: string]: SymbolType} = {
    'asterisk': symbolAsterisk,
    'circle': symbolCircle,
    'diamond': symbolDiamond,
  }

  constructor(protected override scaleStore: ScaleStoreService) {
    super(scaleStore)
  }

  update() {
    const shape = symbol().type(this.shapes[this._shape])
    const d = shape() || ''
    this.paths = this._data.map(pt => ({
      d: d,
      transform: `translate(${this.domain.scales.x(pt.x)},${this.domain.scales.y(pt.y)})`
    }))
  }
}
