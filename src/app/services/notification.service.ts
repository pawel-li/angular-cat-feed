import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly snackBar: MatSnackBar) { }
  
  public success(message: string): void {
    this.openSnackBar(message, '', 'success-snackbar');
  }

  public error(message: string): void {
    this.openSnackBar(message, '', 'error-snackbar');
  }

  private openSnackBar(msg: string, action: string, className = '', duration = 1000): void {
    this.snackBar.open(msg, action, {
      duration: duration,
      panelClass: [className]
    });
  }
}