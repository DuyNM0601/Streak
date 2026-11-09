namespace Streak.Application.Common
{
    public sealed record GoogleProfile(string Subject, string Email, string DisplayName, string? PictureUrl);

    public interface IGoogleTokenVerifier
    {
        Task<GoogleProfile?> VerifyAsync(string idToken, CancellationToken cancellationToken);
    }
}
