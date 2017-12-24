import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ChartNode } from './chart-node';
import { Company } from './company';

@Injectable()
export class ChartService {
  private companies: Observable<Company[]>;
  private chartDataObserver: Observer<ChartNode[][]>;

  public chartData: BehaviorSubject<ChartNode[][]> = new BehaviorSubject([]);
  public companiesObserver: Observer<Company[]>;
  public colors: string[] = [];
  public symbols: string[] = [];

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
    this.symbols = [];
    data.forEach((company) => {
      chartData.push(company.data);
      this.colors.push(company.color);
      this.symbols.push(company.symbol);
    });
    this.chartData.next(chartData);
  }

  public updateChart(): void {
    this.chartData.next(this.chartData.getValue());
  }
}
