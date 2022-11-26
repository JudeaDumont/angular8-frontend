import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { Candidate } from './interface/candidate';
import { CandidateResponse } from './interface/candidate-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appState$: Observable<AppState<CandidateResponse>>;
  clientsideCachedCandidates = [];
  title = 'sample-project';
  private dataSubject = new BehaviorSubject<CandidateResponse>(null);
  private isLoading = new BehaviorSubject<Boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serviceService: ServerService) {
  }

  dataSource = new MatTableDataSource<Candidate>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.appState$ = this.serviceService.candidates$
      .pipe(
        map(response => {
          this.clientsideCachedCandidates = response.data.candidates;
          this.dataSubject.next(response);
          return {
            dataState: DataState.LOADED,
            appData: response
          }
        }),
        startWith(
          {
            dataState: DataState.LOADING,
            appData: this.dataSubject.value
          }),
        catchError((error: string) => {
          console.log(error);
          return of({ dataState: DataState.ERROR, error: error })
        })
      );

    this.appState$.subscribe(
      state => {
        this.dataSource.data = state.appData?.data.candidates;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
  DataState = DataState;

  refreshMatTable() {
    this.appState$.subscribe(val => {
      this.dataSource.data = val.appData.data.candidates;
    });
  }

  filterCandidates(name: string): void {

    //the theory is that null state errors arise out of async
    //high probability of being correct^ 
    //as illustrated by proper behavior of below code
    this.appState$.subscribe(state => {
      this.appState$ = this.serviceService
        .filter$(name, this.clientsideCachedCandidates)
        .pipe(
          map(candidates => {
            this.dataSubject.next({
              ...state.appData,
              data: {
                candidates: candidates
              }
            });
            return {
              dataState: DataState.LOADED,
              appData: {
                ...state.appData,
                data: {
                  candidates: candidates
                }
              }
            }
          }),
          startWith(
            {
              dataState: DataState.LOADING,
              appData: this.dataSubject.value
            }),
          catchError((error: string) => {
            console.log(error);
            return of({ dataState: DataState.ERROR, error: error })
          })
        );
      this.refreshMatTable();
    });
  }
  saveCandidate(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ =
      this.serviceService.save$(serverForm.value as Candidate)
        .pipe(
          map(response => {
            this.dataSubject.next(
              {
                //...state.appData, //this will fold in old state, i.e. appState being null during loading ;)
                ...this.dataSubject.value,
                data: {
                  candidates: [
                    {
                      name: (serverForm.value as Candidate).name,
                      id: response
                    },
                    ...this.dataSubject.value.data.candidates
                  ]
                  .filter(  //deduplicate, initializing with new Set does not deduplicate
                    (value, index, self) =>
                      index === self.findIndex((t) => (
                        t.id === value.id && t.name === value.name
                      )))
                }
              }
            );
            this.isLoading.next(false);
            return {
              dataState: DataState.LOADED,
              appData: this.dataSubject.value
            }
          }),
          startWith({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value
          }),
          catchError((error: string) => {
            console.log(error);
            return of({
              dataState: DataState.ERROR,
              error: error
            });
          })
        )
    this.refreshMatTable();
  }
}

