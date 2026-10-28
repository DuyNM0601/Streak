# CLAUDE.md — Streak

Người dùng nói chuyện bằng tiếng Việt. Trả lời, comment giải thích và copy giao diện bằng tiếng Việt. Tên class, biến, endpoint và event dùng tiếng Anh.

## 1. Tổng quan

- Dự án: Streak, web giúp người dùng giữ kỷ luật cá nhân (dậy sớm, học bài, làm việc, bỏ game...) bằng nhắc nhở đúng giờ qua thông báo web, email và gọi điện. Nếu chưa xác nhận thì hệ thống leo thang sang kênh mạnh hơn.
- Tác giả: Nguyễn Mạnh Duy. Dự án cá nhân, **mục đích chính là học Clean Architecture + CQRS để đi phỏng vấn**, không chỉ để chạy sản phẩm.
- Entity thật của Streak (`Reminder`, `User`, `ReminderChannel`...) **chưa được dựng**. Project hiện tại đang dùng entity mẫu `StreakEntry` (check-in theo ngày, tính streak cộng dồn) để luyện khung kiến trúc trước. Khi bắt đầu nghiệp vụ thật, copy đúng cấu trúc `Features/StreakEntries/` làm mẫu.
- Mockup giao diện và sơ đồ kiến trúc nằm ở artifact Claude "Kairo Mockup" / "Kairo Kiến trúc" (tên cũ của dự án, hiểu là Streak) — chỉ để tham khảo ý tưởng sản phẩm, không phải kiến trúc code (kiến trúc đã đổi nhiều lần sau đó, mục này mới là bản đúng).

## 2. Công nghệ

- .NET 10, C#, ASP.NET Core **Minimal API** (không dùng Controller)
- EF Core 10 + SQL Server
- **MediatR 12.0.1** cho CQRS — ghim đúng bản này, vì từ bản 13.0 (7/2025) MediatR chuyển sang licence kép (RPL 1.5 / thương mại qua công ty Lucky Penny Software của Jimmy Bogard). 12.0.1 là bản Apache 2.0 thuần, không có vấn đề licence, dù không còn fix mới.
- FluentValidation 12.2.0
- `Microsoft.AspNetCore.OpenApi` (OpenAPI mặc định của .NET, không dùng Swashbuckle/Scalar ở service này)

## 3. Kiến trúc: Clean Architecture + Vertical Slice + CQRS/MediatR

5 project .NET, mô phỏng theo kiến trúc một codebase thật (nội bộ, không phải tài liệu công khai) tên "OrderHub". **Không dùng Repository pattern** — Application gọi qua `IApplicationDbContext`.

```
Streak/BE/
  Streak.slnx
  Directory.Build.props      # TargetFramework net10.0, Nullable, ImplicitUsings
  Directory.Packages.props   # khoá version NuGet tập trung (Central Package Management)
  Streak.Domain/
    Entities/StreakEntry.cs          # entity thật, không biết EF Core, không biết ai cả
    Models/StreakEntryModel.cs       # DTO trả ra ngoài, không lộ Entity qua API
  Streak.Application/
    Abstractions/IApplicationDbContext.cs   # Application chỉ biết interface này, không biết EF Core thật
    Shared/Result.cs           # Result<T>, Error — thuần, KHÔNG được tham chiếu IResult (ASP.NET Core)
    Shared/Cqrs.cs              # ICommand/IQuery, CommandHandler<,>/QueryHandler<,> (HandleAsync public abstract)
    Shared/ValidationBehavior.cs   # pipeline MediatR, throw ValidationException cho lỗi input
    Features/StreakEntries/
      Commands/CreateStreakEntryCommand(+Validator+Handler)
      Queries/GetStreakEntryByIdQuery(+Handler), SearchStreakEntriesQuery(+Handler)
    DependencyInjection.cs      # AddApplication(): AddMediatR + AddValidatorsFromAssemblyContaining
  Streak.Infrastructure/
    StreakDbContext.cs : IApplicationDbContext   # cài đặt interface của Application
    Entities/StreakEntryConfiguration.cs          # Fluent API, map entity sang bảng SQL
    DependencyInjection.cs      # AddInfrastructure(config): AddDbContext + đăng ký IApplicationDbContext
  Streak.Migrations/
    StreakDbContextFactory.cs   # IDesignTimeDbContextFactory, chỉ dùng lúc tạo/chạy migration
  Streak.Api/
    Shared/ResultHttpExtensions.cs   # ToHttpResult/ToCreatedResult/ToFoundResult — CHỈ ở đây, vì IResult là kiểu ASP.NET Core
    ValidationExceptionHandler.cs    # bắt ValidationException, đổi thành 400 ValidationProblem
    Features/StreakEntries/StreakEntryEndpoints.cs   # MapStreakEntryApi(), chỉ map route, gọi ISender
    Program.cs
FE/   (chưa dựng)   # Next.js, xem mục 6
```

### Quy tắc phụ thuộc (bắt buộc kiểm tra mỗi khi thêm project reference)

```
Domain  ←  Application  ←  Infrastructure  ←  Migrations
                ↑                                  ↑
                └──────────────── Api ──────────────┘
```

- `Domain`: không tham chiếu project nào, không biết EF Core, không biết ASP.NET Core.
- `Application`: chỉ tham chiếu `Domain`. Được dùng `Microsoft.EntityFrameworkCore` (gói gốc, chỉ để có kiểu `DbSet<T>` trong `IApplicationDbContext`) và `Microsoft.Extensions.Logging.Abstractions` (`ILogger` — đây là abstraction logging thuần, không phải ASP.NET Core, được phép dùng ở lớp trong). **Không được dùng `Microsoft.AspNetCore.*` ở đây** — kể cả `IResult`. Đây là lỗi thật tôi từng mắc (để `ToHttpResult()` lẫn vào `Shared/Result.cs` của Application) và phải sửa lại.
- `Infrastructure`: tham chiếu `Application` + `Domain`, cài đặt `IApplicationDbContext`.
- `Migrations`: tham chiếu `Infrastructure`. Chỉ chứa `IDesignTimeDbContextFactory`, không chứa gì khác.
- `Api`: tham chiếu `Application`, `Infrastructure`, `Migrations`. Là nơi **duy nhất** được biết `IResult`, `HttpContext`, đăng ký DI.

### Vertical Slice bên trong Application

Mỗi tính năng một thư mục dưới `Features/{Entity}/`, tách `Commands/` và `Queries/`. Khi thêm tính năng mới, copy đúng khuôn `Features/StreakEntries/`:
- `{Action}{Entity}Command` hoặc `Query`, implement `ICommand<TResult>`/`IQuery<TResult>`.
- `{CommandOrQuery}Handler` kế thừa `CommandHandler<,>`/`QueryHandler<,>`, override `HandleAsync` (public abstract), nhận `IApplicationDbContext` qua constructor.
- Command có validator thì thêm `{Command}Validator : AbstractValidator<T>`.
- `Streak.Api/Features/{Entity}/{Entity}Endpoints.cs` — method `Map{Entity}Api()`, chỉ gọi `ISender`, không chứa logic.

### Result pattern

- Handler không `throw` cho lỗi nghiệp vụ (ví dụ trùng check-in) — trả `Fail(new Error(...))`.
- `ValidationException` (từ `ValidationBehavior`) là **ngoại lệ duy nhất được throw**, chỉ dùng cho lỗi hình dạng input (FluentValidation), không dùng cho lỗi nghiệp vụ.
- 3 kiểu chuyển `Result<T>` sang HTTP, chọn theo tình huống: `ToHttpResult()` (200/400 — dùng cho list/search), `ToCreatedResult(prefix)` (201 Created — dùng cho Create), `ToFoundResult()` (200/404/400 — dùng cho GetById, Value null → 404).

## 4. Database

- SQL Server cài trực tiếp trên máy (không dùng Docker), **Windows Authentication** — không cần user/password trong code.
- Connection string key: `Default`. Đặt ở `Streak.Api/appsettings.Development.json`:
  `Server=localhost;Database=Streak;Trusted_Connection=True;TrustServerCertificate=True;`
- `StreakDbContextFactory` (trong `Streak.Migrations`) dùng connection string tạm riêng, giống nhau về nội dung nhưng độc lập — đây là thiết kế chủ ý của `IDesignTimeDbContextFactory`, không phải trùng lặp thừa.
- `EnableRetryOnFailure`: chưa thêm. `UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)` đã bật mặc định cho mọi query — không dùng lazy loading, `.Include()` rõ ràng khi cần.

### Lệnh migration (Claude chỉ tạo file khi được yêu cầu, KHÔNG tự chạy `database update`)

```bash
cd Streak.Infrastructure
dotnet ef migrations add Init --project ../Streak.Migrations
dotnet ef database update --project ../Streak.Migrations
```

Đọc migration sinh ra trước khi báo hoàn thành; báo ngay nếu thấy `DropTable`/`DropColumn`/đổi kiểu gây mất dữ liệu.

## 5. Lệnh thường dùng

```bash
cd Streak/BE
dotnet build Streak.slnx
dotnet run --project Streak.Api
```

Chạy xong, `GET /streak-entries` sẽ lỗi "Cannot open database Streak" cho đến khi có migration — đây là lỗi đúng dự kiến, không phải lỗi code.

## 6. Frontend (chưa dựng)

Next.js (App Router), React, TypeScript strict, Tailwind. Tông xanh dương theo mockup (nền `#EEF4FF`, nhấn `#2158F5`), font Bricolage Grotesque (tiêu đề) + DM Sans (nội dung). Chưa có thư mục `FE/` — sẽ bàn kỹ khi bắt đầu.

## 7. Việc còn thiếu / TODO đã biết

- `.RequireAuthorization()` **chưa gọi** ở `StreakEntryEndpoints` (chỉ có comment TODO) — vì chưa có auth scheme nào cấu hình, gọi thật sẽ chặn hết request. Thêm khi có hệ thống auth.
- `StreakEntryModel` (Domain) hiện là DTO thật đang được dùng để trả ra API (không lộ Entity) — đã nối đúng, không phải khung chờ.
- Entity nghiệp vụ thật (`Reminder`, `User`, `ReminderChannel`, streak/thống kê thật) chưa viết — `StreakEntry` chỉ là bài tập dựng khung.
- Chưa có test project, chưa `git init`, chưa `.gitignore` áp dụng cho `Streak/BE` (có `.gitignore` ở gốc repo, kiểm tra lại có khớp cấu trúc hiện tại không trước khi commit).

## 8. Cách làm việc với Claude

- Thay đổi kiến trúc lớn: nói rõ kế hoạch, chờ xác nhận trước khi sửa nhiều file.
- Sau khi sửa code, luôn `dotnet build` để xác nhận; nếu có thể, chạy thử thật (không chỉ build) để bắt lỗi runtime — đã nhiều lần bắt được lỗi thật kiểu này (tham số thiếu default, exception không ai bắt, extension method gọi sai chỗ).
- Không tự chạy `dotnet ef database update` hoặc tạo migration khi chưa được yêu cầu rõ.
- Không thêm NuGet package mới khi chưa hỏi, trừ khi để sửa lỗi build (ví dụ ghim bản vá lỗ hổng bảo mật transitive).
- Không commit secret/connection string có mật khẩu thật. Hiện dùng Windows Auth nên không có mật khẩu nào trong code.
