import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ChartMouseEvent } from '../entity/entities';
import { ChartStoreService } from '../services/chart-store.service';


@Component({
  selector: 'mu-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [ChartStoreService]
})
export class ChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('container') chartContainer!: ElementRef

  private resizeObserver: ResizeObserver

  constructor(
    private zone: NgZone,
    public store: ChartStoreService
  ) {
    this.resizeObserver = new ResizeObserver(() => {
      this.zone.run(() => {
        const boundingBox = this.chartContainer.nativeElement.getBoundingClientRect()
        this.store.updateSize({
          width: boundingBox.width,
          height: boundingBox.height
        })
      })
    })
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.chartContainer.nativeElement)
  }

  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.chartContainer.nativeElement)
  }

  publishMouseEvent(event: MouseEvent) {
    this.store.publishMouseEvent(new ChartMouseEvent(
      event, this.chartContainer.nativeElement.getBoundingClientRect()
    ))
  }
}
