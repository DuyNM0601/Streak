using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Streak.Application.Abstractions;
using Streak.Application.Shared;
using Streak.Domain.Models;

namespace Streak.Application.Features.Auth.Queries;

public sealed class GetCurrentUserQueryHandler(
    IApplicationDbContext db,
    ILogger<GetCurrentUserQueryHandler> logger) : QueryHandler<GetCurrentUserQuery, UserModel>(logger)
{
    public override async Task<Result<UserModel>> HandleAsync(GetCurrentUserQuery query, CancellationToken ct)
    {
        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == query.UserId, ct);

        if (user is null)
            return Fail(new Error("NotFound", "Không tìm thấy người dùng."));

        return Ok(new UserModel { Id = user.Id, Email = user.Email, DisplayName = user.DisplayName });
    }
}
