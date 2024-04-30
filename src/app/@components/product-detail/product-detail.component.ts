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
// SERVICES
import { ProductService } from '../../@services/product.service';
// INTERFACES
import { Product } from '../../@interfaces/product.interface';
// LIBRARIES
import { Subscription } from 'rxjs';

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
    MatTableModule
  ],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  public productId: number;
  public product: Product | null = null;
  public isEditing: boolean = false;
  public currentCurrency: 'USD' | 'EUR' = 'USD';

  private routeSub: Subscription | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private dialogRef: MatDialogRef<ProductDetailComponent>,
    private productService: ProductService
  ) {
    this.productId = data.productId;
  }

  ngOnInit(): void {
    // Carga los detalles del producto utilizando el ID de producto pasado como dato
    this.loadProductDetails(this.productId);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProductDetails(productId: number): void {
    this.productService.getProductDetails(productId).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.loadProductDetails(this.productId);
  }

  saveProduct(): void {
    if (this.product) {
      this.productService.updateProduct(this.productId, this.product).subscribe({
        next: (updatedProduct) => {
          this.product = updatedProduct;
          this.isEditing = false;
          console.log('Product updated successfully:', updatedProduct);
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    }
  }

  closeDialog(): void {
    // Cierra el modal
    this.dialogRef.close();
  }
}
