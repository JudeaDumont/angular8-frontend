import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CandidateResponse } from '../interface/candidate-response';
import { Candidate } from '../interface/candidate';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) { }

  candidates$ =
    <Observable<CandidateResponse>>this.http.get<CandidateResponse>
      (`${this.apiUrl}/api/v1/candidate`).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );

  save$ = (server: Candidate) =>
    <Observable<CandidateResponse>>this.http.post<CandidateResponse>
      (`${this.apiUrl}/server/save`, server).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );

  ping$ = (ipAddress: string) =>
    <Observable<CandidateResponse>>this.http.get<CandidateResponse>
      (`${this.apiUrl}/server/ping/${ipAddress}`).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );

  filter$ = (name: string, candidates: Candidate[]) =>
    <Observable<Candidate[]>>new Observable<Candidate[]>(
      subscriber => {
        subscriber.next(
          candidates.filter(candidate => candidate.name.includes(name))
        );
        subscriber.complete();
      }
    ).pipe(
      //tap(console.log),
      catchError(this.handleError)
    );

  delete$ = (candidate: Candidate) =>
    <Observable<CandidateResponse>>this.http.delete<CandidateResponse>
      (`${this.apiUrl}/candidate/ping/delete/${candidate.id}`).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );


  deleteById$ = (id: string) =>
    <Observable<CandidateResponse>>this.http.delete<CandidateResponse>
      (`${this.apiUrl}/candidate/ping/delete/${id}`).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError
      (`An error occurred - Error Code: ${error.status}`);

  }
}
