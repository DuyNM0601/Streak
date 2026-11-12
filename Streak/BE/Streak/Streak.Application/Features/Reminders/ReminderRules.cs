using Streak.Application.Shared;

namespace Streak.Application.Features.Reminders
{
    /// <summary>Luật kiểm tra dùng chung cho tạo và sửa nhắc nhở. Trả Error.Validation đầu tiên gặp, null nếu hợp lệ.</summary>
    internal static class ReminderRules
    {
        public const int MaxTitleLength = 200;

        public static Error? Validate(string? title, DayOfWeek[]? days, string? timeZoneId)
        {
            if (string.IsNullOrWhiteSpace(title))
                return Error.Validation("Title", "Title is required.");
            if (title.Trim().Length > MaxTitleLength)
                return Error.Validation("Title", $"Title must be at most {MaxTitleLength} characters.");

            if (days is not { Length: > 0 } || days.Any(d => !Enum.IsDefined(d)))
                return Error.Validation("Days", "Pick at least one valid day of the week (0 = Sunday ... 6 = Saturday).");

            if (!IsKnownTimeZone(timeZoneId))
                return Error.Validation("TimeZoneId", "TimeZoneId is not a known time zone (example: Asia/Ho_Chi_Minh).");

            return null;
        }

        private static bool IsKnownTimeZone(string? id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return false;
            try
            {
                TimeZoneInfo.FindSystemTimeZoneById(id);
                return true;
            }
            catch (Exception ex) when (ex is TimeZoneNotFoundException or InvalidTimeZoneException)
            {
                return false;
            }
        }
    }
}
