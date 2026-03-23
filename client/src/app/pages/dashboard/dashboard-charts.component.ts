import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  Title,
} from 'chart.js';
import { StatsService, DailyRegistration, GenderStat } from '../../services/stats.service';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  Title
);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

      <!-- Bar Chart Card -->
      <div class="xl:col-span-2 rounded-2xl p-6 shadow-sm border transition-colors duration-1000"
           [class.bg-gray-900]="isDark"
           [class.border-gray-700]="isDark"
           [class.bg-white]="!isDark"
           [class.border-gray-200]="!isDark">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-semibold transition-colors duration-1000"
                [class.text-gray-100]="isDark"
                [class.text-gray-800]="!isDark">Daily Patient Registrations</h3>
            <p class="text-xs mt-0.5 transition-colors duration-1000"
               [class.text-gray-400]="isDark"
               [class.text-gray-500]="!isDark">Last 30 days</p>
          </div>
          <span class="text-2xl font-bold text-[#7ca081]">{{ totalRegistrations }}</span>
        </div>

        @if (isLoading) {
          <div class="flex items-center justify-center h-64">
            <svg class="animate-spin h-8 w-8 text-[#7ca081]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        } @else if (barError) {
          <div class="flex flex-col items-center justify-center h-64 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-400">Failed to load chart data.</p>
            <p class="text-xs text-gray-400">Make sure the backend is running.</p>
          </div>
        } @else {
          <div class="relative h-64">
            <canvas #barCanvas></canvas>
          </div>
        }
      </div>

      <!-- Pie Chart Card -->
      <div class="rounded-2xl p-6 shadow-sm border transition-colors duration-1000"
           [class.bg-gray-900]="isDark"
           [class.border-gray-700]="isDark"
           [class.bg-white]="!isDark"
           [class.border-gray-200]="!isDark">
        <div class="mb-4">
          <h3 class="text-base font-semibold transition-colors duration-1000"
              [class.text-gray-100]="isDark"
              [class.text-gray-800]="!isDark">Gender Distribution</h3>
          <p class="text-xs mt-0.5 transition-colors duration-1000"
             [class.text-gray-400]="isDark"
             [class.text-gray-500]="!isDark">All patient registrations</p>
        </div>

        @if (isLoading) {
          <div class="flex items-center justify-center h-64">
            <svg class="animate-spin h-8 w-8 text-[#7ca081]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        } @else if (pieError) {
          <div class="flex flex-col items-center justify-center h-64 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-400">Failed to load chart data.</p>
            <p class="text-xs text-gray-400">Make sure the backend is running.</p>
          </div>
        } @else if (totalPatients === 0) {
          <div class="flex flex-col items-center justify-center h-64 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-gray-400">No patient data yet.</p>
          </div>
        } @else {
          <div class="relative h-48 flex items-center justify-center">
            <canvas #pieCanvas></canvas>
          </div>

          <!-- Legend -->
          <div class="mt-4 space-y-2">
            @for (item of genderLegend; track item.label) {
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-3 w-3 rounded-full flex-shrink-0" [style.background-color]="item.color"></span>
                  <span class="text-sm transition-colors duration-1000"
                        [class.text-gray-300]="isDark"
                        [class.text-gray-600]="!isDark">{{ item.label }}</span>
                </div>
                <span class="text-sm font-semibold transition-colors duration-1000"
                      [class.text-gray-100]="isDark"
                      [class.text-gray-800]="!isDark">{{ item.percent }}%</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardChartsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('barCanvas') barCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() isDark = false;

  private readonly statsService = inject(StatsService);
  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;

  isLoading = true;
  barError = false;
  pieError = false;

  totalRegistrations = 0;
  totalPatients = 0;

  private dailyData: DailyRegistration[] = [];
  private genderData: GenderStat[] = [];

  genderLegend: { label: string; color: string; percent: string }[] = [];

  private chartsInitialized = false;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (!this.isLoading && !this.chartsInitialized) {
      this.initCharts();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDark'] && !changes['isDark'].firstChange && this.chartsInitialized) {
      this.updateChartTheme();
    }
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.pieChart?.destroy();
  }

  private loadData(): void {
    this.isLoading = true;
    this.barError = false;
    this.pieError = false;

    forkJoin({
      registrations: this.statsService.getDailyRegistrations(),
      gender: this.statsService.getGenderStats(),
    }).subscribe({
      next: ({ registrations, gender }) => {
        this.dailyData = registrations;
        this.genderData = gender;
        this.totalRegistrations = registrations.reduce((sum: number, d: DailyRegistration) => sum + d.count, 0);
        this.totalPatients = gender.reduce((sum: number, g: GenderStat) => sum + g.count, 0);
        this.buildLegend();
        this.isLoading = false;

        // charts require the DOM to be ready; defer to next tick
        setTimeout(() => this.initCharts(), 0);
      },
      error: () => {
        this.barError = true;
        this.pieError = true;
        this.isLoading = false;
      },
    });
  }

  private buildLegend(): void {
    const colors: Record<string, string> = { M: '#60a5fa', F: '#f472b6' };
    const labels: Record<string, string> = { M: 'Male', F: 'Female' };
    this.genderLegend = this.genderData.map((g) => ({
      label: labels[g.gender] ?? g.gender,
      color: colors[g.gender] ?? '#9ca3af',
      percent: this.totalPatients
        ? ((g.count / this.totalPatients) * 100).toFixed(1)
        : '0.0',
    }));
  }

  private initCharts(): void {
    this.chartsInitialized = true;
    this.createBarChart();
    this.createPieChart();
  }

  private getChartColors(): { gridColor: string; labelColor: string } {
    return this.isDark
      ? { gridColor: 'rgba(255,255,255,0.08)', labelColor: '#9ca3af' }
      : { gridColor: 'rgba(0,0,0,0.06)', labelColor: '#6b7280' };
  }

  private createBarChart(): void {
    const canvas = this.barCanvasRef?.nativeElement;
    if (!canvas || this.dailyData.length === 0) return;

    this.barChart?.destroy();

    const { gridColor, labelColor } = this.getChartColors();

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.dailyData.map((d) => {
          const dt = new Date(d.date);
          return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        }),
        datasets: [
          {
            label: 'Registrations',
            data: this.dailyData.map((d) => d.count),
            backgroundColor: 'rgba(124, 160, 129, 0.75)',
            borderColor: '#7ca081',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.isDark ? '#1f2937' : '#ffffff',
            titleColor: this.isDark ? '#f3f4f6' : '#111827',
            bodyColor: this.isDark ? '#9ca3af' : '#6b7280',
            borderColor: this.isDark ? '#374151' : '#e5e7eb',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { size: 11 }, maxRotation: 45 },
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: {
              color: labelColor,
              font: { size: 11 },
              stepSize: 1,
              precision: 0,
            },
          },
        },
      },
    });
  }

  private createPieChart(): void {
    const canvas = this.pieCanvasRef?.nativeElement;
    if (!canvas || this.genderData.length === 0) return;

    this.pieChart?.destroy();

    const colors: Record<string, string> = { M: '#60a5fa', F: '#f472b6' };

    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.genderData.map((g) => (g.gender === 'M' ? 'Male' : 'Female')),
        datasets: [
          {
            data: this.genderData.map((g) => g.count),
            backgroundColor: this.genderData.map((g) => colors[g.gender] ?? '#9ca3af'),
            borderColor: this.isDark ? '#111827' : '#ffffff',
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: this.isDark ? '#1f2937' : '#ffffff',
            titleColor: this.isDark ? '#f3f4f6' : '#111827',
            bodyColor: this.isDark ? '#9ca3af' : '#6b7280',
            borderColor: this.isDark ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed as number;
                const pct = this.totalPatients
                  ? ((val / this.totalPatients) * 100).toFixed(1)
                  : '0.0';
                return ` ${val} patients (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  private updateChartTheme(): void {
    const { gridColor, labelColor } = this.getChartColors();

    if (this.barChart) {
      const scales = this.barChart.options.scales as Record<string, any>;
      scales['x'].grid.color = gridColor;
      scales['x'].ticks.color = labelColor;
      scales['y'].grid.color = gridColor;
      scales['y'].ticks.color = labelColor;
      const tooltip = this.barChart.options.plugins?.tooltip as Record<string, any>;
      if (tooltip) {
        tooltip['backgroundColor'] = this.isDark ? '#1f2937' : '#ffffff';
        tooltip['titleColor'] = this.isDark ? '#f3f4f6' : '#111827';
        tooltip['bodyColor'] = this.isDark ? '#9ca3af' : '#6b7280';
        tooltip['borderColor'] = this.isDark ? '#374151' : '#e5e7eb';
      }
      this.barChart.update();
    }

    if (this.pieChart) {
      const ds = this.pieChart.data.datasets[0] as Record<string, any>;
      ds['borderColor'] = this.isDark ? '#111827' : '#ffffff';
      const tooltip = this.pieChart.options.plugins?.tooltip as Record<string, any>;
      if (tooltip) {
        tooltip['backgroundColor'] = this.isDark ? '#1f2937' : '#ffffff';
        tooltip['titleColor'] = this.isDark ? '#f3f4f6' : '#111827';
        tooltip['bodyColor'] = this.isDark ? '#9ca3af' : '#6b7280';
        tooltip['borderColor'] = this.isDark ? '#374151' : '#e5e7eb';
      }
      this.pieChart.update();
    }
  }
}
