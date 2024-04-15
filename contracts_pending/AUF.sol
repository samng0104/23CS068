pragma solidity 0.5.16;

contract AufStaking2 {
    string public name = "Auf Staking phase 2";

    address public owner;

    AufToken public aufToken;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;

    mapping(address => bool) public hasStaked;

    mapping(address => bool) public isStaking;

    constructor(AufToken _aufToken) public {
        aufToken = _aufToken;

        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {
        // Require amount greater than 0

        require(_amount > 0, "amount cannot be 0");

        // Trasnfer Auf tokens to this contract for staking

        aufToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status

        isStaking[msg.sender] = true;

        hasStaked[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)

    function unstakeTokens() public {
        // Fetch staking balance

        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0

        require(balance > 0, "staking balance cannot be 0");

        // Transfer Auf tokens to this contract for staking

        aufToken.transfer(msg.sender, balance);

        // Reset staking balance

        stakingBalance[msg.sender] = 0;

        // Update staking status

        isStaking[msg.sender] = false;
    }

    // Issuing Tokens

    function issueTokens() public {
        // Only owner can call this function

        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers

        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];

            uint balance = stakingBalance[recipient];

            if (balance > 0) {
                aufToken.transfer(recipient, (balance * 10) / 100);
            }
        }
    }
}

contract AufToken {
    string public name = "AmongUs.Finance";

    string public symbol = "AUF";

    uint256 public totalSupply = 10000000000000000000000; // 10000 tokens

    uint8 public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;

        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);

        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;

        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
