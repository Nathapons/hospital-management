import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = signal('');
  password = signal('');

  private http = inject(HttpClient);
  private router = inject(Router);

  async login() {
    const body = {
      username: this.username(),
      password: this.password()
    };

    try {
      const response = await firstValueFrom(
        this.http.post('http://localhost:8080/api/login', body)
      );
      console.log('Login successful', response);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}
