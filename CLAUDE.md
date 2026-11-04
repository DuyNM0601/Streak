# CLAUDE.md — Streak

Người dùng nói chuyện bằng tiếng Việt. Trả lời, comment giải thích và copy giao diện bằng tiếng Việt. Tên class, biến, endpoint và event dùng tiếng Anh.

## 1. Tổng quan

- Dự án: Streak, web giúp người dùng giữ kỷ luật cá nhân (dậy sớm, học bài, làm việc, bỏ game...) bằng nhắc nhở đúng giờ qua thông báo web, email và gọi điện. Nếu chưa xác nhận thì hệ thống leo thang sang kênh mạnh hơn.
- Tác giả: Nguyễn Mạnh Duy. Dự án cá nhân, **mục đích chính là học Clean Architecture + CQRS để đi phỏng vấn**, không chỉ để chạy sản phẩm.
- Entity thật của Streak (`Reminder`, `ReminderChannel`...) **chưa được dựng**. Hiện chỉ có `User` + auth JWT (xem mục 3). Entity `StreakEntry` (bài tập dựng khung ban đầu) đã xoá. Khi bắt đầu nghiệp vụ thật, copy đúng cấu trúc `Features/Auth/` làm mẫu.
- Mockup giao diện và sơ đồ kiến trúc nằm ở artifact Claude "Kairo Mockup" / "Kairo Kiến trúc" (tên cũ của dự án, hiểu là Streak) — chỉ để tham khảo ý tưởng sản phẩm, không phải kiến trúc code (kiến trúc đã đổi nhiều lần sau đó, mục này mới là bản đúng).

## 2. Công nghệ

- .NET 10, C#, ASP.NET Core **Minimal API** (không dùng Controller)
- EF Core 10 + SQL Server
- **MediatR 12.0.1** cho CQRS — ghim đúng bản này, vì từ bản 13.0 (7/2025) MediatR chuyển sang licence kép (RPL 1.5 / thương mại qua công ty Lucky Penny Software của Jimmy Bogard). 12.0.1 là bản Apache 2.0 thuần, không có vấn đề licence, dù không còn fix mới.
- FluentValidation 12.2.0
- Auth: `Microsoft.AspNetCore.Authentication.JwtBearer` (Api, kiểm token), `Microsoft.IdentityModel.JsonWebTokens` (Infrastructure, ký token), `Microsoft.Extensions.Identity.Core` (Infrastructure, chỉ lấy `PasswordHasher` để băm mật khẩu, KHÔNG dùng ASP.NET Identity đầy đủ)
- `Microsoft.AspNetCore.OpenApi` (sinh tài liệu OpenAPI JSON mặc định của .NET) + `Scalar.AspNetCore` (giao diện thử API tại `/scalar`, chỉ bật ở Development). Không dùng Swashbuckle — Microsoft đã bỏ nó khỏi template từ .NET 9.

## 3. Kiến trúc: Clean Architecture + Vertical Slice + CQRS/MediatR

5 project .NET, mô phỏng theo kiến trúc một codebase thật (nội bộ, không phải tài liệu công khai) tên "OrderHub". **Không dùng Repository pattern** — Application gọi qua `IApplicationDbContext`.

```
Streak/BE/
  Streak.slnx
  Directory.Build.props      # TargetFramework net10.0, Nullable, ImplicitUsings
  Directory.Packages.props   # khoá version NuGet tập trung (Central Package Management)
  Streak.Domain/
    Entities/User.cs                 # entity thật, không biết EF Core, không biết ai cả
    Models/UserModel.cs              # DTO trả ra ngoài, không lộ Entity (không có PasswordHash)
  Streak.Application/
    Abstractions/IApplicationDbContext.cs   # Application chỉ biết interface này, không biết EF Core thật
    Abstractions/IPasswordService.cs, ITokenService.cs   # băm mật khẩu / phát JWT, Infrastructure cài đặt
    Shared/Result.cs           # Result<T>, Error — thuần, KHÔNG được tham chiếu IResult (ASP.NET Core)
    Shared/Cqrs.cs              # ICommand/IQuery, CommandHandler<,>/QueryHandler<,> (HandleAsync public abstract)
    Shared/ValidationBehavior.cs   # pipeline MediatR, throw ValidationException cho lỗi input
    Features/Auth/
      Commands/RegisterCommand, LoginCommand (+Validator+Handler)
      Queries/GetCurrentUserQuery(+Handler)
    DependencyInjection.cs      # AddApplication(): AddMediatR + AddValidatorsFromAssemblyContaining
  Streak.Infrastructure/
    StreakDbContext.cs : IApplicationDbContext   # cài đặt interface của Application
    Entities/UserConfiguration.cs    # Fluent API, map entity sang bảng SQL (Users.Email unique)
    Auth/JwtOptions, JwtTokenService, PasswordService   # cài đặt ITokenService / IPasswordService
    DependencyInjection.cs      # AddInfrastructure(config): AddDbContext + đăng ký IApplicationDbContext
  Streak.Migrations/
    StreakDbContextFactory.cs   # IDesignTimeDbContextFactory, chỉ dùng lúc tạo/chạy migration
  Streak.Api/
    Shared/ResultHttpExtensions.cs   # ToHttpResult — CHỈ ở đây, vì IResult là kiểu ASP.NET Core; map Error.Code sang 401/404/409/400
    ValidationExceptionHandler.cs    # bắt ValidationException, đổi thành 400 ValidationProblem
    Features/Auth/AuthEndpoints.cs   # MapAuthApi(): POST /auth/register, POST /auth/login, GET /auth/me (cần token)
    Program.cs
fe/   # Vite + React (React thuần, không phải Next.js), xem mục 6
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

Mỗi tính năng một thư mục dưới `Features/{Entity}/`, tách `Commands/` và `Queries/`. Khi thêm tính năng mới, copy đúng khuôn `Features/Auth/`:
- `{Action}{Entity}Command` hoặc `Query`, implement `ICommand<TResult>`/`IQuery<TResult>`.
- `{CommandOrQuery}Handler` kế thừa `CommandHandler<,>`/`QueryHandler<,>`, override `HandleAsync` (public abstract), nhận `IApplicationDbContext` qua constructor.
- Command có validator thì thêm `{Command}Validator : AbstractValidator<T>`.
- `Streak.Api/Features/{Entity}/{Entity}Endpoints.cs` — method `Map{Entity}Api()`, chỉ gọi `ISender`, không chứa logic.

### Result pattern

- Handler không `throw` cho lỗi nghiệp vụ (ví dụ email đã đăng ký) — trả `Fail(new Error(...))`.
- `ValidationException` (từ `ValidationBehavior`) là **ngoại lệ duy nhất được throw**, chỉ dùng cho lỗi hình dạng input (FluentValidation), không dùng cho lỗi nghiệp vụ.
- Chuyển `Result<T>` sang HTTP bằng `ToHttpResult()` (200 khi thành công; lỗi map theo `Error.Code`: `Unauthorized` 401, `NotFound` 404, `Conflict` 409, còn lại 400).

### Auth (JWT access token)

- `POST /auth/register` và `POST /auth/login` (body: email + mật khẩu, register thêm displayName) trả `{ accessToken, expiresAt, user }`. `GET /auth/me` cần header `Authorization: Bearer <token>`.
- Mật khẩu chỉ lưu hash (`PasswordHasher` của .NET, PBKDF2). Email lưu chữ thường, unique. Login sai email hay sai mật khẩu đều trả cùng 1 thông báo (không lộ email nào đã đăng ký).
- Mã lỗi nghiệp vụ → HTTP trong `ResultHttpExtensions`: `Unauthorized`→401, `NotFound`→404, `Conflict`→409, còn lại 400. Handler vẫn chỉ trả `Fail(new Error(code, message))`, không biết HTTP.
- Khoá ký JWT (`Jwt:Key`, ≥ 32 ký tự) **không đặt trong appsettings**, dev dùng user-secrets (`UserSecretsId` = `streak-api`): `dotnet user-secrets set "Jwt:Key" "<chuỗi ngẫu nhiên>" --project Streak.Api`. Thiếu hoặc ngắn thì app báo lỗi rõ khi khởi động (`ValidateOnStart`). Issuer/Audience/ExpiresMinutes (mặc định `streak-api`/`streak-fe`/60) có thể ghi đè ở section `Jwt`.
- `MapInboundClaims = false` ở `Program.cs`: claim giữ tên `sub`/`email` (mặc định JwtBearer đổi `sub` thành `ClaimTypes.NameIdentifier`, đọc `"sub"` sẽ ra null → 401 oan).
- Bảng `Users` **cần migration** (xem mục 4) trước khi register/login chạy được.

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

Chạy xong, `POST /auth/register` và `/auth/login` sẽ lỗi 500 ("Cannot open database Streak") cho đến khi có migration cho bảng `Users` — đây là lỗi đúng dự kiến, không phải lỗi code.

## 6. Frontend

**React thuần (Vite + React Router)**, không phải Next.js — đã đổi từ Next.js sang vì không cần SSR/Server Component cho learning goal của FE. TypeScript, Tailwind v4. Thư mục `Streak/fe/` (chữ thường — npm không cho tên package chứa chữ hoa, nên khác `BE`).

- Dựng bằng `npm create vite@latest fe -- --template react-ts`, cài thêm `@tailwindcss/vite` + `tailwindcss` + `react-router-dom`.
- Toàn bộ là **Client-Side Rendering** — không có server render, không có khái niệm Server/Client Component như Next.js. Mọi component đều chạy trong trình duyệt, mọi API call (sau này là form đăng nhập...) đều là browser gọi thẳng `Streak.Api` → **bắt buộc phải có CORS** ở BE (xem bên dưới), khác với lúc dùng Next.js Server Component (lúc đó server-to-server, không cần CORS).
- Routing bằng `react-router-dom`: route khai báo ở `src/app/router.tsx` (`<Routes>`/`<Route>`), layout chung (`src/components/layout/layout.tsx`, có `<Outlet/>`) bọc `SiteHeader` (`src/components/layout/site-header.tsx`) quanh mọi trang. Không phải file-based routing kiểu Next.js — trang (route) nằm ở `src/app/routes/*.tsx`.
- **Cấu trúc thư mục FE** theo kiểu [bulletproof-react](https://github.com/alan2207/bulletproof-react) (feature-based), áp từ khi có nhiều component dùng tay cần tổ chức lại:
  - `src/app/` — `app.tsx` (gộp `AppProvider` + `AppRouter`), `provider.tsx` (context toàn cục: theme, auth modal), `router.tsx` (route), `routes/*.tsx` (1 file/trang, nhận từ `src/pages/` cũ).
  - `src/features/{feature}/` — mỗi nghiệp vụ 1 thư mục con `components/`, `api/`, `types.ts`, và 1 `index.ts` làm public API (chỗ khác import qua `@/features/{feature}`, không import sâu vào trong). Hiện có `auth/` (modal + form đăng nhập, chưa gọi API).
  - `src/components/` — dùng chung, không gắn nghiệp vụ nào: `ui/` (shadcn, xem dưới), `layout/` (header + khung trang), `theme-provider.tsx`, `theme-toggle.tsx`, `reveal.tsx`.
  - `src/lib/` — `api-client.ts` (hàm `request<T>()` + `ApiError` gọi fetch chung, không biết feature nào), `utils.ts` (`cn()` — **đừng tự sửa/di chuyển**, `components.json` của shadcn CLI trỏ cứng vào đường dẫn này).
  - `src/config/env.ts` — đọc biến môi trường (`VITE_API_URL`...), không đọc `import.meta.env` trực tiếp ở nơi khác.
  - `src/hooks/` — hook dùng chung (hiện có `use-mobile.ts`, đi theo component `sidebar` của shadcn).
  - Chưa tạo (để trống có chủ đích, chưa có nội dung thật): `src/stores/` (chưa chọn state library), `src/testing/` (chưa có test project, xem mục 7).
- **shadcn/ui** (base Radix, style `new-york`) đã cài đủ bộ vào `src/components/ui/` — ưu tiên dùng component có sẵn ở đây (`Button`, `Dialog`, `Accordion`, `Badge`...) thay vì viết `<button>`/`<dialog>` tay. Thêm component mới: `npx shadcn@3.8.5 add <tên>` (ghim bản 3.8.5 — bản `4.x` mới nhất đang lỗi `--all`/preset custom trên máy này). **Không dùng `next-themes`** dù shadcn hay tự thêm làm dependency của `sonner` — đã gỡ, mọi chỗ cần theme phải dùng `useTheme` ở `src/components/theme-provider.tsx`.
- Màu chốt theo mockup "Dark Alarm" (artifact Design canvas) — amber `#D97706` làm primary, nền tối gần đen mặc định. Token `--secondary` (indigo) đã bỏ vì không dùng ở đâu (xác nhận qua critique `/impeccable`, xem `.impeccable/critique/`). 3 bước leo thang ở Home dùng màu tăng dần: web = amber, email = `--warning` (cam), gọi điện = `--danger` (đỏ) — đúng ý nghĩa "càng lờ đi càng nghiêm trọng".
- Font: **Be Vietnam Pro** (dùng chung cho cả tiêu đề `font-display` và nội dung `font-sans`, phân biệt bằng weight), nhúng qua Google Fonts `<link>` trong `index.html` (không dùng `next/font`). Đã đổi từ cặp Outfit+Rubik ban đầu vì 2 font đó thiếu glyph dấu tiếng Việt đầy đủ, khiến chữ có dấu bị trình duyệt fallback sang font khác để vẽ dấu → chữ lệch cỡ trong cùng 1 từ. Be Vietnam Pro là font thiết kế riêng cho tiếng Việt, không bị lỗi này.
- Token màu đặt dạng CSS variable trong `src/index.css` (`--background`, `--card`, `--primary`, `--muted-foreground`...), map qua `@theme inline` sang class Tailwind (`bg-background`, `text-primary`...). Đừng viết thẳng mã hex trong component.
- **Sáng/Tối**: tự viết (`src/components/theme-provider.tsx`, context + `localStorage` key `streak-theme`), không dùng `next-themes` (gói đó gắn với Next.js). Set class `.dark` lên `<html>` qua 1 script inline nhỏ trong `index.html` (chạy trước khi React mount, tránh nhấp nháy sai theme). Mặc định `dark`, chỉ 2 trạng thái (không có "system"). Component `src/components/theme-toggle.tsx`.
- **Không có trang Login** — đăng nhập là popup, giờ dùng `Dialog` của shadcn (`src/features/auth/components/auth-modal.tsx`, Radix lo sẵn focus trap/Esc/backdrop/animation, không viết tay nữa). Mọi nút "Đăng nhập"/CTA gọi `useAuthModal().open()` (import qua `@/features/auth`); route lạ (kể cả `/login` cũ) redirect về `/`. Form nằm ở `src/features/auth/components/login-form.tsx` — **UI thật nhưng chưa gọi API**, vì `Streak.Api` chưa có xác thực; submit chỉ hiện thông báo, không giả vờ đăng nhập thành công.
- **Motion** (đường cong `--ease-out`/`--ease-in-out` ở `index.css`, dùng `ease-(--ease-out)` trong Tailwind, đừng dùng `ease-out` built-in): `.hero-in` (vào trang, stagger bằng `transitionDelay`), `.page-in` (fade khi đổi route, `Layout` gắn key theo pathname + reset scroll), `Reveal` (`wipe` cho card, `rise` cho khối chữ/CTA, chạy 1 lần khi scroll tới), `.press` (nhấn nút), `.notice-enter` (thông báo xuất hiện), animation vào/ra của `Dialog`/`Accordion` (shadcn, từ package `tw-animate-css`, không viết CSS tay nữa), underline trượt ở nav, đổi sáng/tối bằng View Transitions API. Tất cả có nhánh `prefers-reduced-motion`.
- Base URL của `Streak.Api` lấy từ `VITE_API_URL` qua `src/config/env.ts` (`.env.local`, mặc định `http://localhost:5090`), dùng bởi `request<T>()` ở `src/lib/api-client.ts`. Hiện FE chưa gọi API nào (đã xoá `features/streak-entries` và badge trạng thái backend ở Home); khi nối auth thì thêm `features/auth/api/`.
- BE phải mở CORS cho `http://localhost:3000` (`Program.cs`, policy `"Fe"`) thì FE mới gọi được từ trình duyệt. Vite được cấu hình chạy cổng 3000 (`vite.config.ts`, `server.port`) để khớp đúng policy này — đụng tới port FE thì sửa cả 2 chỗ.
- Alias import `@/*` → `src/*`, khai báo ở cả `vite.config.ts` (`resolve.alias`) và `tsconfig.app.json` (`paths`).
- Lệnh: `cd Streak/fe && npm run dev` (cổng 3000), `npm run build`.

## 7. Việc còn thiếu / TODO đã biết

- Entity nghiệp vụ thật (`Reminder`, `ReminderChannel`, streak/thống kê thật) chưa viết, mới có `User`.
- Chưa có test project (cả BE và FE).
- Repo đã `git init` và nối remote `https://github.com/DuyNM0601/Streak.git` (branch `main`). `Streak/fe/` chưa commit lần nào.
- FE popup đăng nhập chỉ là giao diện, chưa gọi API thật. BE đã có `/auth/register`, `/auth/login`, `/auth/me`; còn thiếu: migration bảng `Users`, nối form FE, lưu token phía FE.
- Chưa có migration cho bảng `Users` (chỉ tạo khi được yêu cầu, xem mục 4).

## 8. Cách làm việc với Claude

- Thay đổi kiến trúc lớn: nói rõ kế hoạch, chờ xác nhận trước khi sửa nhiều file.
- Sau khi sửa code, luôn `dotnet build` để xác nhận; nếu có thể, chạy thử thật (không chỉ build) để bắt lỗi runtime — đã nhiều lần bắt được lỗi thật kiểu này (tham số thiếu default, exception không ai bắt, extension method gọi sai chỗ).
- Không tự chạy `dotnet ef database update` hoặc tạo migration khi chưa được yêu cầu rõ.
- Không thêm NuGet package mới khi chưa hỏi, trừ khi để sửa lỗi build (ví dụ ghim bản vá lỗ hổng bảo mật transitive).
- Không commit secret/connection string có mật khẩu thật. Hiện dùng Windows Auth nên không có mật khẩu nào trong code.
- Không tự `git commit` hoặc `git push` — người dùng tự làm. Chỉ đưa tên nhánh/commit message và lệnh git khi người dùng **hỏi**; nếu không hỏi thì không tự đề xuất.
