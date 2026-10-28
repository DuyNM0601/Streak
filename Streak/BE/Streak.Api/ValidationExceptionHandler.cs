using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;

namespace Streak.Api;

/// <summary>
/// Bắt ValidationException do ValidationBehavior (ở Application) ném ra, đổi thành 400 gọn gàng.
/// Nằm ở Api vì đây là chuyển đổi sang HTTP response - việc của lớp ngoài cùng, không phải Application.
/// </summary>
public sealed class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationException)
        {
            return false;
        }

        var errors = validationException.Errors
            .GroupBy(failure => failure.PropertyName)
            .ToDictionary(group => group.Key, group => group.Select(f => f.ErrorMessage).ToArray());

        await Results.ValidationProblem(errors).ExecuteAsync(httpContext);

        return true;
    }
}
