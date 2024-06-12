// SPDX-License-Identifier: MIT
// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/utils/Address.sol




/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain`call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
      return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: value }(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/token/ERC20/IERC20.sol




/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/utils/ReentrancyGuard.sol




/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor () internal {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/utils/Context.sol




/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/access/Ownable.sol




/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/math/SafeMath.sol




/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryDiv}.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/token/ERC20/SafeERC20.sol







/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value, "SafeERC20: decreased allowance below zero");
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

// File: RWAStakingNative.sol



pragma solidity 0.6.12;







/**
  @title Staking implementation 
  @author tmortred, rony4d
  @notice implemented main interactive functions for staking
 */

contract RWAStakingNative is Ownable, ReentrancyGuard {

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  struct UserInfo {
    uint256[] stakingIds;
    uint256 lastStakeTime;
    uint256 rewardDebt;
  }

  uint256 constant MAX_BPS = 10_000;  // 10,000 Basis points which is 100% or 10000/100 = 100%
  uint256 constant WEEKS_OF_ONE_YEAR = 52;
  uint256 constant ONE_MONTH = 30 * 24 * 60 * 60;
  uint256 constant ONE_WEEK = 7 * 24 * 60 * 60;
  uint256 constant MAX_APR = 20_00; // 2,000 Basis points which is 20% or 2000/100 = 20%
  uint256 constant MIN_APR = 100;

  enum LOCK_PERIOD {
    NO_LOCK,
    THREE_MONTHS,
    SIX_MONTHS,
    NINE_MONTHS,
    TWELVE_MONTHS
  }

  address private _government;

  mapping (uint256 => uint256) public rewardDrop;
  mapping (address => UserInfo) public userInfo;
  mapping (uint256 => uint256) public deposits;
  mapping (uint256 => LOCK_PERIOD) public lockPeriod;
  mapping (uint256 => address) public depositor;
  mapping (uint256 => uint256) public stakeTime;
  mapping (address => uint256) public unclaimed;
  mapping (uint256 => address) public stakers;
  mapping (address => uint256) private stakerIndexMap;       // auxiliary mapping for stakers. it's not used externally

  uint256 public lastRewardWeek;
  uint256 immutable public startBlockTime;

  uint256[] public scoreLevels;
  mapping(uint256 => uint256) public rewardMultiplier;
  uint256 public counter;
  uint256 public reductionPercent = 3_000;
  uint256 public deductedBalance;
  uint256 public lockTime = ONE_WEEK;           // 7 days   
  uint256 public actionLimit = 24 * 3600;           // 1 day
  uint256 public maxActiveStake = 10;
  uint256 public totalStaked;
  uint256 public totalStakers;
  uint256 public treasury;
  mapping (uint256 => uint256) public totalWeightedScore;

  modifier onlyGovernment {
    require(_msgSender() == _government, "!government");
    _;
  }

  event Deposit(address indexed user, uint256 stakingId, uint256 amount, LOCK_PERIOD lockPeriod);
  event Withdraw(address indexed user, uint256 amount, LOCK_PERIOD lockPeriod, uint256 rewardAmount);
  event ForceUnlock(address indexed user, uint256 stakingId, uint256 amount, LOCK_PERIOD lockPeriod, uint256 offset);
  event RewardClaim(address indexed user, uint256 amount);
  event ReductionPercentChanged(uint256 oldReduction, uint256 newReduction);
  event GovernanceTransferred(address oldGov, address newGov);
  event LockTimeChanged(uint256 oldLockTime, uint256 newLockTime);
  event ActionLimitChanged(uint256 oldActionLimit, uint256 newActionLimit);
  event MaxActiveStakeUpdated(uint256 oldMaxActiveStake, uint256 newMaxActiveStake);
  event RewardAdded(uint256 added, uint256 treasury);
  event RewardWithdrawn(uint256 withdrawn, uint256 treasury);
  event RewardDropUpdated(uint256 rewardDrop, uint256 weekNumber);
  event DeductedBalanceWithdrawn(uint256 withdrawn);

  constructor(uint256 _rewardDrop) public {
    require(_rewardDrop != 0, "reward drop can't be zero");
    startBlockTime = block.timestamp;
    rewardDrop[0] = _rewardDrop;

    _government = _msgSender();

    scoreLevels.push(0);
    scoreLevels.push(500);
    scoreLevels.push(1000);
    scoreLevels.push(2000);
    scoreLevels.push(4000);
    scoreLevels.push(8000);
    scoreLevels.push(16000);
    scoreLevels.push(32000);
    scoreLevels.push(50000);
    scoreLevels.push(100000);
    rewardMultiplier[scoreLevels[0]] = 1000;
    rewardMultiplier[scoreLevels[1]] = 1025;
    rewardMultiplier[scoreLevels[2]] = 1050;
    rewardMultiplier[scoreLevels[3]] = 1100;
    rewardMultiplier[scoreLevels[4]] = 1200;
    rewardMultiplier[scoreLevels[5]] = 1400;
    rewardMultiplier[scoreLevels[6]] = 1800;
    rewardMultiplier[scoreLevels[7]] = 2600;
    rewardMultiplier[scoreLevels[8]] = 3500;
    rewardMultiplier[scoreLevels[9]] = 6000;
  }

  /**
    @notice
     a user can stake several times but only without lock period.
     locked staking is possible only one time for one wallet.
     locked staking and standard staking can't be combined.
    @param _lockPeriod enum value for representing lock period
   */
  function stake( LOCK_PERIOD _lockPeriod) external payable nonReentrant {
    // check if stake action valid
    require(msg.value > 0, "Cannot stake 0 RWA");

    uint256 _amount = msg.value;

    uint256 diff = block.timestamp.sub(userInfo[_msgSender()].lastStakeTime);
    require(diff > actionLimit, "staking too much in short period is not valid");
    uint256[] memory stakingIds = userInfo[_msgSender()].stakingIds;
    if (stakingIds.length != 0) {
      require(lockPeriod[stakingIds[0]] == LOCK_PERIOD.NO_LOCK && _lockPeriod == LOCK_PERIOD.NO_LOCK, "multi-staking works only for standard vault");
      require(stakingIds.length < maxActiveStake, "exceed maxActiveStake");
    }

    // update state variables
    counter = counter.add(1);
    if (stakingIds.length == 0) {
      stakerIndexMap[_msgSender()] = totalStakers;
      stakers[totalStakers] = _msgSender();
      totalStakers++;
    }
    
    deposits[counter] = _amount;
    totalStaked = totalStaked.add(_amount);
    depositor[counter] = _msgSender();
    stakeTime[counter] = block.timestamp;
    userInfo[_msgSender()].lastStakeTime = block.timestamp;
    lockPeriod[counter] = _lockPeriod;
    userInfo[_msgSender()].stakingIds.push(counter);

    // transfer tokens
    // token.safeTransferFrom(_msgSender(), address(this), _amount);

    emit Deposit(_msgSender(), counter, _amount, _lockPeriod);
  }

  /**
   * @notice
   *  withdraw tokens with reward gain
   *  users can't unstake partial amount
   */
  function unstake() external nonReentrant {
    // check if unstake action is valid
    require(userInfo[_msgSender()].stakingIds.length > 0, "no active staking");
    uint256 diff = block.timestamp.sub(userInfo[_msgSender()].lastStakeTime);
    require(diff > lockTime, "can't unstake within minimum lock time"); 
    uint256 stakingId = userInfo[_msgSender()].stakingIds[0];
    uint256 lock = uint256(lockPeriod[stakingId]).mul(3).mul(ONE_MONTH);
    require(diff > lock, "locked");
    
    // calculate the reward amount
    uint256 reward = _pendingReward(_msgSender()).sub(userInfo[_msgSender()].rewardDebt);
    if (reward > treasury) {
      unclaimed[_msgSender()] = reward.sub(treasury);
      reward = treasury;
      delete treasury;
    } else {
      treasury = treasury.sub(reward);
    }
    
    // transfer tokens to the _msgSender()  
    // uint256 stakeAmount = _getTotalStaked(_msgSender());
    // token.safeTransfer(_msgSender(), stakeAmount.add(reward));

    // Update to use native coin for unstaking
    uint256 stakeAmount = _getTotalStaked(_msgSender());
    payable(_msgSender()).transfer(stakeAmount.add(reward));

    // update the state variables
    totalStaked = totalStaked.sub(stakeAmount);
    delete userInfo[_msgSender()];
    
    uint256 csi = stakerIndexMap[_msgSender()];
    totalStakers--;
    stakers[csi] = stakers[totalStakers];
    stakerIndexMap[stakers[csi]] = csi;
    delete stakers[totalStakers];
    delete stakerIndexMap[_msgSender()];
    
    emit Withdraw(_msgSender(), stakeAmount, lockPeriod[stakingId], reward);
  }

  /**
   * @notice
   *  claim reward accumulated so far
   * @dev
   *  claimed reward amount is reflected when next claim reward or standard unstake action
   */
  function claimReward() external nonReentrant {
    require(treasury > 0, "reward pool is empty");
    
    uint256 claimed;
    if (unclaimed[_msgSender()] > 0) {
      require(unclaimed[_msgSender()] <= treasury, "insufficient");
      // token.safeTransfer(_msgSender(), unclaimed[_msgSender()]); 
      claimed = unclaimed[_msgSender()];
      // Update to use native coin for reward
      payable(_msgSender()).transfer(claimed);
      delete unclaimed[_msgSender()];
    } else {
      uint256 reward = _pendingReward(_msgSender()).sub(userInfo[_msgSender()].rewardDebt);
      require(reward > 0, "pending reward amount is zero");

      if (reward >= treasury) {
        reward = treasury;
        delete treasury;
      } else {
        treasury = treasury.sub(reward);
      }
      
      // token.safeTransfer(_msgSender(), reward);
      claimed = reward;
      // Update to use native coin for staking
      payable(_msgSender()).transfer(claimed);
      userInfo[_msgSender()].rewardDebt = userInfo[_msgSender()].rewardDebt.add(reward);
    }
    
    emit RewardClaim(_msgSender(), claimed);
  }

  /**
   * @notice 
   *  a user can unstake before lock time ends but original fund is 
   *  deducted by up to 30 percent proportional to the end of lockup
   * @dev can't call this function when lockup released
   * @param stakingId staking id to unlock
   */
  function forceUnlock(uint256 stakingId) external nonReentrant {
    // check if it is valid
    require(_msgSender() == depositor[stakingId], "!depositor");
    uint256 diff = block.timestamp.sub(stakeTime[stakingId]);
    require(diff > lockTime, "can't unstake within minimum lock time");

    uint256 lock = uint256(lockPeriod[stakingId]).mul(3).mul(ONE_MONTH);
    require(diff < lock, "unlocked status");
    uint256 offset = lock.sub(diff);
    //  deposits * 30% * offset / lock
    uint256 reduction = deposits[stakingId].mul(reductionPercent).div(MAX_BPS).mul(offset).div(lock);
    
    // token.safeTransfer(_msgSender(), deposits[stakingId].sub(reduction));

    // Update to use native coin for force unlock
    payable(_msgSender()).transfer(deposits[stakingId].sub(reduction));

    deductedBalance = deductedBalance.add(reduction);
    
    emit ForceUnlock(_msgSender(), stakingId, deposits[stakingId], lockPeriod[stakingId], offset);

    // update the state variables
    totalStaked = totalStaked.sub(deposits[stakingId]);
    delete deposits[stakingId];
    delete userInfo[_msgSender()];

    uint256 csi = stakerIndexMap[_msgSender()];
    totalStakers--;
    stakers[csi] = stakers[totalStakers];
    stakerIndexMap[stakers[csi]] = csi;
    delete stakers[totalStakers];
    delete stakerIndexMap[_msgSender()];
  }

  /**
   * @notice
   *  reflect the total weighted score calculated from the external script(off-chain) to the contract.
   *  this function supposed to be called every week.
   *  only government can call this function
   * @param _totalWeightedScore total weighted score
   * @param weekNumber the week counter
   */
  function updatePool(uint256 _totalWeightedScore, uint256 weekNumber) external onlyGovernment {
    require(weekNumber > lastRewardWeek, "invalid call");
    
    for (uint256 i = lastRewardWeek + 1; i <= weekNumber; i++) {
      totalWeightedScore[i-1] = _totalWeightedScore;
      if (i > 1 && rewardDrop[i-1] == 0) {
        rewardDrop[i-1] = rewardDrop[i-2].sub(rewardDrop[i-2].div(100));
      }
      
      uint256 _apr;
      if (totalStaked > 0) {
        _apr = rewardDrop[i-1].mul(WEEKS_OF_ONE_YEAR).mul(MAX_BPS).div(totalStaked);
      } else {
        _apr = MAX_APR;
      }
      
      if (_apr > MAX_APR) {
        rewardDrop[i-1] = totalStaked.mul(MAX_APR).div(WEEKS_OF_ONE_YEAR).div(MAX_BPS);
      } else if (_apr < MIN_APR) {
        rewardDrop[i-1] = totalStaked.mul(MIN_APR).div(WEEKS_OF_ONE_YEAR).div(MAX_BPS).add(1);
      }
    }

    lastRewardWeek = weekNumber;
  }

  //////////////////////////////////////
  ////        View functions        ////
  //////////////////////////////////////

  
  /**
   * @notice
   *  apr value from the staking logic model
   * @dev can't be over `MAX_APR`
   * @return _apr annual percentage rate
   */
  function apr() external view returns (uint256) {
    uint256 current = block.timestamp.sub(startBlockTime).div(ONE_WEEK);
    uint256 _apr;
    if (totalStaked == 0 || current == 0) {
      _apr = MAX_APR;
    } else {
      _apr = rewardDrop[current - 1].mul(WEEKS_OF_ONE_YEAR).mul(MAX_BPS).div(totalStaked);
    }
    
    return _apr;
  }

  function getLengthOfStakers() external view returns (uint256) {
    return totalStakers;
  }

  function getTotalStaked(address user) external view returns (uint256) {
    return _getTotalStaked(user);
  }

  function getStakingIds(address user) external view returns (uint256[] memory) {
    return userInfo[user].stakingIds;
  }

  function getStakingInfo(uint256 stakingId) external view returns (address, uint256, uint256, LOCK_PERIOD) {
    return (depositor[stakingId], deposits[stakingId], stakeTime[stakingId], lockPeriod[stakingId]);
  }

  function getWeightedScore(address _user, uint256 weekNumber) external view returns (uint256) {
    return _getWeightedScore(_user, weekNumber);
  }

  function pendingReward(address _user) external view returns (uint256) {
    if (unclaimed[_user] > 0) {
      return unclaimed[_user];
    } else {
      return _pendingReward(_user).sub(userInfo[_user].rewardDebt);
    }
  }

  function government() external view returns (address) {
    return _government;
  }

  //////////////////////////////
  ////    Admin functions   ////
  //////////////////////////////

  function addReward() external payable onlyOwner {
    // require(IERC20(token).balanceOf(_msgSender()) >= amount, "not enough tokens to deliver");
    // IERC20(token).safeTransferFrom(_msgSender(), address(this), amount);
    // treasury = treasury.add(amount);

    // Update to use native coin for adding reward

    require(msg.value > 0, "Cannot add 0 RWA reward");

    uint256 amount = msg.value;

    treasury = treasury.add(amount);

    emit RewardAdded(amount, treasury);
  }

  function withdrawReward(uint256 amount) external onlyOwner {
    if (amount > treasury) {
      amount = treasury;
    }
    // IERC20(token).safeTransfer(_msgSender(), amount);
    // Update to use native coin for withdrawing reward
    payable(_msgSender()).transfer(amount);

    treasury = treasury.sub(amount);

    emit RewardWithdrawn(amount, treasury);
  }

  function withdrawDeductedBalance() external onlyOwner {
    require(deductedBalance > 0, "no balance to withdraw");
    // IERC20(token).safeTransfer(_msgSender(), deductedBalance);
    payable(_msgSender()).transfer(deductedBalance);
    emit DeductedBalanceWithdrawn(deductedBalance);
    delete deductedBalance;
  }

  function setLockTime(uint256 _lockTime) external onlyOwner {
    require(_lockTime != 0, "!zero");
    emit LockTimeChanged(lockTime, _lockTime);
    lockTime = _lockTime;
  }

  function setReductionPercent(uint256 _reductionPercent) external onlyOwner {
    require(_reductionPercent < MAX_BPS, "overflow");
    emit ReductionPercentChanged(reductionPercent, _reductionPercent);
    reductionPercent = _reductionPercent;
  }

  function setRewardDrop(uint256 _rewardDrop) external onlyOwner {
    require(totalStaked > 0, "no staked tokens");
    uint256 _apr = _rewardDrop.mul(WEEKS_OF_ONE_YEAR).mul(MAX_BPS).div(totalStaked);
    require(_apr >= MIN_APR, "not meet MIN APR");
    require(_apr <= MAX_APR, "not meet MAX APR");
    uint256 current = block.timestamp.sub(startBlockTime).div(ONE_WEEK);
    rewardDrop[current] = _rewardDrop;

    emit RewardDropUpdated(_rewardDrop, current);
  }

  function transferGovernance(address _newGov) external onlyOwner {
    require(_newGov != address(0), "new governance is the zero address");
    emit GovernanceTransferred(_government, _newGov);
    _government = _newGov;
  }

  function setActionLimit(uint256 _actionLimit) external onlyOwner {
    require(_actionLimit != 0, "!zero");
    emit ActionLimitChanged(actionLimit, _actionLimit);
    actionLimit = _actionLimit;
  }

  function setMaxActiveStake(uint256 _maxActiveStake) external onlyOwner {
    require(_maxActiveStake !=0, "!zero");
    emit MaxActiveStakeUpdated(maxActiveStake, _maxActiveStake);
    maxActiveStake = _maxActiveStake;
  }

  /////////////////////////////////
  ////    Internal functions   ////
  /////////////////////////////////

  // get the total staked amount of user
  function _getTotalStaked(address user) internal view returns (uint256) {
    uint256 _totalStaked;
    uint256[] memory stakingIds = userInfo[user].stakingIds;
    // the length of `stakingIds` is limited to `maxActiveStake` to avoid too much gas consumption.
    for (uint i; i < stakingIds.length; i++) {
      uint256 stakingId = stakingIds[i];
      _totalStaked = _totalStaked.add(deposits[stakingId]);
    }

    return _totalStaked;
  }

  function _pendingReward(address _user) internal view returns (uint256) {
    uint256 reward;
    uint256 firstStakingId = userInfo[_user].stakingIds[0];
    uint256 firstStakeWeek = stakeTime[firstStakingId].sub(startBlockTime).div(ONE_WEEK);
    uint256 current = block.timestamp.sub(startBlockTime).div(ONE_WEEK);
    for (uint i = firstStakeWeek; i <= current; i++) {
      uint256 weightedScore = _getWeightedScore(_user, i);
      if (totalWeightedScore[i] != 0) {
        reward = reward.add(rewardDrop[i].mul(weightedScore).div(totalWeightedScore[i]));
      }
    }
    return reward;
  }

  function _getWeightedScore(address _user, uint256 weekNumber) internal view returns (uint256) {
    // calculate the basic score
    uint256 score;
    uint256[] memory stakingIds = userInfo[_user].stakingIds;
    // the length of `stakingIds` is limited to `maxActiveStake` to avoid too much gas consumption.
    for (uint i; i < stakingIds.length; i++) {
      uint256 stakingId = stakingIds[i];
      uint256 _score = getScore(stakingId, weekNumber);
      score = score.add(_score);
    }

    // calculate the weighted score
    if (score == 0) return 0;

    uint256 weightedScore;
    for (uint i; i < scoreLevels.length; i++) {
      if (score > scoreLevels[i]) {
        weightedScore = score.mul(rewardMultiplier[scoreLevels[i]]);
      } else {
        return weightedScore;
      }
    }

    return weightedScore;

  }

  function getScore(uint256 stakingId, uint256 weekNumber) internal view returns (uint256) {
    uint256 score;
    uint256 stakeWeek = stakeTime[stakingId].sub(startBlockTime).div(ONE_WEEK);
    if (stakeWeek > weekNumber) return 0;
    uint256 diff = weekNumber.sub(stakeWeek) > WEEKS_OF_ONE_YEAR ? WEEKS_OF_ONE_YEAR : weekNumber.sub(stakeWeek);
    uint256 lockScore = deposits[stakingId].mul(uint256(lockPeriod[stakingId])).mul(3).div(12);
    score = deposits[stakingId].mul(diff + 1).div(WEEKS_OF_ONE_YEAR).add(lockScore);
    if (score > deposits[stakingId]) {
      score = deposits[stakingId].div(1e18);
    } else {
      score = score.div(1e18);
    }

    return score;
  }
}