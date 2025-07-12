import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
//import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Make LoginComponent standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule, // For form handling
    RouterModule,
    CommonModule // For routerLink
  ],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials and try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}