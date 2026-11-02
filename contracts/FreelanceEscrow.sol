// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC20Minimal
 * @notice Minimal ERC20 interface for USDC token interactions
 */
interface IERC20Minimal {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

/**
 * @title FreelanceEscrow
 * @author Tactile Brutalism Protocol
 * @notice Non-custodial escrow invoice contract for freelance capital settlement.
 * Built with zero platform fees, immutable deposit locking, and dispute controls.
 */
contract FreelanceEscrow {
    enum EscrowStatus {
        AWAITING_DEPOSIT, // 0: Invoice created, waiting for client USDC deposit
        FUNDED,           // 1: USDC deposited into contract vault, freelancer can work
        WORK_SUBMITTED,   // 2: Freelancer submitted proof of deliverables
        RELEASED,         // 3: Client accepted deliverables, funds disbursed
        REFUNDED,         // 4: Escrow cancelled or refunded to client
        DISPUTED          // 5: Either party initiated dispute resolution
    }

    struct Invoice {
        uint256 id;
        address client;
        address freelancer;
        address token;              // USDC address (or address(0) for native ETH fallback)
        uint256 amount;             // In base units (e.g. 6 decimals for USDC)
        string title;
        string scopeOfWork;
        string deliverableProof;    // IPFS hash, GitHub PR, or proof URL
        string deliverableNotes;
        uint256 deadline;           // Unix timestamp
        uint256 createdAt;
        uint256 fundedAt;
        uint256 releasedAt;
        EscrowStatus status;
    }

    uint256 private _invoiceIdCounter;
    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) private _clientInvoices;
    mapping(address => uint256[]) private _freelancerInvoices;

    // Mutex lock for reentrancy safety
    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "REENTRANCY_GUARD_TRIGGERED");
        _locked = 2;
        _;
        _locked = 1;
    }

    // Events
    event InvoiceCreated(
        uint256 indexed invoiceId,
        address indexed client,
        address indexed freelancer,
        address token,
        uint256 amount,
        string title,
        uint256 deadline
    );

    event FundsDeposited(uint256 indexed invoiceId, address indexed client, uint256 amount);
    event DeliverableSubmitted(uint256 indexed invoiceId, address indexed freelancer, string deliverableProof);
    event FundsReleased(uint256 indexed invoiceId, address indexed freelancer, uint256 amount);
    event FundsRefunded(uint256 indexed invoiceId, address indexed client, uint256 amount);
    event DisputeRaised(uint256 indexed invoiceId, address indexed raisedBy, string reason);

    modifier onlyClient(uint256 invoiceId) {
        require(msg.sender == invoices[invoiceId].client, "CALLER_NOT_CLIENT");
        _;
    }

    modifier onlyFreelancer(uint256 invoiceId) {
        require(msg.sender == invoices[invoiceId].freelancer, "CALLER_NOT_FREELANCER");
        _;
    }

    modifier onlyParticipant(uint256 invoiceId) {
        require(
            msg.sender == invoices[invoiceId].client || msg.sender == invoices[invoiceId].freelancer,
            "CALLER_NOT_PARTICIPANT"
        );
        _;
    }

    /**
     * @notice Create a new Escrow Invoice with terms
     */
    function createInvoice(
        address freelancer,
        address token,
        uint256 amount,
        string calldata title,
        string calldata scopeOfWork,
        uint256 deadline
    ) external returns (uint256 invoiceId) {
        require(freelancer != address(0), "INVALID_FREELANCER_ADDRESS");
        require(freelancer != msg.sender, "CLIENT_CANNOT_BE_FREELANCER");
        require(amount > 0, "AMOUNT_MUST_BE_GREATER_THAN_ZERO");
        require(deadline > block.timestamp, "DEADLINE_MUST_BE_FUTURE");

        _invoiceIdCounter++;
        invoiceId = _invoiceIdCounter;

        invoices[invoiceId] = Invoice({
            id: invoiceId,
            client: msg.sender,
            freelancer: freelancer,
            token: token,
            amount: amount,
            title: title,
            scopeOfWork: scopeOfWork,
            deliverableProof: "",
            deliverableNotes: "",
            deadline: deadline,
            createdAt: block.timestamp,
            fundedAt: 0,
            releasedAt: 0,
            status: EscrowStatus.AWAITING_DEPOSIT
        });

        _clientInvoices[msg.sender].push(invoiceId);
        _freelancerInvoices[freelancer].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, freelancer, token, amount, title, deadline);
    }

    /**
     * @notice Deposit stablecoins (USDC) into the escrow contract
     */
    function depositFunds(uint256 invoiceId) external payable nonReentrant onlyClient(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(inv.status == EscrowStatus.AWAITING_DEPOSIT, "INVALID_STATUS_FOR_DEPOSIT");

        inv.status = EscrowStatus.FUNDED;
        inv.fundedAt = block.timestamp;

        if (inv.token == address(0)) {
            // Native ETH deposit
            require(msg.value == inv.amount, "INCORRECT_ETH_AMOUNT");
        } else {
            // ERC20 token (USDC)
            require(msg.value == 0, "NO_ETH_ACCEPTED_FOR_TOKEN_INVOICE");
            bool success = IERC20Minimal(inv.token).transferFrom(msg.sender, address(this), inv.amount);
            require(success, "TOKEN_TRANSFER_FAILED");
        }

        emit FundsDeposited(invoiceId, msg.sender, inv.amount);
    }

    /**
     * @notice Freelancer submits proof of delivered work
     */
    function submitDeliverable(
        uint256 invoiceId,
        string calldata deliverableProof,
        string calldata notes
    ) external onlyFreelancer(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(
            inv.status == EscrowStatus.FUNDED || inv.status == EscrowStatus.WORK_SUBMITTED,
            "INVALID_STATUS_FOR_SUBMISSION"
        );
        require(bytes(deliverableProof).length > 0, "EMPTY_DELIVERABLE_PROOF");

        inv.deliverableProof = deliverableProof;
        inv.deliverableNotes = notes;
        inv.status = EscrowStatus.WORK_SUBMITTED;

        emit DeliverableSubmitted(invoiceId, msg.sender, deliverableProof);
    }

    /**
     * @notice Client approves work and releases funds directly to freelancer
     */
    function releaseFunds(uint256 invoiceId) external nonReentrant onlyClient(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(
            inv.status == EscrowStatus.FUNDED || inv.status == EscrowStatus.WORK_SUBMITTED,
            "INVALID_STATUS_FOR_RELEASE"
        );

        inv.status = EscrowStatus.RELEASED;
        inv.releasedAt = block.timestamp;

        if (inv.token == address(0)) {
            (bool success, ) = payable(inv.freelancer).call{value: inv.amount}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            bool success = IERC20Minimal(inv.token).transfer(inv.freelancer, inv.amount);
            require(success, "TOKEN_TRANSFER_FAILED");
        }

        emit FundsReleased(invoiceId, inv.freelancer, inv.amount);
    }

    /**
     * @notice Refund funds back to client (if freelancer cancels or deadline expired without submission)
     */
    function refundFunds(uint256 invoiceId) external nonReentrant onlyParticipant(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(inv.status == EscrowStatus.FUNDED, "CANNOT_REFUND_SUBMITTED_OR_CLOSED");

        // Client can refund only if deadline has expired; Freelancer can voluntary refund anytime
        if (msg.sender == inv.client) {
            require(block.timestamp > inv.deadline, "DEADLINE_NOT_YET_PASSED");
        }

        inv.status = EscrowStatus.REFUNDED;

        if (inv.token == address(0)) {
            (bool success, ) = payable(inv.client).call{value: inv.amount}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            bool success = IERC20Minimal(inv.token).transfer(inv.client, inv.amount);
            require(success, "TOKEN_TRANSFER_FAILED");
        }

        emit FundsRefunded(invoiceId, inv.client, inv.amount);
    }

    /**
     * @notice Raise a dispute to halt automated settlement
     */
    function raiseDispute(uint256 invoiceId, string calldata reason) external onlyParticipant(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(
            inv.status == EscrowStatus.FUNDED || inv.status == EscrowStatus.WORK_SUBMITTED,
            "CANNOT_DISPUTE_IN_CURRENT_STATE"
        );

        inv.status = EscrowStatus.DISPUTED;
        emit DisputeRaised(invoiceId, msg.sender, reason);
    }

    /**
     * @notice View helper to get invoice count
     */
    function totalInvoices() external view returns (uint256) {
        return _invoiceIdCounter;
    }

    /**
     * @notice Retrieve all invoice IDs associated with a client
     */
    function getClientInvoices(address client) external view returns (uint256[] memory) {
        return _clientInvoices[client];
    }

    /**
     * @notice Retrieve all invoice IDs associated with a freelancer
     */
    function getFreelancerInvoices(address freelancer) external view returns (uint256[] memory) {
        return _freelancerInvoices[freelancer];
    }
}
