# CLAUDE.md — Streak

Người dùng nói chuyện bằng tiếng Việt. Trả lời, comment giải thích và copy giao diện bằng tiếng Việt. Tên class, biến, endpoint và event dùng tiếng Anh.

## 1. Tổng quan

- Dự án: Streak, web giúp người dùng giữ kỷ luật cá nhân (dậy sớm, học bài, làm việc, bỏ game...) bằng nhắc nhở đúng giờ qua thông báo web, email và gọi điện. Nếu chưa xác nhận thì hệ thống leo thang sang kênh mạnh hơn.
- Tác giả: Nguyễn Mạnh Duy. Dự án cá nhân, **mục đích chính là học Clean Architecture + CQRS để đi phỏng vấn**, không chỉ để chạy sản phẩm.
- Entity thật của Streak (`Reminder`, `ReminderChannel`...) **chưa được dựng**. Hiện chỉ có `User`, `RefreshToken` + auth Google/JWT (xem mục 3). Entity `StreakEntry` (bài tập dựng khung ban đầu) đã xoá. Khi bắt đầu nghiệp vụ thật, copy đúng cấu trúc `Features/Auth/` làm mẫu.
- Mockup giao diện và sơ đồ kiến trúc nằm ở artifact Claude "Kairo Mockup" / "Kairo Kiến trúc" (tên cũ của dự án, hiểu là Streak) — chỉ để tham khảo ý tưởng sản phẩm, không phải kiến trúc code (kiến trúc đã đổi nhiều lần sau đó, mục này mới là bản đúng).

## 2. Công nghệ

- .NET 10, C#, ASP.NET Core **Minimal API** (không dùng Controller)
- EF Core 10 + SQL Server
- **MediatR 12.0.1** cho CQRS — ghim đúng bản này, vì từ bản 13.0 (7/2025) MediatR chuyển sang licence kép (RPL 1.5 / thương mại qua công ty Lucky Penny Software của Jimmy Bogard). 12.0.1 là bản Apache 2.0 thuần, không có vấn đề licence, dù không còn fix mới.
- Chưa dùng FluentValidation (input được kiểm trong handler, trả `Fail(field, message)`).
- Auth: `Google.Apis.Auth` (kiểm Google ID token), `Microsoft.IdentityModel.JsonWebTokens` (Infrastructure, ký JWT), `Microsoft.AspNetCore.Authentication.JwtBearer` (API, kiểm access token).
- `Microsoft.AspNetCore.OpenApi` (sinh tài liệu OpenAPI JSON mặc định của .NET) + `Scalar.AspNetCore` (giao diện thử API tại `/scalar`, chỉ bật ở Development). Không dùng Swashbuckle — Microsoft đã bỏ nó khỏi template từ .NET 9.

## 3. Kiến trúc: Clean Architecture + Vertical Slice + CQRS/MediatR

4 project .NET (thư mục BE: `Streak/BE/Streak/`), mô phỏng theo kiến trúc một codebase thật tên "OrderHub". **Không dùng Repository pattern** — Application gọi qua `IAppDbContext`. Tên thư mục Infrastructure đang viết là `Streak.Infrasture` (thiếu chữ t), project vẫn là `Streak.Infrastructure`.

```
Streak/BE/Streak/
  Streak.slnx
  Streak.Domain/
    Entities/BaseEntity, IAuditable, ISoftDelete, User, RefreshToken   # không biết EF Core, không biết ai cả
  Streak.Application/
    Common/IAppDbContext, ITokenService, IGoogleTokenVerifier   # interface Application cần, Infrastructure cài đặt
    Shared/Result.cs           # Result<T>, Error(ErrorType, Code, Message) — thuần, KHÔNG tham chiếu IResult (ASP.NET Core)
    Shared/Cqrs.cs             # ICommand<T>, CommandHandler<,> (HandleAsync public abstract, Ok/Fail)
    Features/Auth/
      Commands/GoogleLogin, RefreshToken, Logout (Command + Handler)
      Models/AuthModel.cs      # model trả về client, không lộ Entity
      AuthIssuer.cs            # dùng chung: phát access token + refresh token mới
    DependencyInjections.cs    # AddApplication(): AddMediatR
  Streak.Infrasture/           # project Streak.Infrastructure
    Data/AppDbContext.cs : IAppDbContext
    Migrations/                # migration nằm ngay đây
    Auth/JwtOptions, JwtTokenService, GoogleOptions, GoogleTokenVerifier
    DependencyInjections.cs    # AddInfrastructure(config)
  Streak.API/
    Shared/ResultHttpExtensions.cs   # ToHttpResult — CHỈ ở đây, vì IResult là kiểu ASP.NET Core
    Features/Auth/AuthEndpoints.cs   # MapAuthApi(): /auth/google, /refresh, /logout, /me
    Program.cs
Streak/fe/   # Vite + React (React thuần, không phải Next.js), xem mục 6
```

### Quy tắc phụ thuộc (bắt buộc kiểm tra mỗi khi thêm project reference)

```
Domain  ←  Application  ←  Infrastructure
                ↑                 ↑
                └──── API ────────┘
```

- `Domain`: không tham chiếu project nào, không biết EF Core, không biết ASP.NET Core.
- `Application`: chỉ tham chiếu `Domain`. Được dùng `Microsoft.EntityFrameworkCore` (chỉ để có kiểu `DbSet<T>` trong `IAppDbContext`), `MediatR` và `Microsoft.Extensions.Logging.Abstractions`. **Không được dùng `Microsoft.AspNetCore.*` ở đây** — kể cả `IResult`. Đây là lỗi thật từng mắc (để `ToHttpResult()` lẫn vào Application) và phải sửa lại.
- `Infrastructure`: tham chiếu `Application` (+ `Domain` qua Application), cài đặt `IAppDbContext`, `ITokenService`, `IGoogleTokenVerifier`.
- `API`: tham chiếu `Application`, `Infrastructure`. Là nơi **duy nhất** được biết `IResult`, `HttpContext`, cookie, đăng ký DI.

### Vertical Slice bên trong Application

Mỗi tính năng một thư mục dưới `Features/{Entity}/`, tách `Commands/` và `Queries/`. Khi thêm tính năng mới, copy đúng khuôn `Features/Auth/`:
- `{Action}{Entity}Command` (record) implement `ICommand<TResult>`.
- `{Command}Handler` kế thừa `CommandHandler<,>`, override `HandleAsync`, nhận `IAppDbContext` qua constructor.
- `Streak.API/Features/{Entity}/{Entity}Endpoints.cs` — method `Map{Entity}Api()`, chỉ gọi `ISender`, không chứa logic nghiệp vụ.

### Result pattern

- Handler không `throw` cho lỗi nghiệp vụ — trả `Fail(Error.Unauthorized(...))` / `Fail(field, message)` (lỗi input).
- Chuyển `Result<T>` sang HTTP bằng `ToHttpResult()` duy nhất: 200 khi thành công; `Validation` → 400 `ValidationProblem` (errors theo field), `Unauthorized` 401, `NotFound` 404, `Conflict` 409 (ProblemDetails có `code`). Lỗi chưa bắt đi qua `UseExceptionHandler()` + `UseStatusCodePages()`. Thông báo lỗi API dùng tiếng Anh.

### Auth: đăng nhập Google + access token + refresh token

- Chỉ có đăng nhập Google (không có mật khẩu). FE lấy Google ID token, `POST /auth/google` → BE kiểm bằng `Google.Apis.Auth` (`Google:ClientId`), tìm/tạo `User` theo `ExternalId` (= `sub` của Google), trả `AuthModel` `{ accessToken, expiresAt, userId, email, displayName, avatarUrl }`.
- **Access token** = JWT HS256 (claim `sub`/`email`/`name`), sống 15 phút, không lưu database. **Refresh token** = 32 byte ngẫu nhiên, sống 7 ngày, chỉ lưu **SHA-256** trong bảng `RefreshTokens`, gửi cho client qua cookie `refresh_token` (HttpOnly, Secure, SameSite=None, Path=/auth), không nằm trong JSON (`[JsonIgnore]` trên `AuthModel`).
- `POST /auth/refresh`: đọc cookie, **xoay** token (cũ bị thu hồi, ghi `ReplacedById`). Dùng lại token đã thu hồi = nghi bị đánh cắp → thu hồi cả "họ" token (`FamilyId`, mỗi lần đăng nhập = 1 họ) của thiết bị đó, thiết bị khác không bị ảnh hưởng. `POST /auth/logout`: thu hồi token + xoá cookie (luôn 204).
- `GET /auth/me` là endpoint đầu tiên cần `Authorization: Bearer` (`RequireAuthorization`). `JwtBearer` cấu hình trong `Program.cs` với `MapInboundClaims = false` (giữ claim `sub` đúng tên, nếu không sẽ thành `ClaimTypes.NameIdentifier`).
- CORS policy `"Fe"` cho `http://localhost:3000` có `AllowCredentials()` (bắt buộc để cookie đi cùng). `UseHttpsRedirection` chỉ bật ngoài Development (redirect làm hỏng preflight CORS).
- Khoá ký JWT (`Jwt:Key`, ≥ 32 ký tự) và `Google:ClientId` **không đặt trong appsettings**, dùng user-secrets: `dotnet user-secrets set "Jwt:Key" "<chuỗi ngẫu nhiên>" --project Streak.API`. Thiếu Key thì mọi token bị từ chối (401), đăng nhập báo lỗi rõ. `Jwt:Issuer/Audience/ExpiresMinutes/RefreshExpiresDays` (mặc định `streak-api`/`streak-fe`/15/7) có thể ghi đè.
- `SameSite=None` là lối tắt cho dev (FE http://localhost:3000, API https://localhost:7022 khác scheme); khi FE và API cùng site ở production thì đổi sang Lax/Strict.

## 4. Database

- SQL Server cài trực tiếp trên máy (không dùng Docker). Connection string key: `DefaultConnection`, đặt ở `Streak.API/appsettings.Development.json` (xem cảnh báo mật khẩu ở mục 7).
- Entity khai báo độ dài bằng `[MaxLength]` (Id là Guid dạng chuỗi 36 ký tự); index/khoá ngoại cấu hình trong `AppDbContext.OnModelCreating`.
- Mọi entity kế thừa `BaseEntity` (chỉ giữ Id); mốc tạo/sửa/xoá nằm ở `IAuditable`/`ISoftDelete`, entity nào cần mới implement.
- `EnableRetryOnFailure`: chưa thêm. Không dùng lazy loading, `.Include()` rõ ràng khi cần.

### Lệnh migration (Claude chỉ tạo file khi được yêu cầu, KHÔNG tự chạy `database update`)

Migration nằm ngay trong `Streak.Infrasture/Migrations/`. Development tự áp migration khi chạy API, nên thường chỉ cần tạo file:

```bash
cd Streak/BE/Streak
dotnet ef migrations add <Tên> --project Streak.Infrasture --startup-project Streak.API
```

Đọc migration sinh ra trước khi báo hoàn thành; báo ngay nếu thấy `DropTable`/`DropColumn`/đổi kiểu gây mất dữ liệu.

## 5. Lệnh thường dùng

```bash
cd Streak/BE/Streak
dotnet build Streak.slnx
dotnet run --project Streak.API --launch-profile https   # https://localhost:7022, tự mở /scalar
```

Cổng FE gọi là `https://localhost:7022` (profile https). Development tự `Migrate()` khi khởi động; nếu thiếu migration cho bảng mới thì đăng nhập lỗi 500 — đúng dự kiến, không phải lỗi code.

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
- **Thế giới thiết kế "Tờ lịch bloc"** (thay "Dark Alarm" cũ; hướng được chọn qua `/impeccable`, hợp đồng nằm ở `Streak/fe/.impeccable/surfaces/` và `Streak/fe/PRODUCT.md`): nền là bức tường (vôi xanh `#ccdacf` ở sáng, ám khói `#16100e` ở tối), nội dung nằm trên các **tờ giấy** (`.paper`, component `CalendarSheet` ở `src/components/calendar-sheet.tsx`: dải đỏ có lỗ treo + đường răng cưa) luôn sáng ở cả hai chế độ, mực đen, số đỏ son `#c8321f`. `.paper` khai báo lại biến màu (`--foreground`, `--muted-foreground`, `--border`...) cho mọi thứ nằm trên giấy nên chữ phụ luôn đủ tương phản. Nét bút đỏ vẽ tay là `PenCircle/PenCross/PenUnderline` (`src/components/pen-marks.tsx`, hiện dần bằng clip-path). 3 bước leo thang ở Home: số giờ to dần và đổi từ mực đen sang đỏ, bước gọi điện bị khoanh bút đỏ. Số liệu chuỗi ngày trên Home là **dữ liệu minh hoạ** (`src/features/home/lib/calendar.ts`), luôn gắn nhãn "minh hoạ", không bịa số thật.
- Font: **Be Vietnam Pro** cho chữ (cả `font-display` và `font-sans`, phân biệt bằng weight 400-800) + **Anton** (class `.numeral`, token `--font-numeral`) chỉ cho **con số** trên tờ lịch (Anton có thể thiếu dấu tiếng Việt, không dùng cho chữ có dấu). Nhúng qua Google Fonts `<link>` trong `index.html` (không dùng `next/font`). Be Vietnam Pro là font thiết kế riêng cho tiếng Việt, tránh lỗi fallback glyph dấu từng gặp ở Outfit/Rubik.
- Token màu đặt dạng CSS variable trong `src/index.css` (`--background`, `--card`, `--primary`, `--muted-foreground`...), map qua `@theme inline` sang class Tailwind (`bg-background`, `text-primary`...). Đừng viết thẳng mã hex trong component.
- **Sáng/Tối**: tự viết (`src/components/theme-provider.tsx`, context + `localStorage` key `streak-theme`), không dùng `next-themes` (gói đó gắn với Next.js). Set class `.dark` lên `<html>` qua 1 script inline nhỏ trong `index.html` (chạy trước khi React mount, tránh nhấp nháy sai theme). Mặc định `dark`, chỉ 2 trạng thái (không có "system"). Component `src/components/theme-toggle.tsx`.
- **Không có trang Login** — đăng nhập là popup `Dialog` của shadcn dạng một tờ lịch (`src/features/auth/components/auth-modal.tsx`). Mọi nút "Đăng nhập"/CTA gọi `useAuthModal().open()` (import qua `@/features/auth`); route lạ redirect về `/`. **Đã nối thật**: nút Google của `@react-oauth/google` (`login-form.tsx`) lấy ID token, `features/auth/api/google-login.ts` gọi `POST /auth/google`, `AuthProvider` (`auth-provider.tsx`) lưu access token vào `localStorage` (key `streak-session`) và header hiện tên + nút Đăng xuất (hỏi xác nhận, gọi `/auth/logout` + `googleLogout()`). Refresh token nằm trong cookie HttpOnly nên `request()` luôn gửi `credentials: "include"`. `features/auth/lib/session-store.ts` (`renewSession`, khoá bằng Web Locks để nhiều tab không cùng đổi token) làm mới phiên trước khi hết hạn và khi mở lại trang; tab khác đăng xuất/đăng nhập thì đồng bộ qua sự kiện `storage`. Gọi endpoint cần đăng nhập thì dùng `authedRequest` (`features/auth/api/authed-request.ts`: gắn Bearer, 401 thì làm mới và thử lại 1 lần) — chưa có chỗ nào dùng, `/auth/me` là endpoint thử. Cần `VITE_GOOGLE_CLIENT_ID` trong `.env.local` (cùng Client ID với `Google:ClientId` của BE).
- **Motion** (đường cong `--ease-out`/`--ease-in-out` ở `index.css`, dùng `ease-(--ease-out)` trong Tailwind, đừng dùng `ease-out` built-in): `.hero-in` (vào trang, stagger bằng `transitionDelay`), `.page-in` (fade khi đổi route, `Layout` gắn key theo pathname + reset scroll), `Reveal` (`wipe` cho card, `rise` cho khối chữ/CTA, chạy 1 lần khi scroll tới), `.press` (nhấn nút), `.notice-enter` (thông báo xuất hiện), animation vào/ra của `Dialog`/`Accordion` (shadcn, từ package `tw-animate-css`, không viết CSS tay nữa), underline trượt ở nav, đổi sáng/tối bằng View Transitions API. Tất cả có nhánh `prefers-reduced-motion`.
- Base URL của `Streak.Api` lấy từ `VITE_API_URL` qua `src/config/env.ts` (`.env.local`, mặc định `https://localhost:7022`, khớp profile **https** trong `launchSettings.json` của `Streak.API` (cần tin cậy dev cert: `dotnet dev-certs https --trust`); redirect HTTPS chỉ bật ngoài Development), dùng bởi `request<T>()` ở `src/lib/api-client.ts`. `googleClientId` cũng đọc ở `env.ts`.
- BE phải mở CORS cho `http://localhost:3000` (`Program.cs`, policy `"Fe"`) thì FE mới gọi được từ trình duyệt. Vite được cấu hình chạy cổng 3000 (`vite.config.ts`, `server.port`) để khớp đúng policy này — đụng tới port FE thì sửa cả 2 chỗ.
- Alias import `@/*` → `src/*`, khai báo ở cả `vite.config.ts` (`resolve.alias`) và `tsconfig.app.json` (`paths`).
- Lệnh: `cd Streak/fe && npm run dev` (cổng 3000), `npm run build`.

## 7. Việc còn thiếu / TODO đã biết

- Entity nghiệp vụ thật (`Reminder`, `ReminderChannel`, streak/thống kê thật) chưa viết, mới có `User` + `RefreshToken`.
- Chưa có test project (cả BE và FE). Logic refresh token đã được thử bằng chương trình tạm trên database tạm, không còn lưu lại.
- Repo đã `git init` và nối remote `https://github.com/DuyNM0601/Streak.git` (branch `main`).
- Migration `AddRefreshTokens` đã tạo; chạy API ở Development sẽ tự áp (hoặc `dotnet ef database update`).
- Chưa có unique index cho `Users.ExternalId`; chưa tự điền `CreatedBy/UpdatedAt...` khi lưu; chưa có query filter soft-delete.
- `appsettings.Development.json` đang chứa connection string `sa` + mật khẩu (theo yêu cầu người dùng, chỉ cho máy dev) — không commit lên repo công khai; nên chuyển sang user-secrets.

## 8. Cách làm việc với Claude

- Thay đổi kiến trúc lớn: nói rõ kế hoạch, chờ xác nhận trước khi sửa nhiều file.
- Sau khi sửa code, luôn `dotnet build` để xác nhận; nếu có thể, chạy thử thật (không chỉ build) để bắt lỗi runtime — đã nhiều lần bắt được lỗi thật kiểu này (tham số thiếu default, exception không ai bắt, extension method gọi sai chỗ).
- Không tự chạy `dotnet ef database update` hoặc tạo migration khi chưa được yêu cầu rõ.
- Không thêm NuGet package mới khi chưa hỏi, trừ khi để sửa lỗi build (ví dụ ghim bản vá lỗ hổng bảo mật transitive).
- Không commit secret/connection string có mật khẩu thật. Hiện dùng Windows Auth nên không có mật khẩu nào trong code.
- Không tự `git commit` hoặc `git push` — người dùng tự làm. Chỉ đưa tên nhánh/commit message và lệnh git khi người dùng **hỏi**; nếu không hỏi thì không tự đề xuất.
