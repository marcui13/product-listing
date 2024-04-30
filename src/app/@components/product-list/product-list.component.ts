// ANGULAR
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// ANGULAR MATERIAL
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
// SERVICES
import { ProductService } from '../../@services/product.service';
// INTERFACES
import { Product } from '../../@interfaces/product.interface';

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
  displayedColumns: string[] = ['name', 'brand', 'price', 'stock', 'rating', 'actions'];
  currentCurrency: 'USD' | 'EUR' = 'USD';
  currentPageSize: number = 10;
  productsArray: Array<Product> = [];

  private currentPageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Product>();
  }

  /*****************************************/
  /******** ngOnInit ***********************/
  /*****************************************/
  ngOnInit(): void {
    this.getProducts();
    this.getAllProducts();
  }

  /*****************************************/
  /******** getProducts ********************/
  /*****************************************/
  getProducts(): void {
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

  /*****************************************/
  /******* getAllProducts ******************/
  /*****************************************/
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

  /*****************************************/
  /******** applyFilter ********************/
  /*****************************************/
  applyFilter(event: Event): void {
    console.log(event);
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  /*****************************************/
  /******** changePage *********************/
  /*****************************************/
  changePage(event: any): void {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.getProducts();
  }

  /*****************************************/
  /******** onCurrencyChange ***************/
  /*****************************************/
  onCurrencyChange(newCurrency: 'USD' | 'EUR'): void {
    this.currentCurrency = newCurrency;
    this.convertPrices();
  }

  /*****************************************/
  /******** convertPrices ******************/
  /*****************************************/
  convertPrices(): void {
    const conversionRate = this.currentCurrency === 'EUR' ? 1.08 : 1;
    this.dataSource.data.forEach((product) => {
      product.price *= conversionRate;
    });
  }

  /*****************************************/
  /****** viewProductDetails ***************/
  /*****************************************/
  viewProductDetails(productId: number): void {
    console.log(`Ver detalles del producto ${productId}`);
    this.productService.getProductDetails(productId)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['/product', productId]);
      });
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
