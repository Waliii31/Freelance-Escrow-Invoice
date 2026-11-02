// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockUSDC
 * @notice Testnet / Local USDC stablecoin implementation with 6 decimals and open minting for testing.
 */
contract MockUSDC {
    string public name = "USD Coin (Brutalist Mock)";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        // Mint initial supply of 1,000,000 USDC to deployer
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "ERC20: insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        require(balanceOf[sender] >= amount, "ERC20: transfer amount exceeds balance");
        uint256 currentAllowance = allowance[sender][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
            allowance[sender][msg.sender] = currentAllowance - amount;
        }
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    /**
     * @notice Test faucet mint function - allows anyone to mint test USDC
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");
        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}
