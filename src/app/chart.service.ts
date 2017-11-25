import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ChartNode } from './chart-node';

@Injectable()
export class ChartService {
  public chartData: Observable<ChartNode[]>
  public chartDataObserver: Observer<ChartNode[]>;

  constructor() {}
}
