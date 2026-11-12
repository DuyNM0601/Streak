using MediatR;
using Microsoft.AspNetCore.Mvc;
using Streak.API.Shared;
using Streak.Application.Features.Reminders.Commands;
using Streak.Application.Features.Reminders.Models;
using Streak.Application.Features.Reminders.Queries;

namespace Streak.API.Features.Reminders
{
    public static class ReminderEndpoints
    {
        public static void MapReminderApi(this IEndpointRouteBuilder endpoints)
        {
            // Mọi endpoint nhắc nhở đều cần đăng nhập; user lấy từ token qua ICurrentUser, không có trong body.
            var group = endpoints.MapGroup("/reminders").RequireAuthorization();

            group.MapPost("/", async ([FromBody] CreateReminderCommand command, ISender sender) =>
                (await sender.Send(command)).ToHttpResult())
            .Produces<ReminderModel>()
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized);

            group.MapGet("/", async (ISender sender) =>
                (await sender.Send(new ListRemindersQuery())).ToHttpResult())
            .Produces<IReadOnlyList<ReminderModel>>()
            .ProducesProblem(StatusCodes.Status401Unauthorized);

            // Id lấy từ đường dẫn, ghi đè Id (nếu có) trong body.
            group.MapPut("/{id}", async (string id, [FromBody] UpdateReminderCommand command, ISender sender) =>
                (await sender.Send(command with { Id = id })).ToHttpResult())
            .Produces<ReminderModel>()
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound);

            group.MapDelete("/{id}", async (string id, ISender sender) =>
            {
                var result = await sender.Send(new DeleteReminderCommand(id));
                return result.IsSuccess ? Results.NoContent() : result.ToHttpResult();
            })
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound);
        }
    }
}
