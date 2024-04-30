// ANGULAR
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  ],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId!: number;
  product: Product | null = null;
  isEditing: boolean = false;
  currentCurrency: 'USD' | 'EUR' = 'USD';
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  /*****************************************/
  /******** ngOnInit ***********************/
  /*****************************************/
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProductDetails(this.productId);
    });
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
  /****** loadProductDetails ***************/
  /*****************************************/
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
}
