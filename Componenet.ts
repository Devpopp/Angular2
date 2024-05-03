// Custom sorter to sort by month and year in the "Mon-YY" format
import pandas as pd

# Sample DataFrame setup
data = {
    'ServiceName': ['Service A', 'Service B', 'Service C'],
    'Exp.-Yearly': [100000, 200000, 300000],
    'Forecast': [110000, 210000, 310000],
    'Actual&Forecast': [105000, 205000, 305000],
    'Actual vs Forecast': [5000, 5000, 5000],
    'Percentage change': [5, 5, 5],
    'Jan-24': [100, 200, 300],
    'May-24': [150, 250, 350],
    'Nov-24': [130, 230, 330],
    'Oct-24': [120, 220, 320],
    'Sep-24': [110, 210, 310],
    'Dec-24': [160, 260, 360],
    'Feb-24': [140, 240, 340],
    'Jul-24': [180, 280, 380],
    'Aug-24': [170, 270, 370]
}

df = pd.DataFrame(data)

# Sorting function that doesn't rely on pd.to_datetime
def custom_sort(col):
    month, year = col.split('-')
    month_number = month_mapping.get(month[:3], 0)  # Default to 0 if month is not found
    return int(year), month_number  # Sort by year, then by month

# Separate fixed and date columns
fixed_columns = df.columns[:6].tolist()
date_columns = df.columns[6:].tolist()

# Sort date columns using custom sort function
sorted_date_columns = sorted(date_columns, key=custom_sort)

# Combine fixed and sorted date columns
final_columns_order = fixed_columns + sorted_date_columns

# Reindex the DataFrame with the new column order
df = df.reindex(columns=final_columns_order)

# Output the DataFrame to check the new headers
print(df)
