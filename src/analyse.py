import sys

from openai import AzureOpenAI

test_output_path = sys.argv[1]

# with open(test_output_path, "r") as f:
#     test_output = f.read()

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
        "content": "Reply: \"Test\"."
    }
])

print(response.choices[0].message.content)