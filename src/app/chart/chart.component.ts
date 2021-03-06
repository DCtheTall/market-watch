import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as d3 from 'd3';

import { ChartService } from '../chart.service';
import { ChartNode } from '../chart-node';

import './chart.component.scss';

function onNodeMouseEnter(symbol: string, color: string, node: ChartNode): void {
  const formatDate = d3.timeFormat('%Y-%m-%d');
  const tip = document.getElementById('tool-tip');
  tip.innerHTML = `<strong style="color: ${color};">${symbol}</strong> ${formatDate(new Date(node.date))}<br>`;
  tip.innerHTML += `high: ${node.high}<br>`;
  tip.innerHTML += `low: ${node.low}<br>`;
  tip.innerHTML += `close: ${node.close}`;
  tip.style.left = `${d3.event.layerX + 10}px`;
  tip.style.top = `${d3.event.layerY + 10}px`;
  d3.select(tip).attr('class', 'tool-tip visible');
}

function onNodeMouseLeave(): void {
  const tip = document.getElementById('tool-tip');
  d3.select(tip).attr('class', 'tool-tip');
}

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements OnInit {
  private chartData: ChartNode[][];

  constructor(
    private chartService: ChartService
  ) {
    window.addEventListener('resize', this.updateChart.bind(this));
    window.addEventListener('orientationchange', () => setTimeout(this.updateChart.bind(this), 1000));
  }

  ngOnInit() {
    this.chartService.chartData.subscribe((data: ChartNode[][]) => {
      this.chartData = data;
      this.updateChart();
    });
  }

  updateChart(): void {
    if (!this.chartService.chartData) return;
    const data: ChartNode[][] = this.chartData;
    const svg = d3.select<HTMLElement, {}>('#chart-svg');
    svg.selectAll('*')
       .remove();
    const margin = {
      bottom: 50,
      left: 25,
      right: 25,
      top: 10,
    };
    const container = document.getElementById('chart-container');
    const chartWidth = container.offsetWidth - margin.left - margin.right;
    const chartHeight = container.offsetHeight - margin.top - margin.bottom;
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
    const maximumValue = <number>d3.max(maximumValues);
    const orderOfMagnitude = 10 ** Math.floor(Math.log(maximumValue) / Math.log(10));
    let chartMaximum: number;
    if (maximumValue < (2.5 * orderOfMagnitude)) chartMaximum = 2.5 * orderOfMagnitude;
    else if (maximumValue < (5 * orderOfMagnitude)) chartMaximum = 5 * orderOfMagnitude;
    else chartMaximum = 10 * orderOfMagnitude;
    const getYCoord = d3.scaleLinear()
                        .domain([0, chartMaximum])
                        .range([chartHeight, 0]);

    // Horizontal scaling lines

    const scaleLabels = svg.append('g');
    scaleLabels.attr('transform', `translate(${margin.left}, ${margin.top})`);

    for (let i = 0; i < 5; i += 1) {
      const height = chartHeight * (1 - ((i + 1) / 5));
      const horizontalLine = scaleLabels.append('path');
      horizontalLine.attr('transform', `translate(0, ${height})`)
                    .attr('d', `M 0 0 L ${chartWidth} 0`)
                    .attr('class', 'scale-label-line')
                    .attr('stroke-width', .25);
      const scaleValue = scaleLabels.append('text');
      scaleValue.attr('text-anchor', 'end')
                .attr('transform', `translate(${chartWidth - 5}, ${height - 10})`)
                .attr('class', 'scale-label-text')
                .text(Math.round(getYCoord.invert(height)));
    }

    // Line graph

    const chartGroup = svg.append('g')
                          .attr('transform', `translate(${margin.left}, ${margin.top})`);

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

      const symbol = this.chartService.symbols[i];
      const tooltipPoints = chartGroup.append('g');
      const points = tooltipPoints.selectAll('g')
                               .data(filteredChartNodes)
                               .enter()
                               .append('g');
      points.attr('transform', (d: ChartNode) => `translate(${getXCoord(new Date(d.date))}, ${getYCoord(d.close)})`)
            .append('circle')
            .attr('r', 6)
            .attr('fill', strokeColor)
            .attr('opacity', 0.05);
      points.on('mouseenter', onNodeMouseEnter.bind(null, symbol, strokeColor));
      points.on('mouseleave', onNodeMouseLeave);
    });

    // My own bottom axis, don't like d3's axisBottom

    const bottomAxis = svg.append('g')
                          .attr('transform', `translate(${margin.left}, ${margin.top + chartHeight})`);

    const bottomBorder = bottomAxis.append('path');
    bottomBorder.attr('d', `M 0 0 L ${chartWidth} 0`)
                .attr('class', 'axis-line')
                .attr('stroke-width', .8);
    const iterations = window.innerWidth > 700 ? 20 : 10;

    for (let i = 0; i < (iterations + 1); i += 1) {
      const bottomAxisTick = bottomAxis.append('path');
      bottomAxisTick.attr(
        'transform',
        `translate(${i * (chartWidth / iterations)}, 0)`
      );
      bottomAxisTick.attr('class', 'axis-line')
                    .attr('stroke-width', .7)
                    .attr('d', 'M 0 0 L -2 10');

      const formatLabel = d3.timeFormat('%b %d');
      const date = getXCoord.invert(i * (chartWidth / iterations));
      const dateLabel = bottomAxis.append('text');
      dateLabel.text(formatLabel(date));
      dateLabel.attr(
        'transform',
        `translate(${i * (chartWidth / iterations)}, 20)`
      )
      .attr('class', 'axis-text')
      .attr('text-anchor', 'middle');
    }
  }
}
