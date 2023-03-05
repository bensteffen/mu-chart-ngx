import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { DomainComponent } from './domain/domain.component';
import { LineComponent } from './views/line/line.component';
import { BarComponent } from './views/bar/bar.component';
import { AreaComponent } from './views/area/area.component';
import { AxisComponent } from './views/axis/axis.component';
import { LabelComponent } from './views/label/label.component';
import { TransformationService } from './services/transformation.service';
import { SymbolComponent } from './views/symbol/symbol.component';



@NgModule({
  declarations: [
    ChartComponent,
    DomainComponent,
    LineComponent,
    BarComponent,
    AreaComponent,
    AxisComponent,
    LabelComponent,
    SymbolComponent
  ],
  exports: [
    ChartComponent,
    DomainComponent,
    LineComponent,
    BarComponent,
    AreaComponent,
    AxisComponent,
    LabelComponent,
    SymbolComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    TransformationService
  ]
})
export class MuChartModule { }
