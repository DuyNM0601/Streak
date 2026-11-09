# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Người trẻ (sinh viên, người mới đi làm) đang cố tự giữ kỷ luật cho một thói quen cụ thể: dậy sớm, học bài, làm việc, bỏ game. Họ biết mình cần làm gì nhưng hay lờ nhắc nhở thông thường, nên cần một thứ "thúc" mạnh dần đúng giờ. Họ dùng chủ yếu trên điện thoại và máy tính, tiếng Việt.

## Product Purpose

Streak giúp người dùng giữ kỷ luật cá nhân bằng nhắc nhở đúng giờ qua thông báo web, email và gọi điện. Thành công là người dùng thực sự làm việc đã hẹn và giữ được chuỗi ngày liên tục, không chỉ nhận được thông báo.

## Positioning

Nếu người dùng lờ nhắc nhở, hệ thống tự leo thang sang kênh mạnh hơn (web, rồi email sau +5 phút, rồi gọi điện sau +10 phút) cho đến khi họ xác nhận. App nhắc nhở thông thường dừng ở một thông báo và để người dùng bỏ qua.

## Operating Context

Dự án cá nhân của Nguyễn Mạnh Duy; mục đích chính là học Clean Architecture + CQRS để phỏng vấn, không chỉ để chạy sản phẩm. FE là Vite + React + React Router + Tailwind v4 + shadcn/ui (Radix, style new-york), toàn bộ render phía trình duyệt. Backend .NET 10 Minimal API. Đăng nhập chỉ bằng Google (FE lấy ID token, BE kiểm tra rồi phát JWT).

## Capabilities and Constraints

- Hiện chạy thật: đăng nhập Google, lưu phiên, đăng xuất. Chưa có entity/API nhắc nhở, nên các con số trên trang Home (chuỗi ngày, hoàn thành tuần, cuộc gọi) chỉ là minh hoạ mẫu, không phải dữ liệu thật.
- Trang hiện có: Home, Hướng dẫn, header, popup đăng nhập (shadcn Dialog). Route lạ redirect về `/`.
- Chế độ sáng/tối tự viết (class `.dark`, key `streak-theme`), mặc định tối.
- Bắt buộc: copy giao diện bằng tiếng Việt; không dùng `next-themes`; ưu tiên component shadcn có sẵn; token màu qua CSS variable, không viết hex trong component; có nhánh `prefers-reduced-motion`.
- Chưa quyết định: logo/nhận diện riêng, nội dung trang Hướng dẫn về sau.

## Brand Commitments

Tên "Streak". Ba bước leo thang đã mang ý nghĩa tăng dần (web, email, gọi điện) và nên giữ nguyên thứ tự này trong nội dung. Phong cách hiện tại ("Dark Alarm", amber trên nền tối) là thứ cần thay theo yêu cầu thiết kế lại, không phải cam kết thương hiệu.

## Evidence on Hand

Chưa có người dùng thật, lời chứng thực, số liệu hay case study. Không được bịa các thứ này. Số liệu trên Home là dữ liệu mẫu và phải được hiểu như vậy.

## Product Principles

1. Leo thang là cốt lõi: giao diện phải làm người ta cảm nhận được "càng lờ đi càng nghiêm trọng".
2. Thành thật về những gì đã chạy: không giả vờ có tính năng hay dữ liệu chưa tồn tại.
3. Giữ kỷ luật là việc nghiêm túc nhưng không phải trừng phạt: giọng điệu cương quyết mà không hù doạ.
4. Tiếng Việt là ngôn ngữ chính, đọc tốt trên điện thoại.

## Accessibility & Inclusion

Chữ tiếng Việt có dấu phải hiển thị đúng (đã từng lỗi font fallback). Tôn trọng `prefers-reduced-motion`. Dùng được bằng bàn phím và trình đọc màn hình (Radix đã lo focus và aria cho Dialog).
