import sys

functionalities_path = sys.argv[1]
test_cases_path = sys.argv[2]
subject_contract_path = sys.argv[3]

with open(functionalities_path, 'r') as file:
    functionalities = file.read()

with open(test_cases_path, 'r') as file:
    test_cases = file.read()

with open(subject_contract_path, 'r') as file:
    subject_contract = file.read()

### CityU GPT-4 ###
from openai import AzureOpenAI
client = AzureOpenAI(
    api_key="c196ed359f67c9c6eb89b27fa66089a9d63f42df1dd1e5e44a6d63622747fb194e4187c0de1d148919f86e291d756682aa5f2888d1c7f7537d2f475e4246a33cbe1297d210d3436c952af73fe6198c453b59f644fbb10583fc60c7e862516a3c",
    api_version="2023-05-15",
    azure_endpoint="https://cityucsopenai.azurewebsites.net/api/"
    
)
deployment_name = "gpt-4-32k"

conversation_history = []

def ask():
    response = client.chat.completions.create(model=deployment_name, messages=[
        {
            "role": "system",
            "content":"You are a smart contract and computer programming expert. \
                I am going to give you a smart contract, a response from GPT-4, and one uncompleted test case JavaScript file.\
                Your task is to complete the test case. Please do not leave any \"...\" for me to fill in in the code snippet.\
                For account address, you can use \"account[n]\", where n is 0-10, which is given by Truffle. \
                Do you understand?"
        },
        {
            "role": "assistant",
            "content": "Yes, I understand. I will complete the test cases such that they are ready to run. \
                Please provide the information."
        },
        {
            "role": "user",
            "content": "Smart Contract: " + subject_contract + 
                "Response from GPT-4: " + functionalities + 
                "Uncompleted test cases: " + test_cases
        }
    ])
    conversation_history.append(response.choices[0].message.content)
    return conversation_history

ask()

output_file = './test/' + 'Sashimi' + '.js'

with open(output_file, 'w') as file:
    file.write('\n'.join(conversation_history))
