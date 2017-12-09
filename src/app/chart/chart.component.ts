import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';
import { ChartNode } from '../chart-node';

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
    this.chartService.setOnChartDataCreate(() => {
      this.chartService.chartData.subscribe(this.updateChart.bind(this));
    });
  }

  updateChart(): void {
    if (!this.chartService.chartData) return;
    const data: ChartNode[][] = this.chartService.chartData.getValue();
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
      const strokeColor = this.chartService.colors[i];
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
