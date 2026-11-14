
using LaundryApp.DTO.BankAccount;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/bank-accounts")]
[Authorize]
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
    public async Task<IActionResult> GetAll()
    {
        var result = await _bankAccountService.GetAllAsync();

        return Ok(new
        {
            success = true,
            message = "Bank accounts retrieved successfully.",
            data = result
        });
    }

    // GET: api/bank-accounts/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _bankAccountService.GetByIdAsync(id);

        return Ok(new
        {
            success = true,
            message = "Bank account retrieved successfully.",
            data = result
        });
    }

    // POST: api/bank-accounts
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Create(
        [FromBody] CreateBankAccountDto dto)
    {
        var result = await _bankAccountService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            new
            {
                success = true,
                message = "Bank account created successfully.",
                data = result
            });
    }

    // PUT: api/bank-accounts/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateBankAccountDto dto)
    {
        var result = await _bankAccountService.UpdateAsync(id, dto);

        return Ok(new
        {
            success = true,
            message = "Bank account updated successfully.",
            data = result
        });
    }

    // DELETE: api/bank-accounts/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Deactivate(int id)
    {
        await _bankAccountService.DeactivateAsync(id);

        return Ok(new
        {
            success = true,
            message = "Bank account deactivated successfully."
        });
    }
}
