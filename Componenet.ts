// Custom sorter to sort by month and year in the "Mon-YY" format
function customDateSorter(params) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const value1 = params.value1;
    const value2 = params.value2;
    const year1 = parseInt(value1.split('-')[1], 10);
    const year2 = parseInt(value2.split('-')[1], 10);
    const month1 = months.indexOf(value1.split('-')[0]);
    const month2 = months.indexOf(value2.split('-')[0]);

    if (year1 !== year2) {
        return year1 - year2; // Sort by year first
    } else {
        return month1 - month2; // Then sort by month
    }
}

const columnDefs = [
    { 
        headerName: 'Month-Year', 
        field: 'monthYearField',
        sortable: true,
        comparator: customDateSorter
    },
    // other column definitions
];

// Set the columnDefs in your grid options
const gridOptions = {
    columnDefs: columnDefs,
    // other grid options
};
