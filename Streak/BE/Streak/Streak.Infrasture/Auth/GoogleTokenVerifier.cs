using Google.Apis.Auth;
using Streak.Application.Common;

namespace Streak.Infrastructure.Auth
{
    public sealed class GoogleTokenVerifier(GoogleOptions options) : IGoogleTokenVerifier
    {
        public async Task<GoogleProfile?> VerifyAsync(string idToken, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(options.ClientId))
                throw new InvalidOperationException("Google:ClientId is not configured (set it with user-secrets).");

            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [options.ClientId],
                };
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

                if (!payload.EmailVerified)
                    return null;

                return new GoogleProfile(payload.Subject, payload.Email, payload.Name ?? payload.Email, payload.Picture);
            }
            catch (Exception ex) when (ex is InvalidJwtException or FormatException or Newtonsoft.Json.JsonException)
            {
                // Token sai chữ ký/hạn/audience (InvalidJwtException) hoặc không đúng định dạng JWT
                // (FormatException: không phải Base64; JsonException: phần header/payload không phải JSON).
                return null;
            }
        }
    }
}
