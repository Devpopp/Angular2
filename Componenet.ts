import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public columnDefs;
  public rowData;

  constructor() { }

  ngOnInit() {
    this.initializeData();
  }

  async initializeData() {
    const headers = ['Mar-24', 'Feb-24', 'Jan-24']; // Example headers
    const data = [
      { 'Jan-24': 100, 'Feb-24': 200, 'Mar-24': 300 },
      { 'Jan-24': 110, 'Feb-24': 210, 'Mar-24': 310 }
    ]; // Example data rows

    const sortedHeaders = this.sortHeadersByMonths(headers);
    this.columnDefs = this.generateColumnDef(sortedHeaders);
    this.rowData = this.alignDataToSortedHeaders(data, sortedHeaders);
  }

  sortHeadersByMonths(headers: string[]) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return headers.sort((a, b) => {
      const [monthA, yearA] = a.split('-');
      const [monthB, yearB] = b.split('-');
      const yearComparison = parseInt(yearA, 10) - parseInt(yearB, 10);
      return yearComparison !== 0 ? yearComparison : months.indexOf(monthA) - months.indexOf(monthB);
    });
  }

  generateColumnDef(headers: string[]) {
    return headers.map(header => ({ headerName: header, field: header }));
  }

  alignDataToSortedHeaders(data: any[], sortedHeaders: string[]) {
    return data.map(row => {
      const newRow = {};
      sortedHeaders.forEach(header => {
        newRow[header] = row[header];
      });
      return newRow;
    });
  }
}
