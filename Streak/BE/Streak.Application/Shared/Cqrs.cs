using MediatR;
using Microsoft.Extensions.Logging;

namespace Streak.Application.Shared;

public interface ICommand<TResult> : IRequest<Result<TResult>>;
public interface IQuery<TResult> : IRequest<Result<TResult>>;

public abstract class CommandHandler<TCommand, TResult>(ILogger logger) : IRequestHandler<TCommand, Result<TResult>>
    where TCommand : ICommand<TResult>
{
    protected readonly ILogger Logger = logger;

    public abstract Task<Result<TResult>> HandleAsync(TCommand command, CancellationToken ct);

    public Task<Result<TResult>> Handle(TCommand request, CancellationToken ct) => HandleAsync(request, ct);

    protected static Result<TResult> Ok(TResult value) => Result<TResult>.Ok(value);
    protected static Result<TResult> Fail(Error error) => Result<TResult>.Fail(error);
}

public abstract class QueryHandler<TQuery, TResult>(ILogger logger) : IRequestHandler<TQuery, Result<TResult>>
    where TQuery : IQuery<TResult>
{
    protected readonly ILogger Logger = logger;

    public abstract Task<Result<TResult>> HandleAsync(TQuery query, CancellationToken ct);

    public Task<Result<TResult>> Handle(TQuery request, CancellationToken ct) => HandleAsync(request, ct);

    protected static Result<TResult> Ok(TResult value) => Result<TResult>.Ok(value);
    protected static Result<TResult> Fail(Error error) => Result<TResult>.Fail(error);
}
