import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoginMode = true;
  errorMessage = '';

  authForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    const { username, password } = this.authForm.value;
    const authObservable = this.isLoginMode
      ? this.authService.login({ username, password })
      : this.authService.register({ username, password });

    authObservable.subscribe({
      next: () => {
        if (!this.isLoginMode) {
          // Switch to login mode after successful registration
          this.isLoginMode = true;
          this.errorMessage = '';
          this.authForm.reset();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}

