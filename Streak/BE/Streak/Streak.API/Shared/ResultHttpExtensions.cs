using Streak.Application.Shared;

namespace Streak.API.Shared
{
    /// <summary>
    /// Hàm chung duy nhất đổi Result của Application thành phản hồi HTTP, mọi endpoint đều gọi nó.
    /// Thành công = 200 + Value. Thất bại: Validation = 400 dạng ValidationProblem (errors theo từng field),
    /// các loại khác = ProblemDetails với mã HTTP tương ứng. Chỉ nằm ở API vì IResult là kiểu của ASP.NET Core.
    /// </summary>
    public static class ResultHttpExtensions
    {
        public static IResult ToHttpResult<T>(this Result<T> result)
        {
            if (result.IsSuccess)
                return Results.Ok(result.Value);

            Error error = result.Error ?? throw new InvalidOperationException("Result failed but has no Error.");

            return error.Type switch
            {
                ErrorType.Validation => Results.ValidationProblem(
                    new Dictionary<string, string[]> { [error.Code] = [error.Message] }),
                ErrorType.Unauthorized => Problem(StatusCodes.Status401Unauthorized, error),
                ErrorType.NotFound => Problem(StatusCodes.Status404NotFound, error),
                ErrorType.Conflict => Problem(StatusCodes.Status409Conflict, error),
                _ => throw new InvalidOperationException($"ErrorType.{error.Type} is not mapped to an HTTP status code."),
            };
        }

        private static IResult Problem(int statusCode, Error error) =>
            Results.Problem(
                detail: error.Message,
                statusCode: statusCode,
                extensions: new Dictionary<string, object?> { ["code"] = error.Code });
    }
}
