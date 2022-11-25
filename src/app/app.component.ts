import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { Candidate } from './interface/candidate';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appState$: Observable<AppState<Candidate[]>>;
  clientsideCachedCandidates = [];
  title = 'sample-project';
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<Candidate[]>(null);

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
          this.dataSubject.next(response.data.candidates);
          return {
            dataState: DataState.LOADED,
            appData: response.data.candidates
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
      val => {
        this.dataSource.data = val.appData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
  DataState = DataState;

  filterCandidates(name: string): void {
    this.appState$ = this.serviceService
      .filter$(name, this.clientsideCachedCandidates)
      .pipe(
        map(candidates => {
          this.dataSubject.next(candidates);
          return {
            dataState: DataState.LOADED,
            appData: candidates
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
  }

  refreshMatTable() {
    this.appState$.subscribe(val => {
      this.dataSource.data = val.appData;
    });
  }
}

