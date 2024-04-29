// ANGULAR
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// ANGULAR MATERIAL
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// SERVICES
import { ProductService } from '../../@services/product.service';
// INTERFACES
import { Product } from '../../@interfaces/product.interface';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent implements OnInit {
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['thumbnail', 'name', 'brand', 'price', 'stock', 'rating', 'actions'];
  currentCurrency: 'USD' | 'EUR' = 'USD';
  currentPageSize: number = 10;
  productsArray: Array<Product> = [];

  private currentPageIndex: number = 0; // Track page index

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Product>();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getAllProducts();
  }

  getProducts(): void {
    // Obtener la lista de productos con paginación
    this.productService.getProducts(this.currentPageIndex + 1, this.currentPageSize)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.dataSource.data = response.products;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
  }

  getAllProducts() {
    this.productService.getAllProducts()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.productsArray = response;
        },
        error: (error) => {
          console.error('Error fetching all products:', error);
        }
      });
  }

  applyFilter(event: Event): void {
    console.log(event);
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  changePage(event: any): void {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.getProducts(); // Vuelve a obtener los productos con los nuevos parámetros de paginación
  }

  onCurrencyChange(newCurrency: 'USD' | 'EUR'): void {
    this.currentCurrency = newCurrency;
    this.convertPrices();
  }

  convertPrices(): void {
    const conversionRate = this.currentCurrency === 'EUR' ? 1.08 : 1;
    this.dataSource.data.forEach((product) => {
      product.price *= conversionRate;
    });
  }

  viewProductDetails(productId: number): void {
    // Lógica para navegar a la página de detalles del producto
    console.log(`Ver detalles del producto ${productId}`);
    this.productService.getProductDetails(productId)
      .subscribe(res => {
        console.log(res);
        // Redirige a la página de detalles del producto con el ID especificado
        this.router.navigate(['/product', productId]);
      });
    // Aquí podrías redirigir a la ruta de detalles del producto con Router.navigate()
  }

  getNameColor(stock: number): string {
    if (stock === 0) {
      return 'red';
    } else if (stock < 50) {
      return 'yellow';
    }
    return 'blue';
  }
}
