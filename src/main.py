import subprocess
import re

contract_name = 'SimpleStorage'
### Subject contract ###
subject_contract_path = './contracts/' + contract_name + '.sol'

sample_test_case_path = './sample_test/Lock.js'

print("Extracting functionalities and generating test cases from the contract...")    

subprocess.run(['python', './src/getFunc.py', subject_contract_path, sample_test_case_path])

print("Finsihed extracting functionalities and generating test cases from the contract")    

# Extract test cases from the response
output_file_path = './output/functionalities.txt'

with open(output_file_path, 'r') as file:
    functionalities = file.read()

pattern = r"```javascript(.*?)```|```js(.*?)```|```jsx(.*?)```"
match = re.search(pattern, functionalities, re.DOTALL)

test_case_path = './test/' + contract_name + '.js'

if match:
    test_case = match.group(1).strip()
    # test_case = test_case.replace("deployed", "new")
    with open(test_case_path, 'w') as file:
        file.write(test_case)

print("Running test cases...")

try:  
    test_result = subprocess.run(['sudo', 'npx', 'hardhat', 'coverage'], capture_output=True, text=True)

    print(test_result.stdout)
    with open('./output/solidity_coverage.txt','w') as file:
        file.write(test_result.stdout)
except subprocess.CalledProcessError as e:
    print(e.output)
    print("Error running test cases")
    exit(1)

with open('./output/solidity_coverage.txt', 'r') as file:
    coverage = file.read()

match = re.search(r'All files\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)', coverage)

if match:
    statement_coverage = int(match.group(1))
    branch_coverage = int(match.group(2))
    function_coverage = int(match.group(3))

# Analyse output of test cases
print("Analyse output of test cases...")
if branch_coverage < 100:
    print("Calculating confidence value of test suite...")
    test_coverage_ratio = (statement_coverage + branch_coverage + function_coverage) / 3
    print("Test coverage ratio: ", test_coverage_ratio)

    #
    #

else:
    print("Branch coverage achieved 100%")
# subprocess.run(['python', './src/analyse.py', test_result.stdout])
