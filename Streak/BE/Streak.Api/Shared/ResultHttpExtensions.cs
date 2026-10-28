using Streak.Application.Shared;

namespace Streak.Api.Shared;

/// <summary>Đổi Result&lt;T&gt; (thuần, từ Application) sang IResult (HTTP). Chỉ nằm ở Api.</summary>
public static class ResultHttpExtensions
{
    public static IResult ToHttpResult<T>(this Result<T> result) =>
        result.IsSuccess ? Results.Ok(result.Value) : Results.Problem(result.Error?.Message, statusCode: 400);

    public static IResult ToCreatedResult<T>(this Result<T> result, string locationPrefix) =>
        result.IsSuccess ? Results.Created($"{locationPrefix}/{result.Value}", result.Value)
                          : Results.Problem(result.Error?.Message, statusCode: 400);

    public static IResult ToFoundResult<T>(this Result<T> result) =>
        result.IsSuccess
            ? (result.Value is null ? Results.NotFound() : Results.Ok(result.Value))
            : Results.Problem(result.Error?.Message, statusCode: 400);
}
