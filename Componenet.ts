import pandas as pd

def prepare_and_sort_df(df, month_mapping):
    # Define the custom sorting function
    def custom_sort(col):
        parts = col.split('-')
        if len(parts) == 2 and parts[0] in month_mapping:
            month_number = month_mapping[parts[0]]
            year = int(parts[1])
            return (year, month_number)
        return (float('inf'), 0)  # Keep non-date columns at the end

    # Separate fixed and date columns
    fixed_columns = df.columns[:6].tolist()  # Assuming the first 6 columns are fixed
    date_columns = df.columns[6:].tolist()

    # Sort the date columns
    sorted_date_columns = sorted(date_columns, key=custom_sort)

    # Combine the fixed and sorted date columns
    final_columns_order = fixed_columns + sorted_date_columns

    # Reindex the DataFrame with the new column order
    df = df.reindex(columns=final_columns_order)
    return df

# Example data and month mapping
month_mapping = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
}

# Assuming 'data' is your DataFrame loaded here
data = {
    # Include your actual DataFrame data
}

df = pd.DataFrame(data)
df_sorted = prepare_and_sort_df(df, month_mapping)
print(df_sorted)



# Process and sort DataFrame
df_sorted = prepare_and_sort_df(df)
print(df_sorted)
