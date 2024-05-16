// src/app/app.component.ts
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<h1>{{ title }}</h1>
             <button (click)="fetchData()">Fetch Data</button>`
})
export class AppComponent {
  title = 'frontend';

  constructor(private http: HttpClient) {}

  fetchData() {
    this.http.get('/api').subscribe(data => {
      console.log(data);
    });
  }
}


