fuzzing_switch = 2
fuzz = False
while fuzzing_switch > 0:
    if fuzz == False:
        print("Generate test case")
    else:
        print("Fuzz test case")
    print("Running test cases...")
    
        # Analyse output of test cases
    print("Analyse output of test cases...")
    branch_coverage = 10
    if branch_coverage < 100:
        fuzzing_switch = fuzzing_switch - 1
        confidence_value = 10
        print("Confidence Value: ", confidence_value)
        if confidence_value < 70:
            fuzz = False
            print("Confidence value is lower than threshold.")
            
        else:
            print("Test suite mutation")
            fuzz = True

    else:
        fuzzing_switch = 0
        print("Branch coverage achieved 100%")
# subprocess.run(['python', './src/analyse.py', test_result.stdout])

print("Fuzzing completed")