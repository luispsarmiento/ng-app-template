import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandler } from '../models/http.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  protected handleError(err: HttpErrorResponse){
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorHandler: HttpErrorHandler = {
      type: 'on-server',
    };
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorHandler.type = 'on-client';
        errorMessage = `${err.error.message}`;
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `${err.message}`;
    }
    errorHandler.errorMessage = errorMessage;
    
    return throwError(errorHandler);
  }
}
