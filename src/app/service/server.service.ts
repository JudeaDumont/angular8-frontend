import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) { }

  server$ =
    <Observable<CustomResponse>>this.http.get<CustomResponse>
      (`${this.apiUrl}/api/v1/candidate`).pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  save$ = (server: Server) =>
    <Observable<CustomResponse>>this.http.post<CustomResponse>
      (`${this.apiUrl}/server/save`, server).pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  ping$ = (ipAddress: string) =>
    <Observable<CustomResponse>>this.http.get<CustomResponse>
      (`${this.apiUrl}/server/ping/${ipAddress}`).pipe(
        tap(console.log),
        catchError(this.handleError)
      );

      filter$ = (status: Status, response: CustomResponse) =>
        <Observable<CustomResponse>> new Observable<CustomResponse>(
          subscriber => {
            console.log(response);
            subscriber.next(
              status === Status.ALL ? 
              {...response, 
                message: `Servers filtered by ${status} status`}
              : {
                ...response,
                message: response.data.servers
                .filter(server => server.status === status)
                .length > 0 ?
                `Servers filtered by 
                ${status === Status.SERVER_UP ?
                  'SERVER UP' : 'SERVER DOWN'} 
                  status` :
                `No servers of ${status} found`,
                data: {
                  servers: response.data.servers.filter
                  (server => server.status === status)
                }
              }

            );
            subscriber.complete();
          }
        ).pipe(
            tap(console.log),
            catchError(this.handleError)
          );

  delete$ = (server: Server) =>
    <Observable<CustomResponse>>this.http.delete<CustomResponse>
      (`${this.apiUrl}/server/ping/delete/${server.id}`).pipe(
        tap(console.log),
        catchError(this.handleError)
      );


  deleteById$ = (id: string) =>
    <Observable<CustomResponse>>this.http.delete<CustomResponse>
      (`${this.apiUrl}/server/ping/delete/${id}`).pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError
    (`An error occurred - Error Code: ${error.status}`);

  }
}
