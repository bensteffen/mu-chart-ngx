import { Component } from '@angular/core';
import { line } from 'd3';
import { ScaleStoreService } from '../../services/scale-store.service';
import { View } from '../view'


@Component({
  selector: '[mu-chart-line]',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent extends View {
  public path = ""

  private pathFatory = line()
    .x(d => this.domain.scales.x(d[0]))
    .y(d => this.domain.scales.y(d[1]))

  constructor(protected override scaleStore: ScaleStoreService) {
    super(scaleStore)
  }

  protected update() {
    this.path = this.pathFatory(this._data.map(d => [d.x, d.y])) || ""
  }
}
