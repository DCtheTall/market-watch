import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { INTERVALS } from '../constants';

import { ChartService } from '../chart.service';

import './chart.component.scss';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements OnInit {
  private INTERVALS = INTERVALS;

  constructor(
    private chartService: ChartService
  ) {}
  ngOnInit() {}

  private setChartInterval(interval: string): void {
    this.chartService.updateChartInterval(interval);
  }
}
