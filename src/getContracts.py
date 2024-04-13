import pandas as pd
from datasets import load_dataset

dataset = load_dataset('mwritescode/slither-audited-smart-contracts', 'all-plain-text', trust_remote_code=True)

train_data = dataset['train']

source_code = train_data['source_code']

test_contract = source_code[22]

output_file = './contracts/' + 'test_contract' + '.sol'

with open(output_file, 'w', newline='') as file:
    file.write(test_contract)