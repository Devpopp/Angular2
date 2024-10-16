# Initialize pr_bid list
pr_bid = []

# Loop through pr_dependency and update dependencies for both quarterly and non-quarterly runs
for i in range(len(pr_dependency)):
    # Determine the updated dependency value based on whether it's a quarterly run
    updated_dependency = last_month_of_quarter_str if is_quarterly_run else current_month_str

    # Construct the branch URL for the main dependencies
    branchid_url = (
        url + 'branch/' + pr_dependency[i]
        + '/' + updated_dependency
        + '/framework/objectManager.listOfTypes?objectType=DataSource'
        + '&projectName=' + pr_dependency[i]
        + '&branchName=' + updated_dependency
    )

    # Make the request for the main dependencies
    try:
        response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=False)
        response.raise_for_status()  # Ensure the request was successful
        output = response.content.decode()
        start_index = output.find("branchID" + " value") + 17
        end_index = output.find('"', start_index)
        result = output[start_index:end_index]
        pr_bid.append(result)
    except requests.RequestException as e:
        print(f"Request failed for dependency {pr_dependency[i]}: {str(e)}")

# Loop through additional_pr_dependency and update dependencies for both quarterly and non-quarterly runs
for j in range(len(additional_pr_dependency)):
    # Determine the updated dependency value for additional dependencies
    updated_dependency = last_month_of_quarter_str if is_quarterly_run else current_month_str

    # Construct the branch URL for the additional dependencies
    branchid_url = (
        url + 'branch/' + additional_pr_dependency[j]
        + '/' + updated_dependency
        + '/framework/objectManager.listOfTypes?objectType=DataSource'
        + '&projectName=' + additional_pr_dependency[j]
        + '&branchName=' + updated_dependency
    )

    # Make the request for the additional dependencies
    try:
        response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=False)
        response.raise_for_status()  # Ensure the request was successful
        output = response.content.decode()
        start_index = output.find("branchID" + " value") + 17
        end_index = output.find('"', start_index)
        result = output[start_index:end_index]
        pr_bid.append(result)
    except requests.RequestException as e:
        print(f"Request failed for additional dependency {additional_pr_dependency[j]}: {str(e)}")

# Print the final pr_bid list
print("pr_bid:", pr_bid)
