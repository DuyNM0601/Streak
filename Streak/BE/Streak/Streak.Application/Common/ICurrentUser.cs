namespace Streak.Application.Common
{
    /// <summary>Người đang đăng nhập, lấy từ claim của access token. Application chỉ biết interface này, API cài đặt.</summary>
    public interface ICurrentUser
    {
        /// <summary>Id của User (claim "sub"); null nếu chưa đăng nhập.</summary>
        string? UserId { get; }

        /// <summary>Tên hiển thị (claim "name"); null nếu chưa đăng nhập.</summary>
        string? DisplayName { get; }
    }
}
