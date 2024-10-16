# Initialize pr_bid list
pr_bid = []

# Determine if this is a quarterly or monthly run
if is_quarterly_run:
    # Process both pr_dependency and additional_pr_dependency for a quarterly run
    # Process the main dependencies
    for i in range(len(pr_dependency)):
        # Determine the dependency to use for a quarterly run
        updated_dependency = last_month_of_quarter_str  # Use last month of the quarter

        # Construct the URL for pr_dependency
        branchid_url = (
            url + 'branch/' + pr_dependency[i]
            + '/' + updated_dependency
            + '/framework/objectManager.listOfTypes?objectType=DataSource'
            + '&projectName=' + pr_dependency[i]
            + '&branchName=' + updated_dependency
        )

        # Make the request for pr_dependency
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

    # Process the additional dependencies for the quarterly run
    for j in range(len(additional_pr_dependency)):
        # Determine the dependency to use for a quarterly run
        updated_dependency = last_month_of_quarter_str  # Use last month of the quarter

        # Construct the URL for additional_pr_dependency
        branchid_url = (
            url + 'branch/' + additional_pr_dependency[j]
            + '/' + updated_dependency
            + '/framework/objectManager.listOfTypes?objectType=DataSource'
            + '&projectName=' + additional_pr_dependency[j]
            + '&branchName=' + updated_dependency
        )

        # Make the request for additional_pr_dependency
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

else:
    # For a monthly run, only process pr_dependency
    for i in range(len(pr_dependency)):
        # Determine the dependency to use for a monthly run
        updated_dependency = current_month_str  # Use the current month

        # Construct the URL for pr_dependency
        branchid_url = (
            url + 'branch/' + pr_dependency[i]
            + '/' + updated_dependency
            + '/framework/objectManager.listOfTypes?objectType=DataSource'
            + '&projectName=' + pr_dependency[i]
            + '&branchName=' + updated_dependency
        )

        # Make the request for pr_dependency
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

# Generate XML for the updates
dxml = '''<object type="BranchCopySpec" version="1.0">'''
for k in range(len(pr_dependency)):
    dxml += f'''
    <property name="projectName" value="{pr_name}" valueType="string"/>
    <property name="branchName" value="{source_branch}" valueType="string"/>
    <property name="newName" value="{target_branch}" valueType="string"/>
    <property name="newDescription" value="New Branch For {target_branch} Reporting Created" valueType="string"/>
    <property name="actions" valueType="table"/>'''

    # Add XML for pr_dependency (and additional if it's a quarterly run)
    a = f'<object type="BranchCopySpec:modifyDependency" version="1.0">'
    b = f'<property name="alias" value="{pr_alias[k]}" valueType="string"/>'
    c = f'<property name="url" value="url>Branch/{pr_dependency[k]}/{updated_dependency}" valueType="string"/>'
    dxml += a + '\n' + b + '\n' + '</modXML>'
