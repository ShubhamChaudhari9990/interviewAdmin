import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-monthly-trend-chart',
  template: `<div #chartHost class="admin-chart"></div>`,
})
export class MonthlyTrendChart implements AfterViewInit, OnDestroy {
  private chart?: echarts.ECharts;

  @ViewChild('chartHost', { static: true })
  chartHost!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartHost.nativeElement);
    this.chart.setOption({
      grid: { left: 24, right: 16, top: 24, bottom: 32 },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#94a3b8', fontSize: 12 },
      },
      series: [
        {
          type: 'bar',
          data: [320, 410, 380, 450, 520, 480],
          barWidth: 36,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: (params: { dataIndex: number }) =>
              params.dataIndex === 4 ? '#3525cd' : '#c7d2fe',
          },
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => this.chart?.resize());
    resizeObserver.observe(this.chartHost.nativeElement);
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }
}
