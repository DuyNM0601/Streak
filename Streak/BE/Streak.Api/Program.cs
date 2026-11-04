using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Streak.Api;
using Streak.Api.Features.Auth;
using Streak.Api.Features.StreakEntries;
using Streak.Application;
using Streak.Infrastructure;
using Streak.Infrastructure.Auth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// FE (Next.js, port 3000) gọi BE (port 5090) là cross-origin - không có CORS thì trình duyệt chặn hết.
builder.Services.AddCors(options => options.AddPolicy("Fe", policy => policy
    .WithOrigins("http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod()));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
builder.Services.AddAuthorization();
// Cấu hình kiểm tra token lấy từ cùng JwtOptions với JwtTokenService (1 nguồn duy nhất, lazy để
// ValidateOnStart báo lỗi thiếu Jwt:Key rõ ràng trước khi tới đây).
builder.Services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
    .Configure<IOptions<JwtOptions>>((bearer, jwt) =>
    {
        bearer.MapInboundClaims = false; // giữ nguyên tên claim "sub"/"email", không đổi sang ClaimTypes.*
        bearer.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = jwt.Value.Issuer,
            ValidAudience = jwt.Value.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Value.Key)),
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });

builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

app.UseCors("Fe");

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // giao diện thử API tại /scalar
}

app.MapAuthApi();
app.MapStreakEntryApi();

app.Run();
