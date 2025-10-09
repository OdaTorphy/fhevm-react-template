// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Privacy Pollution Monitor
 * @notice Confidential environmental monitoring using Fully Homomorphic Encryption
 * @dev Example contract for FHEVM SDK demonstration
 */
contract PrivacyPollutionMonitor is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant MONITOR_ROLE = keccak256("MONITOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct MonitoringStation {
        string name;
        address operator;
        bool active;
        uint256 registeredAt;
        uint256 reportCount;
    }

    struct PollutionReport {
        address station;
        bytes encryptedMeasurement;  // euint64 encrypted value
        uint8 pollutantType;
        uint8 severityLevel;
        uint256 timestamp;
        bool verified;
    }

    // Pollutant types
    uint8 public constant PM25 = 1;
    uint8 public constant PM10 = 2;
    uint8 public constant SO2 = 3;
    uint8 public constant NO2 = 4;
    uint8 public constant OZONE = 5;
    uint8 public constant HEAVY_METALS = 6;

    // State variables
    mapping(address => MonitoringStation) public stations;
    mapping(uint256 => PollutionReport) public reports;
    mapping(uint8 => uint256) public thresholds;

    uint256 public totalStations;
    uint256 public totalReports;
    uint256 public nextReportId;

    // Events
    event StationRegistered(address indexed station, string name, address operator);
    event StationDeactivated(address indexed station);
    event ReportSubmitted(
        uint256 indexed reportId,
        address indexed station,
        uint8 pollutantType,
        uint256 timestamp
    );
    event ReportVerified(uint256 indexed reportId, address indexed verifier);
    event ThresholdUpdated(uint8 indexed pollutantType, uint256 newThreshold);
    event AlertTriggered(uint256 indexed reportId, uint8 pollutantType);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // Set default thresholds (μg/m³)
        thresholds[PM25] = 35;
        thresholds[PM10] = 150;
        thresholds[SO2] = 75;
        thresholds[NO2] = 100;
        thresholds[OZONE] = 70;
        thresholds[HEAVY_METALS] = 0;
    }

    /**
     * @notice Register a new monitoring station
     * @param name Station name
     */
    function registerStation(string memory name) external whenNotPaused {
        require(bytes(name).length > 0, "Invalid name");
        require(!stations[msg.sender].active, "Station already registered");

        stations[msg.sender] = MonitoringStation({
            name: name,
            operator: msg.sender,
            active: true,
            registeredAt: block.timestamp,
            reportCount: 0
        });

        totalStations++;
        _grantRole(MONITOR_ROLE, msg.sender);

        emit StationRegistered(msg.sender, name, msg.sender);
    }

    /**
     * @notice Submit encrypted pollution report
     * @param encryptedMeasurement Encrypted pollution value (euint64)
     * @param pollutantType Type of pollutant
     * @param severityLevel Severity assessment (1-5)
     */
    function submitReport(
        bytes memory encryptedMeasurement,
        uint8 pollutantType,
        uint8 severityLevel
    ) external nonReentrant whenNotPaused onlyRole(MONITOR_ROLE) {
        require(stations[msg.sender].active, "Station not active");
        require(pollutantType >= PM25 && pollutantType <= HEAVY_METALS, "Invalid pollutant type");
        require(severityLevel >= 1 && severityLevel <= 5, "Invalid severity level");

        uint256 reportId = nextReportId++;

        reports[reportId] = PollutionReport({
            station: msg.sender,
            encryptedMeasurement: encryptedMeasurement,
            pollutantType: pollutantType,
            severityLevel: severityLevel,
            timestamp: block.timestamp,
            verified: false
        });

        stations[msg.sender].reportCount++;
        totalReports++;

        emit ReportSubmitted(reportId, msg.sender, pollutantType, block.timestamp);

        // Trigger alert for high severity
        if (severityLevel >= 4) {
            emit AlertTriggered(reportId, pollutantType);
        }
    }

    /**
     * @notice Verify a pollution report
     * @param reportId Report ID to verify
     */
    function verifyReport(uint256 reportId)
        external
        onlyRole(VERIFIER_ROLE)
    {
        require(reportId < nextReportId, "Invalid report ID");
        require(!reports[reportId].verified, "Already verified");

        reports[reportId].verified = true;

        emit ReportVerified(reportId, msg.sender);
    }

    /**
     * @notice Update threshold for a pollutant type
     * @param pollutantType Type of pollutant
     * @param newThreshold New threshold value
     */
    function updateThreshold(uint8 pollutantType, uint256 newThreshold)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(pollutantType >= PM25 && pollutantType <= HEAVY_METALS, "Invalid pollutant type");

        thresholds[pollutantType] = newThreshold;

        emit ThresholdUpdated(pollutantType, newThreshold);
    }

    /**
     * @notice Deactivate a monitoring station
     * @param station Station address
     */
    function deactivateStation(address station)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(stations[station].active, "Station not active");

        stations[station].active = false;
        _revokeRole(MONITOR_ROLE, station);

        emit StationDeactivated(station);
    }

    /**
     * @notice Pause contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Get station details
     * @param station Station address
     */
    function getStationDetails(address station)
        external
        view
        returns (
            string memory name,
            address operator,
            bool active,
            uint256 registeredAt,
            uint256 reportCount
        )
    {
        MonitoringStation memory s = stations[station];
        return (s.name, s.operator, s.active, s.registeredAt, s.reportCount);
    }

    /**
     * @notice Get report details
     * @param reportId Report ID
     */
    function getReportDetails(uint256 reportId)
        external
        view
        returns (
            address station,
            bytes memory encryptedMeasurement,
            uint8 pollutantType,
            uint8 severityLevel,
            uint256 timestamp,
            bool verified
        )
    {
        require(reportId < nextReportId, "Invalid report ID");
        PollutionReport memory r = reports[reportId];
        return (
            r.station,
            r.encryptedMeasurement,
            r.pollutantType,
            r.severityLevel,
            r.timestamp,
            r.verified
        );
    }

    /**
     * @notice Get total statistics
     */
    function getStatistics()
        external
        view
        returns (
            uint256 _totalStations,
            uint256 _totalReports,
            uint256 _activeStations
        )
    {
        uint256 active = 0;
        // Note: In production, use a separate counter for active stations
        // to avoid gas-expensive iteration

        return (totalStations, totalReports, active);
    }
}
