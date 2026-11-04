using Streak.Application.Shared;

namespace Streak.Application.Features.Auth.Commands;

public sealed record LoginCommand(string Email, string Password) : ICommand<AuthResult>;
