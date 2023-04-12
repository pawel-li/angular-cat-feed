import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { NotificationService } from '../services/notification.service';

export interface LoginForm extends FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}> { }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public errorEmail: string = '';
  public hidePassword = true;
  public form: LoginForm = this.fb.group({
    email: this.fb.nonNullable.control("", {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.nonNullable.control("", {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.form.controls.email.valueChanges.subscribe(() => {
      this.errorEmail = this.getErrorMessageForEmail();
    }));
    this.subscriptions.push(this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) this.router.navigate(['']);
    }));
  }

  ngOnDestroy(): void { this.subscriptions.forEach((subscription) => subscription.unsubscribe()); }

  public switchPasswordInputType(): void { this.hidePassword = !this.hidePassword; }

  public async submitForm(): Promise<void> {
    if (this.form.invalid) return;
    this.authService.login(this.form.controls.email.value, this.form.controls.password.value).subscribe(
      () => { this.router.navigate(['/feed']); },
      (error: HttpErrorResponse) => { this.notificationService.error(error.message); }
    );
  }

  private getErrorMessageForEmail(): string {
    if (this.form.controls.email.hasError('required')) return 'You must enter a value';
    return this.form.controls.email.hasError('email') ? 'Not a valid email' : '';
  }
}
