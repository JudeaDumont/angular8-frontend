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
      val => {
        this.dataSource.data = val.appData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
  DataState = DataState
}

