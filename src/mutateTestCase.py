import sys

from datetime import datetime
from openai import AzureOpenAI

subject_contract_path = sys.argv[1]
test_case_path = sys.argv[2]
test_result_path = sys.argv[3]

with open(subject_contract_path, 'r') as file:
    subject_contract = file.read()

with open(test_case_path, 'r') as file:
    test_case = file.read()

with open(test_result_path, 'r') as file:
    test_result = file.read()

### CityU GPT-4 ###
client = AzureOpenAI(
    api_key="c196ed359f67c9c6eb89b27fa66089a9d63f42df1dd1e5e44a6d63622747fb194e4187c0de1d148919f86e291d756682aa5f2888d1c7f7537d2f475e4246a33cbe1297d210d3436c952af73fe6198c453b59f644fbb10583fc60c7e862516a3c",
    api_version="2023-05-15",
    azure_endpoint="https://cityucsopenai.azurewebsites.net/api/"
    
)
deployment_name = "gpt-4-32k"

conversation_history = []

response = client.chat.completions.create(model=deployment_name, messages=[
    {
    "role": "system",
    "content":"You are a smart contract and computer programming expert. \
        I am going to give you a smart contract and you need to fuzz the provided test cases. \
        Do you understand?"
    },
    {
        "role": "assistant",
        "content": "Yes, I understand. Please provide the smart contract, test cases and the test results."
    },
    {
        "role": "user",
        "content":  "For this smart contract " + subject_contract + 
            "It has been tested by this set of test cases" + test_case +
            "The test results are " + test_result +
            "You need to fuzz the test cases and provide the fuzzed test cases in one single JavaScript snippet. \
            There are some important things you should not do in the test cases. \
            First, please do not leave any \"...\" in the code. \
            Second, provide actual addresses for the token variables. \
            They may be provided in the smart contracts already.\
            I would like to test cases are ready to run. \
            Be reminded that ```await .deployed()``` will cause TypeError in Hardhat. \
            Therefore you should not use `.delpoyed()` in the test cases. \
            The usage of a testing framework is Hardhat."
    }
])

conversation_history.append(response.choices[0].message.content)

output_file_path = './output/functionalities.txt'

with open(output_file_path, 'w') as file:
    file.write('\n'.join(conversation_history))
