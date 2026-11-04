using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.Auth.Queries;

public sealed record GetCurrentUserQuery(string UserId) : IQuery<UserModel>;
