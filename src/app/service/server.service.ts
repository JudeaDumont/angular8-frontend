import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interface/custom-response';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'any';
  constructor(private http: HttpClient) { }

  server$ = this.http.get<CustomResponse>
       (`${this.apiUrl}`).pipe(
        tap(console.log),
        catchError(this.handleError)
      );

      handleError(handleError: any): Observable<never> {
        return throwError('Method not implemented.');
      }
}
