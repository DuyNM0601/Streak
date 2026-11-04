using Streak.Application.Shared;

namespace Streak.Api.Shared;

/// <summary>Đổi Result&lt;T&gt; (thuần, từ Application) sang IResult (HTTP). Chỉ nằm ở Api.</summary>
public static class ResultHttpExtensions
{
    public static IResult ToHttpResult<T>(this Result<T> result) =>
        result.IsSuccess ? Results.Ok(result.Value) : ToProblem(result.Error);

    public static IResult ToCreatedResult<T>(this Result<T> result, string locationPrefix) =>
        result.IsSuccess ? Results.Created($"{locationPrefix}/{result.Value}", result.Value)
                          : ToProblem(result.Error);

    // Error.Code (Application, không biết HTTP) -> status code. Code lạ hoặc không có thì 400.
    private static IResult ToProblem(Error? error) => Results.Problem(
        error?.Message,
        statusCode: error?.Code switch
        {
            "Unauthorized" => StatusCodes.Status401Unauthorized,
            "NotFound" => StatusCodes.Status404NotFound,
            "Conflict" => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status400BadRequest,
        });
}
