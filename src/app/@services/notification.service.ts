// ANGULAR
import { Injectable } from '@angular/core';
// ANGULAR MATERIAL
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  /*****************************************/
  /******** showSuccess ********************/
  /*****************************************/
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  /*****************************************/
  /******** showError **********************/
  /*****************************************/
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  /*****************************************/
  /******** showWarning ********************/
  /*****************************************/
  showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['warning-snackbar'],
    });
  }
}
