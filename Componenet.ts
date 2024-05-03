import pandas as pd

def prepare_and_sort_df(df, month_mapping):
    # Function to create custom sorting key
    def custom_sort(col):
        parts = col.split('-')
        if len(parts) == 2 and parts[0] in month_mapping:
            return month_mapping[parts[0]] + int(parts[1]) * 12
        return 0  # Default for non-date columns or improperly formatted ones

    # Applying the custom sorting to DataFrame columns
    sorted_columns = sorted(df.columns, key=custom_sort)
    return df[sorted_columns]

# Assume 'data' includes your costtrendmaindata, which should be a dictionary that pandas can convert to a DataFrame
data = {
    'ServiceName': ['Service A', 'Service B', 'Service C'],  # Placeholder for non-date columns
    'Jan-24': [100, 200, 300],
    'May-24': [150, 250, 350],
    # Add all other columns
}

month_mapping = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
}

# Create DataFrame from data
df = pd.DataFrame(data)

# Sort DataFrame by month-year headers
df_sorted = prepare_and_sort_df(df, month_mapping)

# Check the result
print("Sorted DataFrame:", df_sorted)





import pandas as pd

# Define the mapping of months to numbers
month_mapping = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
}

def prepare_and_sort_df(df):
    # Define the custom sorting function within this function to use month_mapping
    def custom_sort(col):
        month, year = col.split('-')
        month_number = month_mapping.get(month[:3], 0)  # Default to 0 if month is not found
        return int(year), month_number  # Sort by year, then by month

    # Separate fixed and date columns
    fixed_columns = df.columns[:6].tolist()
    date_columns = df.columns[6:].tolist()

    # Sort date columns using the custom sort function
    sorted_date_columns = sorted(date_columns, key=custom_sort)

    # Combine fixed and sorted date columns
    final_columns_order = fixed_columns + sorted_date_columns

    # Reindex the DataFrame with the new column order
    df = df.reindex(columns=final_columns_order)
    return df

# Example usage:
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

# Process and sort DataFrame
df_sorted = prepare_and_sort_df(df)
print(df_sorted)
