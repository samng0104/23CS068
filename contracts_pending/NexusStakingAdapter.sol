pragma solidity 0.6.5;
pragma experimental ABIEncoderV2;

interface ERC20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);
}

interface ProtocolAdapter {
    /**

     * @dev MUST return "Asset" or "Debt".

     * SHOULD be implemented by the public constant state variable.

     */

    function adapterType() external pure returns (string memory);

    /**

     * @dev MUST return token type (default is "ERC20").

     * SHOULD be implemented by the public constant state variable.

     */

    function tokenType() external pure returns (string memory);

    /**

     * @dev MUST return amount of the given token locked on the protocol by the given account.

     */

    function getBalance(
        address token,
        address account
    ) external view returns (uint256);
}

interface TokenController {
    function totalBalanceOf(address) external view returns (uint256);
}

contract NexusStakingAdapter is ProtocolAdapter {
    string public constant override adapterType = "Asset";

    string public constant override tokenType = "ERC20";

    address internal constant TOKEN_CONTROLLER =
        0x5407381b6c251cFd498ccD4A1d877739CB7960B8;

    address internal constant NXM = 0xd7c49CEE7E9188cCa6AD8FF264C1DA2e69D4Cf3B;

    /**

     * @return Amount of staked tokens + rewards by the given account.

     * @dev Implementation of ProtocolAdapter interface function.

     */

    function getBalance(
        address,
        address account
    ) external view override returns (uint256) {
        uint256 totalBalance = TokenController(TOKEN_CONTROLLER).totalBalanceOf(
            account
        );

        uint256 tokenBalance = ERC20(NXM).balanceOf(account);

        return totalBalance - tokenBalance;
    }
}
