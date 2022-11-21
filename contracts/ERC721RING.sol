// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// TODO implement burn 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ERC721RING is ERC721Enumerable, Ownable {
    using ECDSA for bytes32;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => uint256) private _tokenIssueTime;

    constructor() ERC721("MyToken", "MTK") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function _issueTime(uint256 tokenId) internal view returns (uint256) {
        // return block.timestamp;
        return _tokenIssueTime[tokenId];
    }

    function _verifyVow(address target, bytes memory signature, address account) internal pure returns (bool) {
        return keccak256(abi.encodePacked(target))
            .toEthSignedMessageHash()
            .recover(signature) == account;
    }

    function safeMintRingSync(address toA, address toB, bytes memory signatureA, bytes memory signatureB) public {
        require(balanceOf(toA) == 0, "ERC721RING: A already has a token");
        require(balanceOf(toB) == 0, "ERC721RING: B already has a token");
        require(_verifyVow(toB, signatureA, toA), "invalid signature from A");
        require(_verifyVow(toA, signatureB, toB), "invalid signature from B");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _tokenIdCounter.increment();
        _tokenIssueTime[tokenId] = block.timestamp;
        _tokenIssueTime[tokenId + 1] = block.timestamp;
        _safeMint(toA, tokenId);
        _safeMint(toB, tokenId + 1);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireMinted(tokenId);

        // TODO implement variations of tokenURI based on _issueTime
        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId))
                : "";
    }


    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
