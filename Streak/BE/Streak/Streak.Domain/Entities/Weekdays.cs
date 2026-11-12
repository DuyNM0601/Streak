namespace Streak.Domain.Entities;

/// <summary>Các ngày trong tuần dạng bit, lưu một cột int. Bit i = (DayOfWeek)i, nên Chủ nhật = 1, Thứ hai = 2, Thứ ba = 4...</summary>
[Flags]
public enum Weekdays
{
    None = 0,
    Sunday = 1 << (int)DayOfWeek.Sunday,
    Monday = 1 << (int)DayOfWeek.Monday,
    Tuesday = 1 << (int)DayOfWeek.Tuesday,
    Wednesday = 1 << (int)DayOfWeek.Wednesday,
    Thursday = 1 << (int)DayOfWeek.Thursday,
    Friday = 1 << (int)DayOfWeek.Friday,
    Saturday = 1 << (int)DayOfWeek.Saturday,
}

public static class WeekdaysExtensions
{
    public static Weekdays From(IEnumerable<DayOfWeek> days) =>
        days.Aggregate(Weekdays.None, (all, day) => all | (Weekdays)(1 << (int)day));

    public static DayOfWeek[] ToDays(this Weekdays weekdays) =>
        Enum.GetValues<DayOfWeek>().Where(day => weekdays.HasFlag((Weekdays)(1 << (int)day))).ToArray();
}
