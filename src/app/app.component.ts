import { Component } from '@angular/core';
import { Observable, startWith, map, catchError, of } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { CandidateResponse } from './interface/candidate-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appState$: Observable<AppState<CandidateResponse>>;
  constructor(private serviceService: ServerService){
  }
  
  ngOnInit(): void {
    this.appState$ = this.serviceService.server$
    .pipe(
      map(response => {
        return { dataState: DataState.LOADED, 
          appData: response}
      }),
      startWith({ dataState: DataState.LOADING}),
      catchError((error:string)=>{
        console.log(error);
        return of({dataState: DataState.ERROR, error: error})
      })
    );
  }
  title = 'sample-project';
}

