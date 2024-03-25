/* Adjust the height of the ng-select dropdown panel */
.ng-dropdown-panel {
  max-height: 300px; /* Adjust this value to fit 6 items */
  overflow-y: auto; /* Enable vertical scrolling */
}

/* Style the ng-select search box */
.ng-select .ng-select-container .ng-value-container {
  align-items: center; /* Vertically center the search box content */
}

/* Additional styling for the ng-select component */
.ng-select .ng-select-container {
  border: 1px solid #ccc; /* Border color for the select container */
  border-radius: 4px; /* Rounded corners for the select container */
}

/* Styling for the ng-select items */
.ng-select .ng-option {
  padding: 10px; /* Spacing inside each dropdown item */
  /* Add any additional styling you want for each item */
}





#!/bin/bash

# The file containing the counts and filenames
input_file="/path/to/your/file.txt"

# The file where the updated counts and filenames will be stored
output_file="/path/to/your/updated_file.txt"

# Run the awk command to update the counts
awk '
  # Match lines ending with the specified patterns
  /(ESM EURO:|ESM ASIA:|ESM NAMR:)$/ {
    # Subtract 3 from the count on the previous line
    prev_line = $1 - 3
    # Print the updated count
    print prev_line
    # Print the current line (the description)
    print
    # Skip to the next record so we don't print the previous line at the end
    next
  }
  # Store the current line to be printed in the next cycle (if it's a count line)
  { prev_line = $0 }
' "$input_file" > "$output_file"

# Output the path to the updated file
echo "Updated counts written to: $output_file"


......


#!/bin/bash

# Define the files to update, read from the image or somewhere else
declare -A files_to_update=(["ESM EURO:"]=0 ["ESM ASIA:"]=0 ["ESM NAMR:"]=0)

# Read from the file and update counts
awk '
    # For lines that contain the filenames to be updated, hold the count
    /(ESM EURO:|ESM ASIA:|ESM NAMR:)/ {
        # Subtract 3 from the count
        $1 = $1 - 3

        # Remember the updated count for this filename
        counts[$2] = $1
    }
    # For all other lines, if they contain a filename we've updated, print the new count
    {
        if(counts[$2] != "") {
            print counts[$2] " " $2
        } else {
            print
        }
    }
' file_with_counts.txt > updated_file_with_counts.txt





awk -F ': ' '/file1.txt|file2.txt|file3.txt/{ $2=$2-3 }1 {print $1 ": " $2}' counts.txt > temp_counts.txt
awk -F ': ' '{if ($1 ~ /file1.txt|file2.txt|file3.txt/) $2=$2-3; print $1 ": " $2}' counts.txt > temp_counts.txt


import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

@Component({
  selector: 'my-app',
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
