import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhrComponent } from './phr/phr.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DashboardChartsComponent } from './dashboard-charts.component';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PhrComponent, CreateUserComponent, DashboardChartsComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  currentView = 'dashboard';
  readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  isTransitioning = false;

  setView(view: string): void {
    this.currentView = view;
  }

  toggleTheme(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    setTimeout(() => {
      this.themeService.toggleTheme();
      this.isTransitioning = false;
    }, 1000);
  }

  get isDark(): boolean {
    return this.themeService.isDark();
  }

  async logout(): Promise<void> {
    this.router.navigate(['/login']);
  }
}
