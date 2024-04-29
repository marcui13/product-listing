import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../@services/product.service';
import { Product } from '../../@interfaces/product.interface';

// Importar módulos de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  currentCurrency: 'USD' | 'EUR' = 'USD'; // Define currentCurrency
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del producto
    this.routeSub = this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProductDetails(this.productId);
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse de la suscripción a los parámetros de la ruta
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProductDetails(productId: number): void {
    // Cargar los detalles del producto utilizando ProductService
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
    // Habilitar el modo de edición
    this.isEditing = true;
  }

  cancelEditing(): void {
    // Cancelar el modo de edición y recargar los detalles del producto
    this.isEditing = false;
    this.loadProductDetails(this.productId);
  }

  saveProduct(): void {
    if (this.product) {
      // Guardar los cambios realizados en el producto utilizando ProductService
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
