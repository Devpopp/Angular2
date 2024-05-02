import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public columnDefs;
  public rowData;

  constructor() {
    // Constructor stays clean of initialization logic
  }

  ngOnInit() {
    this.initializeData();
  }

  async initializeData() {
    const headers = ['Mar-24', 'Feb-24', 'Jan-24']; // Simulated headers fetched from backend
    const data = [
      { 'Jan-24': 100, 'Feb-24': 200, 'Mar-24': 300 },
      { 'Jan-24': 110, 'Feb-24': 210, 'Mar-24': 310 }
    ]; // Simulated data rows

    const sortedHeaders = this.sortHeadersByMonth(headers);
    this.columnDefs = this.generateColumnDefinitions(sortedHeaders);
    this.rowData = data;
  }

  sortHeadersByMonth(headers: string[]) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return headers.sort((a, b) => {
      const [monthA, yearA] = a.split('-');
      const [monthB, yearB] = b.split('-');
      const yearComparison = parseInt(yearA) - parseInt(yearB);
      if (yearComparison !== 0) return yearComparison;
      return months.indexOf(monthA) - months.indexOf(monthB);
    });
  }

  generateColumnDefinitions(headers: string[]) {
    return headers.map(header => ({
      headerName: header,
      field: header
    }));
  }
}
