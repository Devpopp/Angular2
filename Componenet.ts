# Initialize the list for storing branch IDs
pr_bid = []

# Process monthly dependencies if they exist
for i in range(len(pr_dependency)):
    # Set the dependency update for monthly
    updated_dependency = current_month_str
    print(f'Processing monthly dependency: {pr_dependency[i]} with updated dependency: {updated_dependency}')
    
    # Fetch branch ID for the current monthly dependency
    branchid_url = f"{url}/branch/{pr_dependency[i]}/{updated_dependency}/framework/objectManager.listOfTypes?objectType=DataSource"
    response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
    output = response.content.decode()
    
    # Extract the branch ID from the response
    start_index = output.find('"branchId" value="') + 17
    end_index = output.find('"', start_index)
    if start_index == 16 or end_index == -1:
        print(f"Branch ID not found for monthly dependency: {pr_dependency[i]}")
        continue
    result = output[start_index:end_index]
    pr_bid.append(result)
    print("Processed monthly pr_bid:", pr_bid)

# Process quarterly dependencies if it is a quarterly run and they exist
if is_quarterly_run:
    for i in range(len(additional_pr_dependency)):
        # Set the dependency update for quarterly
        updated_dependency = last_month_of_quarter_str
        print(f'Processing quarterly dependency: {additional_pr_dependency[i]} with updated dependency: {updated_dependency}')
        
        # Fetch branch ID for the current quarterly dependency
        branchid_url = f"{url}/branch/{additional_pr_dependency[i]}/{updated_dependency}/framework/objectManager.listOfTypes?objectType=DataSource"
        response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
        output = response.content.decode()
        
        # Extract the branch ID from the response
        start_index = output.find('"branchId" value="') + 17
        end_index = output.find('"', start_index)
        if start_index == 16 or end_index == -1:
            print(f"Branch ID not found for quarterly dependency: {additional_pr_dependency[i]}")
            continue
        result = output[start_index:end_index]
        pr_bid.append(result)
        print("Processed quarterly pr_bid:", pr_bid)

# If no dependencies were processed, exit early
if not pr_bid:
    print("No dependencies processed. Exiting without creating the branch.")
    exit()

# Build the XML for the dependencies
dxml = f'''
<object type="BranchCopySpec" version="1.0">
    <property name="projectName" value="{pr_name}" valueType="string"/>
    <property name="branchName" value="{source_branch}" valueType="string"/>
    <property name="newName" value="{target_branch}" valueType="string"/>
    <property name="newDescription" value="New Branch for {target_branch} Reporting Created" valueType="string"/>
    <property name="comment" value="{comments}" valueType="string"/>
    <property name="actions" valueType="table"/>
'''

# Add each dependency to the XML
for j in range(len(pr_bid)):
    # Determine if the dependency is monthly or quarterly based on its position
    if j < len(pr_dependency):
        # Monthly dependency
        a = f'<object type="BranchCopySpec:modifyDependency" version="1.0">'
        b = f'<property name="alias" value="{pr_alias[j]}" valueType="string"/>'
        c = f'<property name="url" valueType="url">Branch[{pr_dependency[j]}:{current_month_str}{{{pr_bid[j]}}}]</property>'
    else:
        # Quarterly dependency
        idx = j - len(pr_dependency)
        a = f'<object type="BranchCopySpec:modifyDependency" version="1.0">'
        b = f'<property name="alias" value="{additional_pr_alias[idx]}" valueType="string"/>'
        c = f'<property name="url" valueType="url">Branch[{additional_pr_dependency[idx]}:{last_month_of_quarter_str}{{{pr_bid[j]}}}]</property>'
    
    # Complete the XML for this dependency
    d = '</object>'
    e = a + '\n' + b + '\n' + c + '\n' + d + '\n'
    dxml += e

# Close the XML structure
dxml += '''
</property>
</object>
'''

# Print the final XML for debugging
print("Final dxml:\n", dxml)

# Make the API call to create the branch
response = requests.post(f"{url}/global/framework/objectManager.copyBranch", data=dxml, headers=static_variables.get_POST_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
print("API Response:", response.content.decode())

# Perform validation
url_validation = f"{url}/global/framework/branch.revalidateAll?projectName={pr_name}&branchName={target_branch}&doNotDeleteInstance=false"
response_validation = requests.get(url_validation, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
print("Validation Response:", response_validation.content.decode())
