import { Component, Input } from '@angular/core';
import { ViewDataItem } from '../../entity/entities';
import { ScaleStoreService } from '../../services/scale-store.service';
import { View } from '../view'
import { Offset } from '../../entity/entities'


export class LabelDataItem extends ViewDataItem {
  offset?: Offset
  text? = ''
  rotate?: number
}


@Component({
  selector: '[mu-chart-label]',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent extends View {

  protected override _data: LabelDataItem[] = []
  @Input() override set data(d: LabelDataItem[]) {
    this._data = d
    this.publishExtents()
  }

  private _offset = new Offset()
  @Input() set offset(value: any) {
    this._offset = new Offset(value)
    this.update()
  }

  private _rotate = 0
  @Input() set rotate(value: number) {
    this._rotate = value
    this.update()
  }


  public texts: any[] = []

  constructor(protected override scaleStore: ScaleStoreService) {
    super(scaleStore)
  }

  protected update() {
    this.texts = this._data.map((item: LabelDataItem) => {
      const x = this.domain.scales.x(item.x) + this.domain.xPixel(item.offset?.x || this._offset.x)
      const y = this.domain.scales.y(item.y) - this.domain.yPixel(item.offset?.y || this._offset.y)
      return {
        transform: `translate(${x},${y}) rotate(${ item.rotate || this._rotate})`,
        content: item.text
      }
    })
  }
}
