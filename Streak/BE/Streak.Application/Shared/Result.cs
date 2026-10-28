namespace Streak.Application.Shared;

public record Error(string Code, string Message);

/// <summary>
/// Không tham chiếu gì tới HTTP. Việc đổi Result thành IResult (ASP.NET Core) nằm ở Streak.Api,
/// không nằm ở đây - Application không được biết web framework.
/// </summary>
public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Value { get; init; }
    public Error? Error { get; init; }

    public static Result<T> Ok(T value) => new() { IsSuccess = true, Value = value };
    public static Result<T> Fail(Error error) => new() { IsSuccess = false, Error = error };
}
