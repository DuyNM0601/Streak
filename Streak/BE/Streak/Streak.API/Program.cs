using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Streak.API.Features.Auth;
using Streak.Application;
using Streak.Infrastructure;
using Streak.Infrastructure.Auth;
using Streak.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddProblemDetails();

// shortcut: origin FE ghi cứng cho dev (cổng 3000 khớp vite.config.ts), đưa vào cấu hình khi có domain thật.
builder.Services.AddCors(options => options.AddPolicy("Fe", policy =>
    policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials())); // credentials: cho cookie refresh token

// Kiểm access token do JwtTokenService ký, dùng chính JwtOptions đã đăng ký ở Infrastructure.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
builder.Services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
    .Configure<JwtOptions>((bearer, jwt) =>
    {
        // Giữ nguyên tên claim "sub"/"email"/"name"; mặc định JwtBearer đổi "sub" thành ClaimTypes.NameIdentifier.
        bearer.MapInboundClaims = false;
        bearer.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            // Thiếu / ngắn Key thì không có khoá để kiểm: mọi token đều bị từ chối (401), app vẫn chạy.
            IssuerSigningKey = jwt.Key.Length >= 32 ? new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)) : null,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandler();

app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // giao diện thử API tại /scalar, chỉ bật ở Development

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }
}

// Dev: FE gọi http://localhost:5083; redirect sang https làm preflight CORS thất bại, nên chỉ bật ngoài Development.
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors("Fe");

app.UseAuthentication();
app.UseAuthorization();

app.MapAuthApi();

app.Run();
