import pandas as pd
import xml.etree.ElementTree as ET
from zipfile import ZipFile
import os

# Read the Excel file
df = pd.read_excel('/path/to/your/excel.xlsx')

# Create a directory for XML files if it doesn't exist
xml_dir = 'xml_files'
os.makedirs(xml_dir, exist_ok=True)

# Function to convert a dataframe row to an XML file
def row_to_xml(row):
    # Create the XML elements here according to your structure
    root = ET.Element('root')
    # Example: ET.SubElement(root, 'child').text = str(row['column_name'])
    return ET.tostring(root, encoding='unicode')

# Iterate over the dataframe rows
for index, row in df.iterrows():
    xml_content = row_to_xml(row)
    xml_file_path = os.path.join(xml_dir, f'row_{index}.xml')
    with open(xml_file_path, 'w') as file:
        file.write(xml_content)

# Zip the XML files
with ZipFile('/path/to/your/xml_files.zip', 'w') as zipf:
    for root, dirs, files in os.walk(xml_dir):
        for file in files:
            zipf.write(os.path.join(root, file))

# Remove the XML directory if you don't need it anymore
# shutil.rmtree(xml_dir)



<!-- Column Selectors for Comparison -->
<select [(ngModel)]="selectedColumnCurrent" (change)="updateChart()">
  <option *ngFor="let col of columnDefs" [ngValue]="col.field">{{ col.headerName }} (Current)</option>
</select>

<select [(ngModel)]="selectedColumnPrevious" (change)="updateChart()">
  <option *ngFor="let col of columnDefs" [ngValue]="col.field">{{ col.headerName }} (Previous)</option>
</select>

<!-- ApexCharts Component -->
<apx-chart [series]="chartSeries" [chart]="chartOptions" [xaxis]="chartXaxis"></apx-chart>

<!-- Download Button -->
<button (click)="downloadCSV()">Download CSV</button>


export class YourComponent {
  selectedColumnCurrent: string;
  selectedColumnPrevious: string;
  rowData3: any[]; // Your data array
  columnDefs: any[]; // Your column definitions array
  chartOptions: any; // ApexCharts options
  chartSeries: any[];
  chartXaxis: any;

  constructor() {
    // Initialize your chart options here
    this.chartOptions = {
      // ...
    };
    this.chartXaxis = {
      // ...
    };
  }

  updateChart() {
    if (this.selectedColumnCurrent && this.selectedColumnPrevious) {
      this.chartSeries = [
        {
          name: 'Current',
          data: this.rowData3.map(row => row[this.selectedColumnCurrent])
        },
        {
          name: 'Previous',
          data: this.rowData3.map(row => row[this.selectedColumnPrevious])
        }
      ];

      this.chartXaxis = {
        categories: this.rowData3.map(row => row['Service Name'])
      };
    }
  }

  downloadCSV() {
    // Implement CSV download logic as previously described
  }
}







  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [rowData]="rowData"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowSelection]="rowSelection"
    [suppressRowClickSelection]="true"
    [pagination]="true"
    [paginationPageSize]="paginationPageSize"
    [paginationPageSizeSelector]="paginationPageSizeSelector"
    [class]="themeClass"
  ></ag-grid-angular>`,
})
export class AppComponent {
  public rowData: any[] | null = [
    {
      make: 'Tesla',
      model: 'Model Y',
      price: 64950,
      electric: true,
      month: 'June',
    },
    {
      make: 'Ford',
      model: 'F-Series',
      price: 33850,
      electric: false,
      month: 'October',
    },
    {
      make: 'Toyota',
      model: 'Corolla',
      price: 29600,
      electric: false,
      month: 'August',
    },
    {
      make: 'Mercedes',
      model: 'EQA',
      price: 48890,
      electric: true,
      month: 'February',
    },
    {
      make: 'Fiat',
      model: '500',
      price: 15774,
      electric: false,
      month: 'January',
    },
    {
      make: 'Nissan',
      model: 'Juke',
      price: 20675,
      electric: false,
      month: 'March',
    },
    {
      make: 'Vauxhall',
      model: 'Corsa',
      price: 18460,
      electric: false,
      month: 'July',
    },
    {
      make: 'Volvo',
      model: 'EX30',
      price: 33795,
      electric: true,
      month: 'September',
    },
    {
      make: 'Mercedes',
      model: 'Maybach',
      price: 175720,
      electric: false,
      month: 'December',
    },
    {
      make: 'Vauxhall',
      model: 'Astra',
      price: 25795,
      electric: false,
      month: 'April',
    },
    {
      make: 'Fiat',
      model: 'Panda',
      price: 13724,
      electric: false,
      month: 'November',
    },
    {
      make: 'Jaguar',
      model: 'I-PACE',
      price: 69425,
      electric: true,
      month: 'May',
    },
  ];
  public columnDefs: ColDef[] = [
    {
      field: 'make',
      checkboxSelection: true,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [
          'Tesla',
          'Ford',
          'Toyota',
          'Mercedes',
          'Fiat',
          'Nissan',
          'Vauxhall',
          'Volvo',
          'Jaguar',
        ],
      },
    },
    { field: 'model' },
    { field: 'price', filter: 'agNumberColumnFilter' },
    { field: 'electric' },
    {
      field: 'month',
      comparator: (valueA, valueB) => {
        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const idxA = months.indexOf(valueA);
        const idxB = months.indexOf(valueB);
        return idxA - idxB;
      },
    },
  ];
  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 500;
  public paginationPageSizeSelector: number[] | boolean = [200, 500, 1000];
  public themeClass: string =
    "ag-theme-quartz";
}

const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
