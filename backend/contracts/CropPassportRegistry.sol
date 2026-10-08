// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CropPassportRegistry {
    // Structure to hold passport registration metadata securely
    struct PassportRecord {
        string internalPassportId;
        string dataHash;
        uint256 timestamp;
        address submittingWallet;
    }

    // Mapping from internal database ID to its blockchain passport record
    mapping(string => PassportRecord) public passports;

    // Event emitted upon successful registration
    event PassportRegistered(
        string indexed internalPassportId,
        string dataHash,
        uint256 timestamp,
        address indexed submittingWallet
    );

    /**
     * @dev Register a new crop passport hash
     * @param _internalPassportId The unique ID of the passport record from the DB
     * @param _dataHash The SHA-256 or keccak256 hash of the sensitive JSON data
     */
    function registerPassport(string memory _internalPassportId, string memory _dataHash) public {
        // Prevent overwriting existing records logically
        require(passports[_internalPassportId].timestamp == 0, "Passport ID already exists on-chain");

        PassportRecord memory newRecord = PassportRecord({
            internalPassportId: _internalPassportId,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            submittingWallet: msg.sender
        });

        passports[_internalPassportId] = newRecord;

        emit PassportRegistered(
            _internalPassportId,
            _dataHash,
            block.timestamp,
            msg.sender
        );
    }
}
