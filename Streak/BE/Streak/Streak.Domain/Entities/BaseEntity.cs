using System.ComponentModel.DataAnnotations;

namespace Streak.Domain.Entities;

/// <summary>Lớp cha cho mọi entity, chỉ giữ khoá chính. Mốc tạo / sửa / xoá nằm ở các interface riêng, entity nào cần mới implement.</summary>
public abstract class BaseEntity
{
    /// <summary>Guid dạng chuỗi luôn dài 36 ký tự, nên giới hạn 36 thay vì để SQL Server dùng mặc định cho khoá (450).</summary>
    [MaxLength(36)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
}
