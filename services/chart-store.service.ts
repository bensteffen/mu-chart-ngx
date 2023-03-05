import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { ChartMouseEvent, Size } from '../entity/entities'


@Injectable({
  providedIn: 'root'
})
export class ChartStoreService {

  private size = new BehaviorSubject<Size>(new Size());
  public readonly size$ = this.size.asObservable();

  private mouseEvents = new BehaviorSubject<ChartMouseEvent>(new ChartMouseEvent());
  public readonly mouseEvents$ = this.mouseEvents.asObservable().pipe(
    filter(event => !!event.type)
  );

  constructor() { }

  public updateSize(size: Size) {
    this.size.next(size)
  }

  public publishMouseEvent(event: ChartMouseEvent) {
    this.mouseEvents.next(event)
  }
}
