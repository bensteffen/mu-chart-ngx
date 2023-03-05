import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Size, Margins, Extents, ChartMouseEvent, PixelOrigin, Domain } from '../entity/entities'
import { interval } from '../entity/types'
import { ChartStoreService } from '../services/chart-store.service';
import { ScaleStoreService } from '../services/scale-store.service';
import { TransformationService } from '../services/transformation.service';


@Component({
  selector: '[mu-chart-domain]',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css'],
  providers: [ScaleStoreService]
})
export class DomainComponent implements OnInit {

  private _xLimits: interval | null = null
  @Input() set xLimits(limits: interval) {
    this._xLimits = limits
    this.scaleStore.updateDomain({ xDomain: limits })
  }

  private _yLimits: interval | null = null
  @Input() set yLimits(limits: interval) {
    this._yLimits = limits
    this.scaleStore.updateDomain({ yDomain: limits })
  }

  public transform = ""
  private _margins: Margins = new Margins()
  @Input() set margins(value: any) {
    this._margins = new Margins(value)
    this.updateSize()
  }

  private _chartSize: Size = new Size()
  set chartSize(size: Size) {
    this._chartSize = size
    this.updateSize()
  }

  @Output() mouseEvent = new EventEmitter<ChartMouseEvent>()

  private _domain = new Domain()
  private _origin = new PixelOrigin()
  private _size = new Size()

  constructor(
    private chartStore: ChartStoreService,
    private scaleStore: ScaleStoreService,
    private transformations: TransformationService
  ) { }

  ngOnInit(): void {
    this.chartStore.size$.subscribe((size: Size) => this.chartSize = size)
    this.chartStore.mouseEvents$.subscribe((event: ChartMouseEvent) => {
      const mouseEvent = new ChartMouseEvent()
      mouseEvent.type = event.type
      mouseEvent.x = this._domain.scales.xInvert(event.x - this._origin.left)
      mouseEvent.y = this._domain.scales.yInvert(event.y - this._origin.top)
      if (mouseEvent.x >= 0 && mouseEvent.x <= this._size.width) {
        if (mouseEvent.y >= 0 && mouseEvent.y <= this._size.height) {
          this.mouseEvent.emit(mouseEvent)
        }
      }
    })
    this.scaleStore.domain$.subscribe(domain => {
      this._domain = domain
    })
    this.scaleStore.extents$.subscribe((extents: Extents) =>
      this.scaleStore.updateDomain({
        xDomain: this._xLimits || extents.x,
        yDomain: this._yLimits || extents.y
      })
    )
  }

  private updateSize() {
    const { left, right, top, bottom} = {
      left: this.transformations.toPixel(this._margins.left, this._chartSize.width),
      right: this.transformations.toPixel(this._margins.right, this._chartSize.width),
      top: this.transformations.toPixel(this._margins.top, this._chartSize.height),
      bottom: this.transformations.toPixel(this._margins.bottom, this._chartSize.height),
    }
    this._origin = new PixelOrigin({ left, top })

    this.transform = `translate(${left},${top})`

    const width = this._chartSize.width - left - right
    const height = this._chartSize.height - top - bottom

    this._size = { width, height }
    this.scaleStore.updateDomain({
      xRange: [0, width],
      yRange: [height, 0],
      width, height
    })
  }

}
