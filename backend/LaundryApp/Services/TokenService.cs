using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace LaundryApp.Services;

public class TokenService
{
    public string GenerateAccessToken(
        string userId, string email, string userName)
    {
        var claims = new List<Claim>
        {
            // new Claim(
            //     ClaimTypes.Email,
            //     email)
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.UniqueName, userName),

            // Optional but useful
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Name, userName)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                Environment.GetEnvironmentVariable("JWT_SECRET_KEY")!));

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token =
            new JwtSecurityToken(
                issuer:
                    Environment.GetEnvironmentVariable("JWT_ISSUER"),
                audience:
                    Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
                claims: claims,
                expires:
                    DateTime.UtcNow.AddMinutes(
                        15),
                signingCredentials:
                    creds);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);

        return Convert.ToBase64String(bytes);
    }
}