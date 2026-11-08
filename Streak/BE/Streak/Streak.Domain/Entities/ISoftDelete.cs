namespace Streak.Domain.Entities;

public interface ISoftDelete
{
    DateTimeOffset? DeletedAt { get; set; }

    string? DeletedBy { get; set; }
}
