import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhrComponent } from './phr/phr.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PhrComponent, CreateUserComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  currentView = 'dashboard';
  router = inject(Router);

  setView(view: string) {
    this.currentView = view;
  }

  async logout() {
    this.router.navigate(['/login']);
  }
}
