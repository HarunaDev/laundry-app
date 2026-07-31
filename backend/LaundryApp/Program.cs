using Serilog;
using FluentValidation;
using LaundryApp.Services;
using LaundryApp.DTO.Responses;
using LaundryApp.Security;
using LaundryApp.Extensions;
using LaundryApp.Data;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using System.Threading.RateLimiting;
using System.Text;
using DotNetEnv;

// Load Environment variables
Env.Load();

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

// log data to file and console
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        "logs/laundryapp-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        shared: true,
        flushToDiskInterval: TimeSpan.FromSeconds(1)
    )
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<AdminService>();
builder.Services.AddSingleton<PasswordService>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<LaundryServiceService>();
builder.Services.AddScoped<LaundryItemService>();
builder.Services.AddScoped<LaundryLocationService>();
builder.Services.AddSingleton<HtmlSanitizerService>();

// add controllers
builder.Services.AddControllers();

builder.Services.Configure<ApiBehaviorOptions>(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return new BadRequestObjectResult(new ErrorResponse
            {
                Success = false,
                ErrorCode = "VALIDATION_ERROR",
                Message = "Validation failed.",
                Details = errors
            });
        };
    });

// db connection
var connectionString =
    $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
    $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
    $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
    $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
    $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")};" +
    $"SSL Mode=Require;Trust Server Certificate=true";

builder.Services.AddDbContext<LaundryAppDbContext>(
    options =>
        options.UseNpgsql(
            connectionString
            ));

// Authentication service
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ClockSkew = TimeSpan.Zero,

            ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),

            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        Environment.GetEnvironmentVariable("JWT_SECRET_KEY")!))
        };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Log.Warning(context.Exception, "JWT Authentication Failed");

            return Task.CompletedTask;
        },

        OnTokenValidated = context =>
        {
            Log.Information("User authenticated successfully");

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// rate limiter
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(
        "ApiPolicy",
        config =>
        {
            config.PermitLimit = 100;
            config.Window = TimeSpan.FromMinutes(1);
        });
});

builder.Services.AddSwaggerGen(options =>
            {
                // Configure basic information for the OpenAPI documentation (optional)
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "LaundryApp API",
                    Version = "v1",
                    Description = "ASP.NET Core Web API with JWT authentication. " +
                    "Target Framework is .NET 10. " +
                    "Swashbuckle.AspNetCore 6.9.0 is used."
                });

                // Add a Security Scheme (using a JWT Bearer token).
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Please enter token"
                });

                // Add a Security Requirement (without this, even if you set 
                // the JWT in the Authorize window, Swagger will not include
                // Authorization: Bearer ... in the request header).
                // In the code below, `document` is the OpenAPI document 
                // generated by SwaggerGen. Add a Security Requirement to 
                // that document.

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

            });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

var app = builder.Build();

app.UseRateLimiter();
app.UseGlobalExceptionHandler();
app.UseSecurityHeaders();
app.UseSerilogRequestLogging();
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await DbSeeder.SeedAsync(app.Services);

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();
app.MapGet("/", () => "h").ExcludeFromDescription();

app.Run();
