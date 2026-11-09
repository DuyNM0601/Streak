using Streak.Application.Features.Auth.Models;
using Streak.Application.Shared;

namespace Streak.Application.Features.Auth.Commands
{
    public sealed record GoogleLoginCommand(string IdToken) : ICommand<AuthModel>;
}
