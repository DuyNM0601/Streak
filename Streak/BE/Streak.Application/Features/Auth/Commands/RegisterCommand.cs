using Streak.Application.Shared;

namespace Streak.Application.Features.Auth.Commands;

public sealed record RegisterCommand(string Email, string Password, string DisplayName) : ICommand<AuthResult>;
