import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../@interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly BASE_URL = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) { }

  // Obtener la lista de productos con paginación, filtrado y selección
  getProducts(page: number, limit: number, search?: string, category?: string, select?: string): Observable<{ products: Product[], total: number }> {
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

  getAllProducts(): Observable<Product[]> {
    const url = `${this.BASE_URL}?limit=0`;
    return this.http.get<{ products: Product[] }>(url).pipe(
      map(response => response.products), // Extrae la lista de productos de la respuesta
      catchError(this.handleError)
    );
  }

  // Obtener los detalles de un producto específico por ID
  getProductDetails(productId: number): Observable<Product> {
    const url = `${this.BASE_URL}/${productId}`;
    return this.http.get<Product>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Añadir un nuevo producto (simulado)
  addProduct(newProduct: Partial<Product>): Observable<Product> {
    const url = `${this.BASE_URL}/add`;
    return this.http.post<Product>(url, newProduct).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un producto específico por ID (simulado)
  updateProduct(productId: number, updatedProduct: Partial<Product>): Observable<Product> {
    const url = `${this.BASE_URL}/${productId}`;
    return this.http.put<Product>(url, updatedProduct).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un producto específico por ID (simulado)
  deleteProduct(productId: number): Observable<Product> {
    const url = `${this.BASE_URL}/${productId}`;
    return this.http.delete<Product>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Manejar errores en las solicitudes HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Errores del cliente
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Errores del servidor
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
