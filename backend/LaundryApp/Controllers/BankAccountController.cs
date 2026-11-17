
using LaundryApp.DTO.BankAccount;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/bank-accounts")]
[Authorize]
[Produces("application/json")]
public class BankAccountController : ControllerBase
{
    private readonly BankAccountService _bankAccountService;

    public BankAccountController(
        BankAccountService bankAccountService)
    {
        _bankAccountService = bankAccountService;
    }

    // GET: api/bank-accounts
    // Available bank accounts for customers making transfers.
    [HttpGet]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<IEnumerable<BankAccountResponseDto>>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _bankAccountService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<BankAccountResponseDto>>
        {
            Success = true,
            Message = "Bank accounts retrieved successfully.",
            Data = result
        });
    }

    // GET: api/bank-accounts/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<BankAccountResponseDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _bankAccountService.GetByIdAsync(id);

        return Ok(new ApiResponse<BankAccountResponseDto>
        {
            Success = true,
            Message = "Bank account retrieved successfully.",
            Data = result
        });
    }

    // POST: api/bank-accounts
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<BankAccountResponseDto>),
        StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create(
        [FromBody] CreateBankAccountDto dto)
    {
        var result = await _bankAccountService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            new ApiResponse<BankAccountResponseDto>
            {
                Success = true,
                Message = "Bank account created successfully.",
                Data = result
            });
    }

    // PUT: api/bank-accounts/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<BankAccountResponseDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateBankAccountDto dto)
    {
        var result = await _bankAccountService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<BankAccountResponseDto>
        {
            Success = true,
            Message = "Bank account updated successfully.",
            Data = result
        });
    }

    // DELETE: api/bank-accounts/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<object>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deactivate(int id)
    {
        await _bankAccountService.DeactivateAsync(id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Bank account deactivated successfully."
        });
    }
}
