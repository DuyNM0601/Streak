using Microsoft.IdentityModel.JsonWebTokens;
using Streak.Application.Common;

namespace Streak.API.Shared
{
    public sealed class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
    {
        public string? UserId => accessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        public string? DisplayName => accessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Name)?.Value;
    }
}
