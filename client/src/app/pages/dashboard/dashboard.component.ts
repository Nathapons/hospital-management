import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhrComponent } from './phr/phr.component';
import { CreateUserComponent } from './create-user/create-user.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PhrComponent, CreateUserComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  currentView = 'dashboard';

  setView(view: string) {
    this.currentView = view;
  }
}
