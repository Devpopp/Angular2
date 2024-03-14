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
