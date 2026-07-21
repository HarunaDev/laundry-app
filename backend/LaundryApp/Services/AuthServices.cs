using LaundryApp.DTO;
using LaundryApp.DTO.Auth;
using LaundryApp.Models;
using LaundryApp.Data;
using Microsoft.EntityFrameworkCore;
using LaundryApp.Exceptions;

namespace LaundryApp.Services;

public class AuthService
{
    private readonly PasswordService _passwordService;

    private readonly TokenService _tokenService;

    private readonly LaundryAppDbContext _context;

    public AuthService(
        LaundryAppDbContext context,
        PasswordService passwordService,
        TokenService tokenService)
    {
        _context = context;
        _passwordService =
            passwordService;

        _tokenService =
            tokenService;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {

        var exists =
        await _context.Users.AnyAsync(
            u =>
                u.Email == dto.Email ||
                u.UserName == dto.UserName);

        if (exists)
        {
            throw new ConflictException(
                "Username or Email already exists");
        }

        var user = new User
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PasswordHash =
                _passwordService.Hash(
                    dto.Password),
            Role = UserRole.Client
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();
    }

    public async Task<AuthResultDto> LoginAsync(
    LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(
            u => u.Email == dto.Email);

        if (user is null)
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        var valid =
            _passwordService.Verify(
                user.PasswordHash,
                dto.Password);

        if (!valid)
        {
            throw new UnauthorizedException(
                "Invalid email or password");
        }

        var accessToken =
            _tokenService.GenerateAccessToken(
                user.Id,
                user.Email,
                user.UserName,
                user.Role.ToString()
            );

        var refreshToken =
            _tokenService.GenerateRefreshToken();

        _context.RefreshTokens.Add(
            new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt =
                    DateTime.UtcNow.AddDays(7)
            });

        await _context.SaveChangesAsync();

        return new AuthResultDto
        {
            UserId = user.Id,
            Tokens = new TokenDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            }
        };
    }

    public async Task<TokenDto> RefreshTokenAsync(
        RefreshTokenRequestDto dto)
    {
        var token =
            await _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(
                    r => r.Token ==
                         dto.RefreshToken);

        if (token is null)
        {
            throw new UnauthorizedException(
                "Invalid refresh token");
        }

        if (token.IsRevoked)
        {
            throw new UnauthorizedException(
                "Refresh token has been revoked");
        }

        if (token.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedException(
                "Refresh token has expired");
        }

        var accessToken =
            _tokenService.GenerateAccessToken(
                token.User.Id,
                token.User.Email,
                token.User.UserName,
                token.User.Role.ToString());

        return new TokenDto
        {
            AccessToken = accessToken,
            RefreshToken = token.Token
        };
    }
}