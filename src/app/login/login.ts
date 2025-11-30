import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  isRegisterMode = signal(false);

  loading = this.authService.loading;
  authError = this.authService.authError;

  ngOnInit() {
    this.authService.clearError();
    this.resetForm();
  }

  ngOnDestroy() {
    this.authService.clearError();
  }

  toggleMode() {
    this.isRegisterMode.update(value => !value);
    this.authService.clearError();
  }

  resetForm() {
    this.email.set('');
    this.password.set('');
  }

  async onSubmit() {
    const email = this.email();
    const password = this.password();

    if (!email || !password) {
      this.authService.authError.set('Please fill in all fields.');
      return;
    }

    const success = this.isRegisterMode()
      ? await this.authService.register(email, password)
      : await this.authService.login(email, password);

    if (success) {
      this.resetForm();
    }
  }
}
