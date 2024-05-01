// ANGULAR
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// LIBRARIES
import { Subscription } from 'rxjs';
// SERVICES
import { ProductService } from '../../@services/product.service';
import { NotificationService } from '../../@services/notification.service';
// INTERFACES
import { Product } from '../../@interfaces/product.interface';
// HELPERS
import { CurrencyHelper } from '../../@helpers/currency.helper';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [
    CurrencyHelper
  ],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  public productId: number;
  public isEditing: boolean = false;
  public product: Product | null = null;
  public originalProduct: Product | null = null;
  public currentCurrency: 'USD' | 'EUR' = 'USD';

  private routeSub: Subscription | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private dialogRef: MatDialogRef<ProductDetailComponent>,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private currencyHelper: CurrencyHelper,
    private notificationService: NotificationService
  ) {
    this.productId = data.productId;
  }

  /*****************************************/
  /******** ngOnInit ***********************/
  /*****************************************/
  ngOnInit(): void {
    this.currentCurrency = this.retrieveSavedCurrency();
    this.loadProductDetails(this.productId);
  }

  /*****************************************/
  /******** ngOnDestroy ********************/
  /*****************************************/
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /*****************************************/
  /******** retrieveSavedCurrency **********/
  /*****************************************/
  retrieveSavedCurrency(): 'USD' | 'EUR' {
    return this.currencyHelper.retrieveSavedCurrency();
  }

  /*****************************************/
  /******** convertPrices ******************/
  /*****************************************/
  convertPrices(): void {
    if (this.product) {
      const conversionRate = this.currentCurrency === 'EUR' ? 0.93 : 1;
      this.product.price *= conversionRate; // Multiplica el precio por la tasa de conversión
    }
  }

  /*****************************************/
  /******** loadProductDetails *************/
  /*****************************************/
  loadProductDetails(productId: number): void {
    this.productService.getProductDetails(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.originalProduct = { ...product };
        this.convertPrices();
      },
      error: (error) => {
        console.error('Error loading product details:', error);
      }
    });
  }

  /*****************************************/
  /******** startEditing *******************/
  /*****************************************/
  startEditing(): void {
    this.isEditing = true;
  }

  /*****************************************/
  /******** cancelEditing ******************/
  /*****************************************/
  cancelEditing(): void {
    this.isEditing = false;
    this.loadProductDetails(this.productId);
  }

  /*****************************************/
  /******** saveProduct ********************/
  /*****************************************/
  saveProduct(): void {
    if (this.product) {
      const updatedFields: Partial<Product> = this.getUpdatedFields();

      if (Object.keys(updatedFields).length === 0) {
        this.notificationService.showWarning('No changes made');
        return;
      }

      this.productService.updateProduct(this.productId, updatedFields).subscribe({
        next: (updatedProduct) => {
          this.handleSuccessUpdate(updatedProduct);
        },
        error: (error) => {
          this.notificationService.showError('Error updating product');
        },
      });
    }
  }

  /*****************************************/
  /******** handleSuccessUpdate ************/
  /*****************************************/
  private handleSuccessUpdate(updatedProduct: Product): void {
    this.product = updatedProduct;
    this.isEditing = false;
    this.notificationService.showSuccess('Product updated successfully');
    console.log('Product updated successfully:', updatedProduct);
  }

  /*****************************************/
  /******** getUpdatedFields ***************/
  /*****************************************/
  private getUpdatedFields(): Partial<Product> {
    const updatedFields: Partial<Product> = {};
    if (this.product) {
      if (this.product.title !== this.originalProduct?.title) {
        updatedFields.title = this.product.title;
      }
      if (this.product.price !== this.originalProduct?.price) {
        updatedFields.price = this.product.price;
      }
      if (this.product.stock !== this.originalProduct?.stock) {
        updatedFields.stock = this.product.stock;
      }
      if (this.product.description !== this.originalProduct?.description) {
        updatedFields.description = this.product.description;
      }
    }
    return updatedFields;
  }

  /*****************************************/
  /******** closeDialog ********************/
  /*****************************************/
  closeDialog(): void {
    // Cierra el modal
    this.dialogRef.close();
  }

  /*****************************************/
  /******** getNameColor *******************/
  /*****************************************/
  getNameColor(stock: number): string {
    if (stock === 0) {
      return '#f44336';
    } else if (stock < 50) {
      return '#ffd600';
    }
    return '#001dff';
  }
}
