import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AppService } from '../services/app.service';
import { LogService } from '../services/log.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private httpBackend: HttpBackend,
    private authService: AuthService,
    private appService: AppService,
    private logService: LogService
  ) {
    this.http = new HttpClient(httpBackend);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.logService.addData('User is not authenticated');
          // Optionally, redirect to login page or handle re-authentication
          return throwError(err);
        }

        // Validate the user's group before proceeding
        return this.authService.validateFunctionalGroup().pipe(
          switchMap(isAuthorized => {
            if (isAuthorized) {
              return next.handle(req);
            } else {
              this.logService.addData('User is not authorized');
              return throwError({ status: 403, message: 'User is not authorized' });
            }
          }),
          catchError(groupError => {
            this.logService.addData(`Group validation error: ${groupError.message}`);
            return throwError(groupError);
          })
        );
      })
    );
  }
}
