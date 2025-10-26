// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISemaphoreVerifier {
    function verifyProof(
        bytes calldata proof,
        uint256[] calldata publicSignals
    ) external view returns (bool);
}

/**
 * @title VerifiedPayments
 * @dev Handles verification payments on Celo network
 */
contract VerifiedPayments is Ownable, ReentrancyGuard {
    ISemaphoreVerifier public verifier;
    IERC20 public celoToken;
    address public serverWallet;
    
    uint256 public verificationFee;
    bytes32 public currentRoot;
    uint256 public rootVersion;
    
    mapping(bytes32 => bool) public nullifierUsed;
    mapping(address => bool) public isVerified;
    mapping(address => uint256) public verificationTimestamp;
    
    event RootUpdated(bytes32 indexed newRoot, uint256 version);
    event VerificationPayment(
        address indexed user,
        uint256 amount,
        bytes32 nullifier,
        uint256 timestamp
    );
    event UserVerified(address indexed user, uint256 timestamp);
    
    constructor(
        address _verifier,
        address _celoToken,
        address _serverWallet,
        uint256 _verificationFee
    ) Ownable(msg.sender) {
        verifier = ISemaphoreVerifier(_verifier);
        celoToken = IERC20(_celoToken);
        serverWallet = _serverWallet;
        verificationFee = _verificationFee;
    }
    
    /**
     * @dev Update the Merkle root (only owner)
     */
    function updateRoot(bytes32 newRoot) external onlyOwner {
        currentRoot = newRoot;
        rootVersion += 1;
        emit RootUpdated(newRoot, rootVersion);
    }
    
    /**
     * @dev Update verification fee (only owner)
     */
    function updateVerificationFee(uint256 newFee) external onlyOwner {
        verificationFee = newFee;
    }
    
    /**
     * @dev Update server wallet (only owner)
     */
    function updateServerWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        serverWallet = newWallet;
    }
    
    /**
     * @dev Pay verification fee with proof (simplified version without proof for now)
     */
    function payVerificationFee() external nonReentrant {
        require(!isVerified[msg.sender], "Already verified");
        require(verificationFee > 0, "Verification fee not set");
        
        // Transfer CELO tokens from user to server wallet
        require(
            celoToken.transferFrom(msg.sender, serverWallet, verificationFee),
            "Transfer failed"
        );
        
        // Mark user as verified
        isVerified[msg.sender] = true;
        verificationTimestamp[msg.sender] = block.timestamp;
        
        emit UserVerified(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Pay with Semaphore proof (advanced version)
     */
    function payWithProof(
        bytes calldata proof,
        uint256[] calldata publicSignals,
        uint256 amount
    ) external nonReentrant {
        require(!isVerified[msg.sender], "Already verified");
        require(amount >= verificationFee, "Insufficient amount");
        
        // Extract nullifier from public signals
        bytes32 nullifier = bytes32(publicSignals[1]);
        require(!nullifierUsed[nullifier], "Proof already used");
        
        // Verify the proof
        bool isValid = verifier.verifyProof(proof, publicSignals);
        require(isValid, "Invalid proof");
        
        // Mark nullifier as used
        nullifierUsed[nullifier] = true;
        
        // Transfer tokens
        require(
            celoToken.transferFrom(msg.sender, serverWallet, amount),
            "Transfer failed"
        );
        
        // Mark user as verified
        isVerified[msg.sender] = true;
        verificationTimestamp[msg.sender] = block.timestamp;
        
        emit VerificationPayment(msg.sender, amount, nullifier, block.timestamp);
        emit UserVerified(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Check if an address is verified
     */
    function checkVerification(address user) external view returns (bool, uint256) {
        return (isVerified[user], verificationTimestamp[user]);
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
