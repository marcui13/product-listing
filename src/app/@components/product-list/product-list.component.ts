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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// SERVICES
import { ProductService } from '../../@services/product.service';
// INTERFACES
import { Product } from '../../@interfaces/product.interface';
// COMPONENTS
import { ProductDetailComponent } from '../product-detail/product-detail.component';
// HELPERS
import { CurrencyHelper } from '../../@helpers/currency.helper';

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
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [
    CurrencyHelper
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent implements OnInit {
  public dataSource: MatTableDataSource<Product>;
  public displayedColumns: string[] = ['thumbnail', 'name', 'brand', 'price', 'stock', 'rating', 'actions'];
  public currentCurrency: 'USD' | 'EUR' = 'USD';
  public currentPageSize: number = 10;
  public originalPrices: { [key: number]: number } = {};
  public categories: string[] = [];
  public selectedCategory: string = 'All';

  private currentPageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog,
    private currencyHelper: CurrencyHelper
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
    this.loadCategories();
  }

  /*****************************************/
  /******** retrieveSavedCurrency **********/
  /*****************************************/
  retrieveSavedCurrency(): 'USD' | 'EUR' {
    return this.currencyHelper.retrieveSavedCurrency();
  }

  /*****************************************/
  /******** getProducts ********************/
  /*****************************************/
  getProducts(): void {
    if (this.selectedCategory === 'All') {
      this.productService.getProducts(this.currentPageIndex + 1, this.currentPageSize).subscribe({
        next: (response) => {
          this.dataSource.data = response.products;
          this.saveOriginalPrices();
          this.convertPrices();
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
    } else {
      this.productService.getProductsByCategory(this.selectedCategory, this.currentPageIndex + 1, this.currentPageSize).subscribe({
        next: (response) => {
          this.dataSource.data = response.products;
          this.saveOriginalPrices();
          this.convertPrices();
        },
        error: (error) => {
          console.error('Error fetching products by category:', error);
        }
      });
    }
  }

  /*****************************************/
  /******* getAllProducts ******************/
  /*****************************************/
  getAllProducts(): void {
    this.productService.getAllProducts()
      .subscribe({
        next: (response) => {
          this.dataSource.data = response;
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
    this.currencyHelper.saveCurrency(this.currentCurrency);
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

  /*****************************************/
  /******** openProductDetailDialog ********/
  /*****************************************/
  openProductDetailDialog(productId: number): void {
    this.dialog.open(ProductDetailComponent, {
      data: {
        productId: productId
      }
    });
  }

  /*****************************************/
  /******** loadCategories *****************/
  /*****************************************/
  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  /*****************************************/
  /******** filterByCategory ***************/
  /*****************************************/
  filterByCategory(category: string): void {
    if (category === 'All') {
      this.getAllProducts();
    } else {
      this.productService.getProductsByCategory(category, this.currentPageIndex + 1, this.currentPageSize).subscribe({
        next: (response) => {
          this.dataSource.data = response.products;
        },
        error: (error) => {
          console.error('Error fetching products by category:', error);
        }
      });
    }
  }
}
