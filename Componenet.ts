import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getToken() {
    return localStorage.getItem('bamToken');
  }

  validateFunctionalGroup(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      console.log('No token found. User is not authorized.');
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/validate-group`, { headers }).pipe(
      map((response: any) => response.isAuthorized),
      catchError(error => {
        console.error('Validation error:', error);
        return of(false);
      })
    );
  }
}
