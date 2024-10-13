from datetime import datetime

# Example dependencies list (pr_dependency)
pr_dependency = ['pr_BOE_REPORT_ALLOCATION', 'pr_BOE_DATA_DICTIONARY', 'pr_BOE_GB_DATA_INPUT']
pr_alias = ['UDFs', 'Sys_Objects', 'Other']

# Current month and handling for quarterly runs
today = datetime.today()
this_month = today.month

# Determine last month of current quarter
if this_month in [1, 2, 3]:
    last_month_of_quarter = today.replace(month=3)
elif this_month in [4, 5, 6]:
    last_month_of_quarter = today.replace(month=6)
elif this_month in [7, 8, 9]:
    last_month_of_quarter = today.replace(month=9)
else:
    last_month_of_quarter = today.replace(month=12)

# Get formatted strings
last_month_of_quarter_str = last_month_of_quarter.strftime("%b%Y")  # e.g., "Mar2024"
current_month_str = today.strftime("%b%Y")  # e.g., "Oct2024"

# Check if we are in a quarterly month
is_quarterly_run = this_month in [3, 6, 9, 12]

# Initialize pr_bid for branch IDs
pr_bid = []

# Loop through pr_dependency and decide based on conditions
for i in range(len(pr_dependency)):
    if pr_alias[i] == 'UDFs' and pr_dependency[i] == 'BoE_UDFs':
        # Only change branch if it's a quarterly run, otherwise use current month
        updated_dependency = last_month_of_quarter_str if is_quarterly_run else current_month_str
    elif pr_alias[i] == 'Sys_Objects' and pr_dependency[i] == 'pr_BOE_System_Objects':
        # Same logic for Sys_Objects
        updated_dependency = last_month_of_quarter_str if is_quarterly_run else current_month_str
    else:
        # For other projects, keep the branch unchanged
        updated_dependency = pr_dependency[i]

    # Construct branchid_url using updated_dependency
    branchid_url = (f"{url}branch/{updated_dependency}/{target_branch}/"
                    f"framework/objectManager.listOfTypes?"
                    f"objectType=DataSource&projectName={updated_dependency}&BranchName={target_branch}")

    # Make the GET request
    response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
    output = response.content.decode()

    # Extract branchId from the response
    start_index = output.find('branchId" value="') + 17
    end_index = output.find('"', start_index)
    result = output[start_index:end_index]

    # Append the result to pr_bid
    pr_bid.append(result)

print('pr_bid:', pr_bid)

# Proceed with further logic as required for constructing dxml, POST request, etc.
