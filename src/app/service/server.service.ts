import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, share, tap, throwError } from 'rxjs';
import { Candidate } from '../interface/candidate';
import { CandidateResponse } from '../interface/candidate-response';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) { }

  candidates$ =
    <Observable<CandidateResponse>>this.http.get<CandidateResponse>
      (`${this.apiUrl}/api/v1/candidate`).pipe(
        first(),
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

  save$ = (candidate: Candidate) => 
    <Observable<number>>this.http.post<number>
      (`${this.apiUrl}/api/v1/candidate/saveReturnID`, candidate)
      .pipe(
        share(), //required to not duplicate requests per subscription
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ = (candidate: Candidate) =>
    <Observable<number>>this.http.delete<number>
      (`${this.apiUrl}/api/v1/candidate/${candidate.id}`).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );


  deleteById$ = (id: string) =>
    <Observable<CandidateResponse>>this.http.delete<CandidateResponse>
      (`${this.apiUrl}/api/v1/candidate/delete/${id}`).pipe(
        //tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError
      (`An error occurred - Error Code: ${error.status}`);

  }
}
