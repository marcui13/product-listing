import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../@services/product.service';
import { Product } from '../../@interfaces/product.interface';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const EXPECTED_PRODUCTS: Array<Product> = [
  {
    "id": 1,
    "title": "iPhone 9",
    "description": "An apple mobile which is nothing like apple",
    "price": 549,
    "discountPercentage": 12.96,
    "rating": 4.69,
    "stock": 94,
    "brand": "Apple",
    "category": "smartphones",
    "thumbnail": "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
    "images": [
      "https://cdn.dummyjson.com/product-images/1/1.jpg",
      "https://cdn.dummyjson.com/product-images/1/2.jpg",
      "https://cdn.dummyjson.com/product-images/1/3.jpg",
      "https://cdn.dummyjson.com/product-images/1/4.jpg",
      "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
    ]
  },
  {
    "id": 2,
    "title": "iPhone X",
    "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
    "price": 899,
    "discountPercentage": 17.94,
    "rating": 4.44,
    "stock": 34,
    "brand": "Apple",
    "category": "smartphones",
    "thumbnail": "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
    "images": [
      "https://cdn.dummyjson.com/product-images/2/1.jpg",
      "https://cdn.dummyjson.com/product-images/2/2.jpg",
      "https://cdn.dummyjson.com/product-images/2/3.jpg",
      "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg"
    ]
  },
  {
    "id": 3,
    "title": "Samsung Universe 9",
    "description": "Samsung's new variant which goes beyond Galaxy to the Universe",
    "price": 1249,
    "discountPercentage": 15.46,
    "rating": 4.09,
    "stock": 36,
    "brand": "Samsung",
    "category": "smartphones",
    "thumbnail": "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg",
    "images": [
      "https://cdn.dummyjson.com/product-images/3/1.jpg"
    ]
  },
  {
    "id": 4,
    "title": "OPPOF19",
    "description": "OPPO F19 is officially announced on April 2021.",
    "price": 280,
    "discountPercentage": 17.91,
    "rating": 4.3,
    "stock": 123,
    "brand": "OPPO",
    "category": "smartphones",
    "thumbnail": "https://cdn.dummyjson.com/product-images/4/thumbnail.jpg",
    "images": [
      "https://cdn.dummyjson.com/product-images/4/1.jpg",
      "https://cdn.dummyjson.com/product-images/4/2.jpg",
      "https://cdn.dummyjson.com/product-images/4/3.jpg",
      "https://cdn.dummyjson.com/product-images/4/4.jpg",
      "https://cdn.dummyjson.com/product-images/4/thumbnail.jpg"
    ]
  },
  {
    "id": 5,
    "title": "Huawei P30",
    "description": "Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.",
    "price": 499,
    "discountPercentage": 10.58,
    "rating": 4.09,
    "stock": 32,
    "brand": "Huawei",
    "category": "smartphones",
    "thumbnail": "https://cdn.dummyjson.com/product-images/5/thumbnail.jpg",
    "images": [
      "https://cdn.dummyjson.com/product-images/5/1.jpg",
      "https://cdn.dummyjson.com/product-images/5/2.jpg",
      "https://cdn.dummyjson.com/product-images/5/3.jpg"
    ]
  }
];

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProductsByCategory',
      'getPaginatedProducts'
    ]);

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba para verificar que el filtrado por categoría funciona y se restablece a la página uno
  it('should filter products by category and reset to page one', () => {
    const category = 'smartphones';
    productServiceSpy.getProductsByCategory.and.returnValue(of({ products: EXPECTED_PRODUCTS, total: EXPECTED_PRODUCTS.length }));

    // Act
    component.filterByCategory(category);

    // Assert
    expect(component.currentPageIndex).toBe(0);
    expect(productServiceSpy.getProductsByCategory).toHaveBeenCalledWith(category, 1, component.currentPageSize);
    expect(component.dataSource.data).toEqual(EXPECTED_PRODUCTS);
  });

  // Prueba para verificar que la conversión de moneda se realiza correctamente
  it('should convert product prices based on the selected currency', () => {
    const usdPrice = 100;
    const eurPrice = usdPrice * 1.08; // Ejemplo de tasa de conversión USD a EUR
    component.currentCurrency = 'EUR';
    component.originalPrices = { 1: usdPrice };
    component.dataSource.data = [{
      id: 1,
      title: 'iPhone 9',
      price: usdPrice,
      description: 'An apple mobile which is nothing like apple',
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
      images: [
        'https://cdn.dummyjson.com/product-images/1/1.jpg',
        'https://cdn.dummyjson.com/product-images/1/2.jpg',
        'https://cdn.dummyjson.com/product-images/1/3.jpg',
        'https://cdn.dummyjson.com/product-images/1/4.jpg',
        'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
      ]
    }];

    // Act
    component.convertPrices();

    // Assert
    expect(component.dataSource.data[0].price).toBeCloseTo(eurPrice, 2);
  });

  // Prueba para verificar la búsqueda de productos por nombre utilizando getPaginatedProducts
  it('should search products by name using getPaginatedProducts', () => {
    const searchQuery = 'iPhone';
    const expectedSearchResults: Product[] = EXPECTED_PRODUCTS.filter(product => product.title.includes(searchQuery));

    // Simula la respuesta de getPaginatedProducts con el resultado de búsqueda esperado
    productServiceSpy.getPaginatedProducts.and.returnValue(of({ products: expectedSearchResults, total: expectedSearchResults.length }));

    // Act
    component.searchProductsByName(searchQuery);

    // Assert
    expect(productServiceSpy.getPaginatedProducts).toHaveBeenCalledWith(1, component.currentPageSize, searchQuery);
    expect(component.dataSource.data).toEqual(expectedSearchResults);
  });
});
