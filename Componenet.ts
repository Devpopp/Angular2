# Initialize the branch ID list
pr_bid = []

# Process monthly dependencies if they exist
if pr_dependency:
    for i in range(len(pr_dependency)):
        # Set updated_dependency for monthly update
        updated_dependency = current_month_str
        print(f'Updating monthly dependency ({pr_dependency[i]}) for monthly update: {updated_dependency}')
        
        # Get branch ID for pr_dependency
        branchid_url = url + '/branch/' + pr_dependency[i] + '/' + updated_dependency + '/framework/objectManager.listOfTypes?objectType=DataSource'
        response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
        output = response.content.decode()
        start_index = output.find('"branchId" value="') + 17
        end_index = output.find('"', start_index)
        if start_index == 16 or end_index == -1:
            print(f"Branch ID not found for monthly dependency: {pr_dependency[i]}")
            continue
        result = output[start_index:end_index]
        pr_bid.append(result)
        print("pr_bid (monthly):", pr_bid)

# Process quarterly dependencies if it's a quarterly run and they exist
if is_quarterly_run and additional_pr_dependency:
    for i in range(len(additional_pr_dependency)):
        # Set updated_dependency for the quarterly update
        updated_dependency = last_month_of_quarter_str
        print(f'Updating quarterly dependency ({additional_pr_dependency[i]}) for quarterly update: {updated_dependency}')
        
        # Get branch ID for additional_pr_dependency
        branchid_url = url + '/branch/' + additional_pr_dependency[i] + '/' + updated_dependency + '/framework/objectManager.listOfTypes?objectType=DataSource'
        response = requests.get(branchid_url, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
        output = response.content.decode()
        start_index = output.find('"branchId" value="') + 17
        end_index = output.find('"', start_index)
        if start_index == 16 or end_index == -1:
            print(f"Branch ID not found for quarterly dependency: {additional_pr_dependency[i]}")
            continue
        result = output[start_index:end_index]
        pr_bid.append(result)
        print("pr_bid (quarterly):", pr_bid)

# Proceed with building the dxml using pr_bid
dxml = '''
<object type="BranchCopySpec" version="1.0">
    <property name="projectName" value="''' + pr_name + '''" valueType="string"/>
    <property name="branchName" value="''' + source_branch + '''" valueType="string"/>
    <property name="newName" value="''' + target_branch + '''" valueType="string"/>
    <property name="newDescription" value="New Branch for ''' + target_branch + ''' Reporting Created" valueType="string"/>
    <property name="comment" value="''' + comments + '''" valueType="string"/>
    <property name="actions" valueType="table"/>
'''

# Add the XML entries for each pr_bid, distinguishing between monthly and quarterly dependencies
monthly_count = len(pr_dependency)
for j in range(len(pr_bid)):
    if j < monthly_count:
        # Handle monthly dependencies
        a = '<object type="BranchCopySpec:modifyDependency" version="1.0">'
        b = '<property name="alias" value="' + pr_alias[j] + '" valueType="string"/>'
        c = '<property name="url" valueType="url">Branch[' + pr_dependency[j] + ':' + current_month_str + '{' + pr_bid[j] + '}]</property>'
        d = '</object>'
        e = a + '\n' + b + '\n' + c + '\n' + d + '\n'
        dxml += e
    else:
        # Handle quarterly dependencies
        idx = j - monthly_count
        a = '<object type="BranchCopySpec:modifyDependency" version="1.0">'
        b = '<property name="alias" value="' + additional_pr_alias[idx] + '" valueType="string"/>'
        c = '<property name="url" valueType="url">Branch[' + additional_pr_dependency[idx] + ':' + last_month_of_quarter_str + '{' + pr_bid[j] + '}]</property>'
        d = '</object>'
        e = a + '\n' + b + '\n' + c + '\n' + d + '\n'
        dxml += e

# Complete the XML structure
dxml += '''
</property>
</object>
'''

# Print the final XML for debugging
print("Final dxml:\n", dxml)

# Make the API call with the constructed XML
response = requests.post(url + '/global/framework/objectManager.copyBranch', data=dxml, headers=static_variables.get_POST_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
print("API Response Content:", response.content.decode())

# Perform the validation step
url_validation = url + '/global/framework/branch.revalidateAll?projectName=' + pr_name + '&branchName=' + target_branch + '&doNotDeleteInstance=false'
response_validation = requests.get(url_validation, headers=static_variables.get_GET_AUTH_headers(), verify=static_variables.ROOT_CER_CA)
print("Validation Response Content:", response_validation.content.decode())
