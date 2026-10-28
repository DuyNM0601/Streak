using FluentValidation;

namespace Streak.Application.Features.StreakEntries.Commands;

public class CreateStreakEntryCommandValidator : AbstractValidator<CreateStreakEntryCommand>
{
    public CreateStreakEntryCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.CheckInDate).NotEmpty();
    }
}
