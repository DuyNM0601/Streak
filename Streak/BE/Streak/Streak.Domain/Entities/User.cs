using System.ComponentModel.DataAnnotations;

namespace Streak.Domain.Entities;

public class User : BaseEntity, IAuditable, ISoftDelete
{
    [MaxLength(256)]
    public string ExternalId { get; set; } = default!;

    [MaxLength(256)]
    public string Email { get; set; } = default!;

    [MaxLength(100)]
    public string DisplayName { get; set; } = default!;

    [MaxLength(2048)]
    public string? AvatarUrl { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    [MaxLength(36)]
    public string? CreatedBy { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    [MaxLength(36)]
    public string? UpdatedBy { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    [MaxLength(36)]
    public string? DeletedBy { get; set; }
}
