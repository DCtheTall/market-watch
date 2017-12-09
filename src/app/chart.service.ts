import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ChartNode } from './chart-node';
import { Company } from './company';

@Injectable()
export class ChartService {
  private companies: Observable<Company[]>;
  private onChartDataCreate: () => void;

  public chartData: BehaviorSubject<ChartNode[][]>;
  public chartDataObserver: Observer<ChartNode[][]>;
  public companiesObserver: Observer<Company[]>;
  public colors: string[];

  constructor() {
    this.companies = Observable.create((observer: Observer<Company[]>) => {
      this.companiesObserver = observer;
    });
    this.companies.subscribe(this.onCompaniesUpdate.bind(this));
    window.addEventListener('resize', this.updateChart.bind(this));
  }

  private onCompaniesUpdate(data: Company[]): void {
    const chartData: ChartNode[][] = [];
    this.colors = [];
    data.forEach((company) => {
      chartData.push(company.data);
      this.colors.push(company.color);
    });
    if (!this.chartData) {
      this.chartData = new BehaviorSubject(chartData);
      this.onChartDataCreate();
    } else {
      this.chartData.next(chartData);
    }
  }

  public setOnChartDataCreate(func: () => void): void {
    this.onChartDataCreate = func;
  }

  public updateChart(): void {
    this.chartData.next(this.chartData.getValue());
  }
}
