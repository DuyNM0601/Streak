using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Streak.Application.Common;
using Streak.Infrastructure.Auth;
using Streak.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Streak.Infrastructure
{
    public static class DependencyInjections
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>((servicesprovider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

            // Đọc thẳng từ configuration, không ép bắt buộc lúc khởi động: thiếu Jwt:Key / Google:ClientId
            // thì chỉ báo lỗi rõ ràng khi thật sự đăng nhập, để không chặn việc chạy API hay tạo migration.
            var jwtOptions = new JwtOptions();
            jwtOptions.Issuer = configuration["Jwt:Issuer"] ?? jwtOptions.Issuer;
            jwtOptions.Audience = configuration["Jwt:Audience"] ?? jwtOptions.Audience;
            jwtOptions.Key = configuration["Jwt:Key"] ?? jwtOptions.Key;
            if (int.TryParse(configuration["Jwt:ExpiresMinutes"], out int expiresMinutes))
                jwtOptions.ExpiresMinutes = expiresMinutes;
            services.AddSingleton(jwtOptions);

            var googleOptions = new GoogleOptions { ClientId = configuration["Google:ClientId"] ?? "" };
            services.AddSingleton(googleOptions);

            services.AddSingleton<ITokenService, JwtTokenService>();
            services.AddSingleton<IGoogleTokenVerifier, GoogleTokenVerifier>();
            return services;
        }
    }
}
