import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { View } from '../views/view';
import { Domain, DomainPatch, Extents } from '../entity/entities'


@Injectable({
  providedIn: 'root'
})
export class ScaleStoreService {

  private domain = new BehaviorSubject<Domain>(new Domain());
  public readonly domain$ = this.domain.asObservable();

  private extents = new BehaviorSubject<Extents>(new Extents());
  public readonly extents$ = this.extents.asObservable()

  private viewExtents: {view: View, extents: Extents}[] = []

  constructor() { }

  public updateDomain(patch: DomainPatch) {
    this.domain.next(this.domain.value.update(patch))
  }

  public registerView(view: View) {
    this.viewExtents.push({view, extents: new Extents()})
  }

  public unregisterView(view: View) {
    this.viewExtents = this.viewExtents.filter(entry => entry.view !== view)
    this.mergeAndPublishExtents()
  }

  public setExtents(view: View, extents: Extents) {
    const idx = this.viewExtents.findIndex(entry => entry.view === view)
    this.viewExtents[idx].extents = extents
    this.mergeAndPublishExtents()
  }

  private mergeAndPublishExtents() {
    const combinedExtent = this.viewExtents.map(entry => entry.extents).reduce(
      (acc, curr) => acc.max(curr), new Extents()
    )
    this.extents.next(combinedExtent)
  }
}
