using System.Text.Json.Serialization;

namespace Streak.Application.Features.Auth.Models
{
    /// <summary>Model trả về cho client sau khi đăng nhập, không lộ Entity.</summary>
    public class AuthModel
    {
        public string AccessToken { get; set; } = default!;

        public DateTimeOffset ExpiresAt { get; set; }

        public string UserId { get; set; } = default!;

        public string Email { get; set; } = default!;

        public string DisplayName { get; set; } = default!;

        public string? AvatarUrl { get; set; }

        /// <summary>Chỉ để tầng API đặt vào cookie HttpOnly, KHÔNG bao giờ nằm trong JSON trả về.</summary>
        [JsonIgnore]
        public string? RefreshToken { get; set; }

        [JsonIgnore]
        public DateTimeOffset RefreshTokenExpiresAt { get; set; }
    }
}
