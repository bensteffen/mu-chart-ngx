import { Component , OnInit, OnDestroy, Input } from '@angular/core';
import { ScaleStoreService } from '../services/scale-store.service';
import { Domain, Extents, ViewDataItem } from '../entity/entities';
import { interval } from '../entity/types';
import { extent } from 'd3';


@Component({ template: '' })
export abstract class View implements OnInit, OnDestroy {

  protected _data: ViewDataItem[] = []
  @Input() set data(d: ViewDataItem[]) {
    this._data = d
    this.publishExtents()
  }

  protected domain: Domain = new Domain()

  constructor(protected scaleStore: ScaleStoreService) {
    this.scaleStore.registerView(this)
  }

  ngOnInit(): void {
    this.build()
    this.scaleStore.domain$.subscribe(domain => {
      this.domain = domain
      this.update()
    })
  }

  ngOnDestroy(): void {
    this.scaleStore.unregisterView(this)
    this.destroy()
  }

  protected publishExtents() {
    const extents = this.calculateExtents()
    if (!extents) {
      return
    }
    this.scaleStore.setExtents(this, extents)
  }

  protected calculateExtents(): Extents | null {
    if (!this._data.length) {
      return null
    }
    return new Extents(
      extent(this._data.map(d => d.x)) as interval,
      extent(this._data.map(d => d.y)) as interval,
    )
  }

  protected build(): void { }

  protected abstract update(): void

  protected destroy(): void { }
}
