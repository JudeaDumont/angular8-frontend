import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, startWith, map, catchError, of } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { Candidate } from './interface/candidate';
import { CandidateResponse } from './interface/candidate-response';
import { ServerService } from './service/server.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appState$: Observable<AppState<Candidate[]>>;
  title = 'sample-project';
  constructor(private serviceService: ServerService) {
  }

  dataSource = new MatTableDataSource<Candidate>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.appState$ = this.serviceService.candidates$
      .pipe(
        map(response => {
          return {
            dataState: DataState.LOADED,
            appData: response
          }
        }),
        startWith({ dataState: DataState.LOADING }),
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

