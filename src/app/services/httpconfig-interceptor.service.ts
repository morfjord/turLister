//httpConfig.interceptor.ts
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from './api.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  // loaderToShow: any;
  constructor(
    public loadingController: LoadingController,
    private apiService: ApiService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = this.apiService.getUserValue();
    const token = "my-token-string-from-server";
    // if (currentUser && currentUser.token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authentication: `Bearer ${currentUser.token}`
    //     }
    //   });
    // }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });
    this.showLoader();
    return next.handle(request).pipe(
      finalize(() => this.hideLoader()),
      catchError((error: HttpErrorResponse) => {
        this.hideLoader();
        return throwError(error);
      })
    );

    //Authentication by setting header with token value
    if (token) {
      request = request.clone({
        setHeaders: {
          // 'Authorization': token
        }
      });
    }


    this.showLoader();
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
        }
        this.hideLoader();
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.hideLoader();
        return throwError(error);
      }));
  }

  async showLoader() {
    let loaderToShow = await this.loadingController.create({
      message: 'Vennligst vent...'
    });
    await loaderToShow.present()
    const { role, data } = await loaderToShow.onDidDismiss();
    console.log('Loading dismissed!');
    this.hideLoader();
  }

  async hideLoader() {
    this.loadingController.dismiss();
  }
}