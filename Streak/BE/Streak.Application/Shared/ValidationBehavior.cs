using FluentValidation;
using MediatR;

namespace Streak.Application.Shared;

/// <summary>
/// Pipeline MediatR: validate command/query bằng FluentValidation trước khi vào Handler.
/// Chỉ ném exception cho lỗi hình dạng input; lỗi nghiệp vụ vẫn trả Result.Fail trong Handler.
/// </summary>
public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Count == 0)
            return await next();

        var message = string.Join("; ", failures.Select(f => f.ErrorMessage));
        throw new ValidationException(message, failures);
    }
}
