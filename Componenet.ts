# Assuming 'today' is defined as the current date
this_month = today.month

# Define the last month of the quarter if this month falls in a quarterly month
if this_month in [1, 2, 3]:
    last_month_of_quarter = today.replace(month=3)
elif this_month in [4, 5, 6]:
    last_month_of_quarter = today.replace(month=6)
elif this_month in [7, 8, 9]:
    last_month_of_quarter = today.replace(month=9)
else:
    last_month_of_quarter = today.replace(month=12)

# Format the last month of the quarter
last_month_of_quarter_str = last_month_of_quarter.strftime("%b%Y")  # e.g., "Mar2024"

# Check if the current month is a quarterly run month (March, June, September, December)
is_quarterly_run = this_month in [3, 6, 9, 12]

# Initialize pr_bid
pr_bid = []

if is_quarterly_run:
    # Only do this logic if it's a quarterly run
    print('Running in quarterly mode')

    for i in range(len(pr_dependency)):
        # Update dependencies ONLY for UDFs and pr_BOE_System_Objects during quarterly months
        if pr_alias[i] == 'UDFs' and pr_dependency[i] == 'BoE_UDFs':
            updated_dependency = last_month_of_quarter_str
        elif pr_alias[i] == 'Sys_Objects' and pr_dependency[i] == 'pr_BOE_System_Objects':
            updated_dependency = last_month_of_quarter_str
        else:
            # No need to change other projects during quarterly months, so skip them
            continue

        # Construct branchid_url using the updated_dependency
        branchid_url = (f"{url}branch/{updated_dependency}/{target_branch}/"
                        f"framework/objectManager.listOfTypes?"
                        f"objectType=DataSource&projectName={updated_dependency}&BranchName={target_branch}")
        
        print('Constructed branchid_url:', branchid_url)

        # Make the GET request
        response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
        output = response.content.decode()

        # Extract branchId from the response
        start_index = output.find('branchId" value="') + 17
        end_index = output.find('"', start_index)
        result = output[start_index:end_index]

        # Append the result to pr_bid
        pr_bid.append(result)

    print('pr_bid 2:', pr_bid)

else:
    # If it's not a quarterly month, do nothing special
    print('Not a quarterly month. No changes made.')
