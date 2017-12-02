import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChartService } from '../chart.service';

import './chart.component.scss';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements OnInit {
  constructor(
    private chartService: ChartService
  ) {}
  ngOnInit() {
    setInterval(this.chartService.updateChart.bind(this.chartService), 1000);
  }
}
