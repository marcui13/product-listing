// ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// LIBRARIES
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// INTERFACES
import { Product } from '../@interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly BASE_URL = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) { }

  /*****************************************/
  /******** getAllProducts *****************/
  /*****************************************/
  getAllProducts(): Observable<Product[]> {
    const url = `${this.BASE_URL}?limit=0`;
    return this.http.get<{ products: Product[] }>(url).pipe(
      map(response => response.products),
      catchError(this.handleError)
    );
  }

  /*****************************************/
  /******** getPaginatedProducts ***********/
  /*****************************************/
  getPaginatedProducts(page: number, limit: number, search?: string, category?: string, select?: string): Observable<{ products: Product[], total: number }> {
    let url = `${this.BASE_URL}?skip=${(page - 1) * limit}&limit=${limit}`;

    // Añadir búsqueda por nombre
    if (search) {
      url += `&q=${search}`;
    }

    // Añadir filtrado por categoría
    if (category) {
      url = `${this.BASE_URL}/category/${category}?skip=${(page - 1) * limit}&limit=${limit}`;
    }

    // Añadir selección de campos específicos
    if (select) {
      url += `&select=${select}`;
    }

    return this.http.get<{ products: Product[], total: number }>(url).pipe(
      catchError(this.handleError)
    );
  }

  /*****************************************/
  /******** getProductDetails **************/
  /*****************************************/
  getProductDetails(productId: number): Observable<Product> {
    const url = `${this.BASE_URL}/${productId}`;
    return this.http.get<Product>(url).pipe(
      catchError(this.handleError)
    );
  }

  /*****************************************/
  /******** updateProduct ******************/
  /*****************************************/
  updateProduct(productId: number, update: Partial<Product>): Observable<Product> {
    const url = `${this.BASE_URL}/${productId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Product>(url, update, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /*****************************************/
  /******** getAllCategories ***************/
  /*****************************************/
  getAllCategories(): Observable<string[]> {
    const url = `${this.BASE_URL}/categories`;
    return this.http.get<string[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /*****************************************/
  /******** getProductsByCategory **********/
  /*****************************************/
  getProductsByCategory(category: string, page: number, limit: number): Observable<{ products: Product[], total: number }> {
    const skip = (page - 1) * limit;
    const url = `${this.BASE_URL}/category/${category}?skip=${skip}&limit=${limit}`;
    return this.http.get<{ products: Product[], total: number }>(url).pipe(
      catchError(this.handleError)
    );
  }

  /*****************************************/
  /******** handleError ********************/
  /*****************************************/
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
