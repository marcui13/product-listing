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
  public dataSource: MatTableDataSource<Product>;
  public displayedColumns: string[] = ['name', 'brand', 'price', 'stock', 'rating', 'actions'];
  public currentCurrency: 'USD' | 'EUR' = 'USD';
  public currentPageSize: number = 10;
  public productsArray: Array<Product> = [];
  public originalPrices: { [key: number]: number } = {};

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
    this.currentCurrency = this.retrieveSavedCurrency();
    this.getProducts();
    this.getAllProducts();
  }

  /*****************************************/
  /******** retrieveSavedCurrency **********/
  /*****************************************/
  retrieveSavedCurrency(): 'USD' | 'EUR' {
    // Recupera la moneda guardada en localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency === 'USD' || savedCurrency === 'EUR') {
        return savedCurrency as 'USD' | 'EUR';
    }
    // Si no hay moneda guardada, se retorna la moneda predeterminada ('USD')
    return 'USD';
  }

  /*****************************************/
  /******** getProducts ********************/
  /*****************************************/
  getProducts(): void {
    this.productService.getProducts(this.currentPageIndex + 1, this.currentPageSize)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.products;
          this.saveOriginalPrices();
          this.convertPrices();
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
          this.productsArray = response;
        },
        error: (error) => {
          console.error('Error fetching all products:', error);
        }
      });
  }

  /*****************************************/
  /******* saveOriginalPrices **************/
  /*****************************************/
  saveOriginalPrices(): void {
    // Guarda los precios originales
    this.dataSource.data.forEach(product => {
      if (!(product.id in this.originalPrices)) {
        this.originalPrices[product.id] = product.price;
      }
    });
  }

  /*****************************************/
  /******** applyFilter ********************/
  /*****************************************/
  applyFilter(event: Event): void {
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
    // Guarda la moneda seleccionada en localStorage
    localStorage.setItem('selectedCurrency', newCurrency);
    this.convertPrices();
  }

  /*****************************************/
  /******** convertPrices ******************/
  /*****************************************/
  convertPrices(): void {
    const conversionRate = this.currentCurrency === 'EUR' ? 0.93 : 1;
    // Aplica la tasa de conversión a los precios originales
    this.dataSource.data.forEach((product) => {
      product.price = this.originalPrices[product.id] * conversionRate;
    });
  }

  /*****************************************/
  /****** viewProductDetails ***************/
  /*****************************************/
  viewProductDetails(productId: number): void {
    this.productService.getProductDetails(productId)
      .subscribe(res => {
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
