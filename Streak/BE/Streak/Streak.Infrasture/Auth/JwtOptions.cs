namespace Streak.Infrastructure.Auth
{
    /// <summary>
    /// Cấu hình JWT, đọc từ section "Jwt". Key KHÔNG đặt trong appsettings (không commit secret),
    /// dev dùng user-secrets: dotnet user-secrets set "Jwt:Key" "..." --project Streak.API
    /// </summary>
    public sealed class JwtOptions
    {
        public string Issuer { get; set; } = "streak-api";

        public string Audience { get; set; } = "streak-fe";

        /// <summary>Khoá ký HMAC-SHA256, tối thiểu 32 ký tự.</summary>
        public string Key { get; set; } = "";

        public int ExpiresMinutes { get; set; } = 60;
    }
}
