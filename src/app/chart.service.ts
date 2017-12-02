import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as d3 from 'd3';

import { ChartNode } from './chart-node';
import { Company } from './company';

@Injectable()
export class ChartService {
  private chartData: BehaviorSubject<ChartNode[][]>;
  private colors: string[];
  private companies: Observable<Company[]>;

  public chartDataObserver: Observer<ChartNode[][]>;
  public companiesObserver: Observer<Company[]>;

  constructor() {
    this.companies = Observable.create((observer: Observer<Company[]>) => {
      this.companiesObserver = observer;
    });
    this.companies.subscribe(this.onCompaniesUpdate.bind(this));
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
      this.chartData.subscribe(this.updateChart.bind(this));
    } else {
      this.chartData.next(chartData);
    }
  }

  public updateChart(): void {
    if (!this.chartData) return;
    const data: ChartNode[][] = this.chartData.getValue();
    const svg = d3.select<HTMLElement, {}>('#chart-svg');
    svg.selectAll('*').remove();
    const margin = {
      bottom: 10,
      left: 10,
      right: 10,
      top: 10,
    };
    const container = document.getElementById('chart-container');
    const chartWidth = container.offsetWidth - margin.left - margin.right;
    const chartHeight = container.offsetHeight - margin.top - margin.bottom;
    const chartGroup = svg.append('g')
                          .attr('transform', `translate(${margin.left}, ${margin.right})`);
    const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%SZ');
    const maximumValues = data.map((chartNodes: ChartNode[]) => {
      const companyHighValues = chartNodes.map(({ high }) => high);
      return Math.max.apply(null, companyHighValues);
    });
    const minDates = <Date[]>data.map((chartNodes: ChartNode[]) => {
      const dates = <Date[]>chartNodes.map(({ date }) => new Date(date));
      return <Date>d3.min(dates);
    });
    const maxDates = <Date[]>data.map((chartNodes: ChartNode[]) => {
      const dates = <Date[]>chartNodes.map(({ date }) => new Date(date));
      return <Date>d3.max(dates);
    });
    const getXCoord = d3.scaleTime()
                        .domain([d3.max(minDates), d3.min(maxDates)])
                        .range([0, chartWidth]);
    const getYCoord = d3.scaleLinear()
                        .domain([0, d3.max(maximumValues)])
                        .range([chartHeight, 0]);

    data.forEach((chartNodes: ChartNode[], i: number) => {
      const line = d3.line<ChartNode>()
                     .x((d: ChartNode) => getXCoord(new Date(d.date)))
                     .y((d: ChartNode) => getYCoord(d.close));
      const linePath = chartGroup.append('path');
      const strokeColor = this.colors[i];
      const filteredChartNodes = chartNodes.filter((node: ChartNode) => (
        node.date >= d3.max(minDates).toISOString()
        && node.date <= d3.min(maxDates).toISOString()
      ));
      linePath.datum(filteredChartNodes)
              .attr('fill', 'none')
              .attr('stroke', strokeColor)
              .attr('stroke-linejoin', 'round')
              .attr('stroke-linecap', 'round')
              .attr('stroke-width', 1.5)
              .attr('d', line);
    });
  }
}
