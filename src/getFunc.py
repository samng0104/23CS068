import sys

from datetime import datetime
from openai import AzureOpenAI

subject_contract_path = sys.argv[1]
sample_test_case_path = sys.argv[2]

with open(subject_contract_path, 'r') as file:
    subject_contract = file.read()

with open(sample_test_case_path, 'r') as file:
    sample_test_case = file.read()

### CityU GPT-4 ###
client = AzureOpenAI(
    api_key="c196ed359f67c9c6eb89b27fa66089a9d63f42df1dd1e5e44a6d63622747fb194e4187c0de1d148919f86e291d756682aa5f2888d1c7f7537d2f475e4246a33cbe1297d210d3436c952af73fe6198c453b59f644fbb10583fc60c7e862516a3c",
    api_version="2023-05-15",
    azure_endpoint="https://cityucsopenai.azurewebsites.net/api/"
    
)
deployment_name = "gpt-4-32k"

conversation_history = []

response = client.chat.completions.create(model=deployment_name, messages=[
    # {
    #     "role": "system",
    #     "content": "Reply: \"Test\"."
    # }
    {
        "role": "system",
        "content":"You are a smart contract and computer programming expert. \
            I am going to give you a smart contract to conduct analysis and provide test cases. \
            Do you understand?"
    },
    {
        "role": "assistant",
        "content": "Yes, I understand. Please provide the smart contract you'd like me to analyze."
    },
    {
        "role": "user",
        "content": "How many functionalities are there in the contracts? Please list them one by one." + 
                    subject_contract + "For those functionalities, \
                    can you rank them by their importance in the contract? \
                    For more important function, please give a higher number of test cases. \
                    For example, the most important function should have at least 3 test cases.\
                    Please provide those test cases code snippet in one single JavaScript snippet. \
                    There are some important things you should not do in the test cases. \
                    First, please do not leave any \"...\" in the code. \
                    Second, provide actual addresses for the token variables. \
                    They may be provided in the smart contracts already.\
                    I would like to test cases are ready to run. \
                    You can generate test cases referencing this example test case." + sample_test_case +
                    "Be reminded that ```await .deployed()``` will cause TypeError in Hardhat. \
                    Therefore you should not use `.delpoyed()` in the test cases. \
                    The usage of a testing framework is Hardhat."
    }
])

conversation_history.append(response.choices[0].message.content)

output_file_path = './output/functionalities.txt'

with open(output_file_path, 'w') as file:
    file.write('\n'.join(conversation_history))
    # Write date and time
    # file.write(datetime.now().strftime("\n%Y-%m-%d %H:%M:%S"))