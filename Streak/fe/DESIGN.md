---
name: Streak
description: Tờ lịch bloc treo tường; nhắc nhở leo thang là con số giờ chuyển từ mực đen sang đỏ rồi bị khoanh bút đỏ.
colors:
  wall-lime: "#ccdacf"
  wall-smoke: "#16100e"
  paper: "#fbf8ee"
  paper-dark-mode: "#efe8d8"
  ink: "#1a1714"
  wall-ink: "#14201a"
  wall-ink-dark: "#f3ecdd"
  calendar-red: "#c8321f"
  calendar-red-dark: "#d63a24"
  paper-muted: "#5a5046"
  wall-muted: "#34443a"
  wall-muted-dark: "#b9ad9a"
  highlight: "#f3e7b3"
  success: "#2f7a45"
  warning: "#8a4b00"
  danger: "#a8281a"
typography:
  display:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  numeral:
    fontFamily: "Anton, Be Vietnam Pro, sans-serif"
    fontSize: "11rem"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0"
    fontFeature: "tabular-nums"
rounded:
  sheet: "0.35rem"
  dialog: "0.375rem"
  pill: "999px"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "3rem"
components:
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  sheet-band:
    backgroundColor: "{colors.calendar-red}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    height: "2.5rem"
  button-primary:
    backgroundColor: "{colors.calendar-red}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "3rem"
    padding: "0 1.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "3rem"
    padding: "0 1.75rem"
---

# Design System: Streak

## Overview

**Creative North Star: "Tờ lịch bloc"**

Streak là tờ lịch bloc treo tường Việt Nam. Bức tường là nền (vôi xanh nhạt ban ngày, tường ám khói ban đêm); mọi nội dung có ý nghĩa nằm trên các tờ giấy trắng ngà luôn sáng ở cả hai chế độ, mực đen, số đỏ son. Nhắc nhở leo thang được kể bằng chính vật liệu: con số giờ to dần, đổi từ mực đen sang đỏ, bước cuối bị khoanh bút đỏ vẽ tay. Giọng điệu cương quyết, không hù doạ.

Mật độ vừa phải, bố cục lệch có chủ ý (tờ nghiêng nhẹ, độ rộng cột khác nhau) để không thành lưới thẻ đều. Bóng đổ có offset và blur thật vì tờ giấy thực sự nằm cách tường một khoảng. Từ chối: hero tối giản chữ + nút + lưới thẻ icon.

Thế giới này thay hẳn "Dark Alarm" (amber trên nền tối); không còn token amber/indigo nào.

**Key Characteristics:**
- Tường + giấy: hai lớp bề mặt, giấy không bao giờ tối.
- Số khổng lồ bằng Anton là chữ ký; chỉ dùng cho chữ số.
- Dải đỏ + lỗ treo + đường răng cưa mở đầu mọi tờ.
- Một nét bút đỏ duy nhất (3px, tròn đầu) cho khoanh, gạch chân, dấu X.
- Nút bấm hình viên thuốc, mọi thứ khác góc gần vuông như giấy cắt.

## Colors

Hai lớp: tường theo chế độ sáng/tối, giấy cố định. Một điểm nhấn đỏ son duy nhất.

### Primary
- **Đỏ son lịch** (`{colors.calendar-red}`; `{colors.calendar-red-dark}` làm `--primary` ở chế độ tối): dải đầu tờ, nút chính, số giờ leo thang, Chủ nhật, nét bút, `::selection`, focus ring. Phần in trên giấy (số, nét bút, dải đầu tờ, `::selection`) dùng biến hằng `--calendar-red` / class `text-calendar-red`, `fill-calendar-red`, nên luôn là `#c8321f` kể cả khi `--primary` đổi sang `#d63a24` ở chế độ tối; nút chính dùng `--primary` nên theo chế độ.

### Neutral
- **Vôi xanh** (`{colors.wall-lime}`): tường ban ngày, `--background` ở chế độ sáng.
- **Tường ám khói** (`{colors.wall-smoke}`): tường ban đêm, `--background` ở chế độ tối (mặc định của app).
- **Giấy ngà** (`{colors.paper}`; `{colors.paper-dark-mode}` khi `.dark`): thân tờ lịch, có hạt giấy SVG rất nhẹ.
- **Mực** (`{colors.ink}`): chữ và số trên giấy. Là biến `--ink` (hằng số ở cả hai chế độ), class Tailwind `text-ink`, `border-ink/35`, `stroke-ink`.
- **Mực tường** (`{colors.wall-ink}` sáng / `{colors.wall-ink-dark}` tối): chữ nằm trực tiếp trên tường.
- **Chữ phụ trên giấy** (`{colors.paper-muted}`), **chữ phụ trên tường** (`{colors.wall-muted}` / `{colors.wall-muted-dark}`).
- **Nền nhấn** (`{colors.highlight}`): `--accent` chế độ sáng, chưa dùng ở bề mặt chính.
- Trạng thái `{colors.success}`, `{colors.warning}`, `{colors.danger}` chỉ cho thông báo; bản `-bg` đi kèm.

### Named Rules
**The Paper Stays Light Rule.** Giấy luôn sáng ở cả hai chế độ. Lớp `.paper` khai báo lại `--background`, `--foreground`, `--muted-foreground`, `--border`, `--input`, trạng thái và `--ring`, nên mọi component shadcn đặt trên giấy tự đọc đúng màu mà không cần biết chế độ.

**The One Red Rule.** Đỏ son là màu của hành động và của "nghiêm trọng hơn". Không thêm màu nhấn thứ hai.

**The Tokens Not Hex Rule.** Component không viết mã hex: mực và đỏ lịch đi qua `--ink` / `--calendar-red` (map sang `text-ink`, `text-calendar-red`, `fill-card`...). Hex chỉ nằm ở khai báo biến trong `src/index.css`.

**The Escalation Ink Rule.** Mức leo thang thể hiện bằng cỡ số tăng dần (3.75rem, 4.75rem, 6rem) và mực đen sang đỏ; bước cuối thêm vòng khoanh. Không dùng màu khác để phân biệt kênh.

## Typography

**Display/Body Font:** Be Vietnam Pro (sans-serif) cho mọi chữ có dấu; phân cấp bằng độ đậm 400-800.
**Numeral Font:** Anton (fallback Be Vietnam Pro) chỉ cho chữ số.

**Character:** Be Vietnam Pro là font thiết kế cho tiếng Việt nên dấu không bị fallback. Anton gầy cao, đậm, như số in trên lịch thật.

### Hierarchy
- **Display** (800, 2.25rem lên 3rem ở sm, 1.1): tiêu đề hero, `text-balance`.
- **Headline** (800, 1.875rem; Guide 2.25rem / 1.5rem): tiêu đề mục.
- **Title** (700, 1.125rem): tiêu đề trong tờ.
- **Body** (400, 0.875-1.125rem, 1.5-1.75): mô tả; dòng tối đa `max-w-lg`/`max-w-md`.
- **Label** (700, 0.75rem, 0.14em, chữ hoa): chỉ cho dải đầu tờ. Tên thứ trong tuần dùng 800, 0.875rem, 0.18em, chữ hoa.
- **Numeral** (Anton 400, `line-height: 0.9`, tabular): ngày khổng lồ `clamp(8rem, 11vw, 11rem)` ở desktop, giờ 1.9-6rem, số bước hướng dẫn 3.75rem.

### Named Rules
**The Digits Only Rule.** Anton chỉ dành cho chữ số, vì có thể thiếu dấu tiếng Việt. Không đặt chữ có dấu bằng Anton. Giữ weight 400 để không tạo chữ đậm giả.

## Layout

Nền là bức tường: ba vết loang gradient lớn (trắng 7%, đen 8%, trắng 5%) cộng một lớp hạt SVG mịn 200px. Không dùng lớp turbulence lát gạch lớn vì lộ đường nối.

Home là trang slide: mỗi section `min-height: 100dvh`, scroll-snap dọc, tắt khi Lenis chạy. Hero chia 4fr/6fr ở lg (chữ trái, tờ lịch phải, tờ chiếm hơn nửa chiều ngang), `max-w-7xl`. Các section sau `max-w-6xl`, CTA cuối `max-w-2xl`. Hướng dẫn `max-w-4xl`, lưới 5 cột với span 3/2/2/3 và lệch dọc `mt-10`/`mt-8`. Khoảng cách thường dùng 1.5rem (px-6), 3rem (gap-12), 4rem (py-16). Dưới lg mọi thứ xếp một cột; tờ hero thu về `max-w-md`.

## Elevation & Depth

Hybrid: tonal (tường tối hơn giấy) cộng bóng thật. Mọi tờ giấy có cùng một bóng; không có hover nâng thẻ trên tờ.

### Shadow Vocabulary
- **Giấy** (`0 1px 0 rgb(255 255 255 / 0.6) inset, 0 22px 30px -18px rgb(10 6 4 / 0.55), 0 6px 10px -4px rgb(10 6 4 / 0.25)`): cạnh sáng phía trên, bóng đổ dài xuống tường.
- **Lỗ treo** (`inset 0 1px 2px rgb(0 0 0 / 0.5)`): lõm trên dải đỏ.

### Named Rules
**The Real Shadow Rule.** Bóng luôn có offset dọc và blur thật, đổ từ tờ xuống tường. Không dùng viền cứng hay bóng offset ngang kiểu neobrutalist.

## Shapes

Giấy cắt: tờ bo `0.35rem`, popup `0.375rem`, thanh FAQ `0.375rem`. Chỉ nút (và avatar-kiểu nút) là viên thuốc `999px`. Tờ nghiêng ngẫu nhiên `-2deg` đến `1.6deg`, đặt lệch để thành chồng. Đáy dải đỏ là đường răng cưa: chấm radial 1.2px lặp mỗi 9px, cao 0.5rem. Lỗ treo là chấm tròn 0.75rem ở trái dải.

## Components

### Buttons
- **Shape:** viên thuốc (999px), cao 3rem ở nội dung, 2.5rem ở header và trong tờ; chữ 0.875rem/600.
- **Primary:** nền đỏ son, chữ trắng, `px-7`. Nhãn: "Bắt đầu giữ chuỗi ngày", "Đăng nhập", "Đăng nhập / Tạo tài khoản".
- **Outline:** trong suốt, viền `foreground/35`, hover nền `foreground/10`. Trên giấy dùng mực `text-ink` / `border-ink/35` thay cho màu tường (nút "Xé tờ hôm nay").
- **Focus:** viền 2px màu `--ring` (đỏ), offset 2px. Có nhánh `prefers-reduced-motion` bỏ transform.

### Sheet (CalendarSheet)
Thành phần chủ đạo: `.paper` + dải đỏ (`min-height: 2.5rem`, chữ hoa trắng) + đường răng cưa + thân tuỳ ý. Dải mang thông tin thật: "Đúng giờ", "+5 phút", "+10 phút", "Tờ đầu tiên", tên tháng. Dùng cho thẻ leo thang, tờ tháng, CTA, bước hướng dẫn và popup.

### Pen marks
`PenCircle`, `PenCross`, `PenUnderline`: SVG tự vẽ, một độ dày 3px, màu đỏ son, vẽ dần trái sang phải bằng clip-path 700ms. Khoanh = nhấn mạnh nghiêm trọng (05:10, hôm nay), X = ngày đã xác nhận, gạch chân = cụm "chuông vẫn reo."

### Tear-off calendar (hero)
Chồng ba tờ: hai mép lệch phía dưới, một tờ ngày kế tiếp đủ nội dung nằm dưới, tờ trên cùng xoay quanh góc trái. "Xé tờ hôm nay": 700ms, nhấc `-3deg`, rồi `rotate(16deg) translate(22%, 125%)`; tờ dưới lộ ra, ngày tăng một, chuỗi minh hoạ tăng một. Reduced-motion: đổi tờ tức thì.

### Month sheet
Lưới 7 cột, thứ hai bắt đầu tuần, Chủ nhật đỏ, ngày xác nhận có dấu X, hôm nay có khoanh. Có dòng nhãn "Dữ liệu minh hoạ".

### Navigation
Header sticky, nền tường, viền dưới. Logo tờ lịch nhỏ SVG + "Streak" 800. Liên kết 0.875rem/600, gạch chân đỏ trượt ra từ trái khi hover, giữ nguyên ở trang hiện tại. Nav ẩn dưới `sm`. Nút chế độ sáng/tối là nút outline tròn với icon trăng/mặt trời xoay đổi chỗ; chuyển chế độ bằng View Transitions, vòng tròn loang từ vị trí nút.

### Auth popup
Dialog shadcn dạng một tờ: `.paper`, dải "Streak", răng cưa, thân `px-8 pb-8 pt-6`, tiêu đề "Đăng nhập" 1.5rem/800, nút đóng trắng trên dải. Nội dung là nút Google do thư viện `@react-oauth/google` vẽ (iframe, `shape="pill"`, `size="large"`, `width=300`): nền, font và màu do Google quyết định, không theo token của Streak. Thông báo lỗi dùng Alert nền `warning-bg`, viền `warning/30`, vào bằng `@starting-style`.

### FAQ
Accordion shadcn, mỗi mục là một `.paper` bo `0.375rem`, không viền, `px-5`.

### Motion
Đường cong `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-hover` `cubic-bezier(0.4, 0, 0.2, 1)`. Hero vào bằng `.hero-in` 500ms (stagger 80ms). Tờ leo thang rơi vào chỗ (`.sheet-drop`: lên từ -28px, xoay thêm -3deg, 700ms, trễ 120ms mỗi tờ). Section hiện bằng mờ + trượt 20px/400ms. Mọi thứ có nhánh `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** đặt mọi nội dung chính lên `CalendarSheet`; chữ trực tiếp trên tường chỉ là tiêu đề và mô tả.
- **Do** dùng Anton chỉ cho chữ số, Be Vietnam Pro cho mọi chữ có dấu.
- **Do** dùng đỏ son (`--calendar-red` trên giấy, `--primary` cho nút) làm điểm nhấn duy nhất; tăng cỡ số và chuyển đỏ để biểu đạt leo thang.
- **Do** gắn nhãn "minh hoạ" cho mọi con số chuỗi ngày chưa có dữ liệu thật.
- **Do** để tờ nghiêng nhẹ (trong khoảng ±2deg) và lệch độ rộng; giữ bóng giấy một kiểu.
- **Do** cho mọi chuyển động có nhánh `prefers-reduced-motion`.

### Don't:
- **Don't** làm hero tối giản chữ + nút + lưới thẻ icon đều nhau.
- **Don't** làm tối giấy ở chế độ tối; chỉ đổi tường và `#efe8d8` nhẹ.
- **Don't** thêm màu nhấn thứ hai hay quay lại amber/indigo của "Dark Alarm".
- **Don't** viết mã hex trong component; dùng token (`text-ink`, `text-calendar-red`).
- **Don't** dùng bóng cứng không blur hoặc bo tròn lớn cho tờ giấy; chỉ nút mới là viên thuốc.
- **Don't** đặt chữ có dấu bằng Anton.
- **Don't** bịa số liệu người dùng, lời chứng thực hay chuỗi ngày thật.

## Known gaps (build vs. contract)

- Tờ lịch hero **không tràn xuống đáy màn hình** như hợp đồng; nó nằm trọn trong section 100dvh.
- Số chuỗi ngày ở hero và tờ tháng là **dữ liệu minh hoạ**, đã gắn nhãn; chưa có entity nhắc nhở thật.
- Nút Google do thư viện vẽ, không theo token (nền, font, màu); chỉ chỉnh được hình dạng, cỡ, độ rộng.
- Anton chỉ xuất hiện ở chữ số, đúng ý, nhưng nghĩa là "chữ khổng lồ" của hợp đồng chỉ thực hiện bằng số.
- Chữ trắng trên dải đỏ `.sheet-band` và `::selection` vẫn là `#ffffff` viết trong CSS (không phải component); cân nhắc nối với `--primary-foreground` nếu sau này đổi.
- Màu trong suốt của vân tường (trắng 7% và 5%, đen 8%) và bóng giấy là giá trị viết thẳng trong `src/index.css`, không nằm trong bảng màu ở đầu file; detector báo ở mức khuyến nghị.
- Đã sửa (đợt 2026-11-09): mã hex `#c8321f` / `#1a1714` trong component đã được đổi sang token `--calendar-red` / `--ink`; dải đỏ và `::selection` giờ dùng `--calendar-red`.
