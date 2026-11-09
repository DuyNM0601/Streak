namespace Streak.Application.Shared
{
    /// <summary>Loại lỗi nghiệp vụ. Tầng API đổi loại này thành mã HTTP, Application không biết gì về HTTP.</summary>
    public enum ErrorType
    {
        Validation,
        Unauthorized,
        NotFound,
        Conflict,
    }

    /// <summary>Code: tên field bị sai (với Validation) hoặc mã lỗi cho FE rẽ nhánh (với các loại còn lại).</summary>
    public sealed record Error(ErrorType Type, string Code, string Message)
    {
        public static Error Validation(string field, string message) => new(ErrorType.Validation, field, message);

        public static Error Unauthorized(string message) => new(ErrorType.Unauthorized, nameof(Unauthorized), message);

        public static Error NotFound(string message) => new(ErrorType.NotFound, nameof(NotFound), message);

        public static Error Conflict(string message) => new(ErrorType.Conflict, nameof(Conflict), message);
    }

    public class Result<T>
    {
        public bool IsSuccess { get; init; }

        public T? Value { get; init; }

        public Error? Error { get; init; }

        public static Result<T> Ok(T value) => new() { IsSuccess = true, Value = value };

        public static Result<T> Fail(Error error) => new() { IsSuccess = false, Error = error };
    }
}
