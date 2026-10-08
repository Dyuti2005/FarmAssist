// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CropPassportRegistry {
    struct PassportRecord {
        string internalPassportId;
        string dataHash;
        uint256 timestamp;
        address submittingWallet;
    }

    mapping(string => PassportRecord) public passports;

    event PassportRegistered(
        string indexed internalPassportId,
        string dataHash,
        uint256 timestamp,
        address indexed submittingWallet
    );

    function registerPassport(string memory _internalPassportId, string memory _dataHash) public {
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
