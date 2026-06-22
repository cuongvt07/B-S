# UI/UX Design Spec — CMS Admin Tin Đăng Bất Động Sản

> **Triết lý thiết kế:** Dense information UI — mỗi pixel phải làm việc. Không card bo tròn gradient, không hero section, không illustration. Gần với Bloomberg Terminal hơn là Notion. Màu sắc chỉ để truyền tín hiệu trạng thái, không trang trí.

---

## 1. Design Tokens

### Màu sắc

| Token | Hex | Dùng cho |
|---|---|---|
| `--bg-base` | `#0F1117` | Nền toàn trang |
| `--bg-surface` | `#181C27` | Panel, sidebar, card |
| `--bg-raised` | `#222636` | Input, row hover |
| `--border` | `#2E3347` | Đường kẻ, divider |
| `--text-primary` | `#E8EAF0` | Tiêu đề, label chính |
| `--text-secondary` | `#8B91A7` | Label phụ, metadata |
| `--text-muted` | `#4E5368` | Placeholder, disabled |
| `--accent` | `#3D6FFF` | CTA chính, active state |
| `--accent-dim` | `#1A2E6B` | Accent background |
| `--success` | `#22C55E` | Đã duyệt, active |
| `--warning` | `#F59E0B` | Chờ duyệt, cần xử lý |
| `--danger` | `#EF4444` | Từ chối, xóa, lỗi |
| `--info` | `#06B6D4` | Thông tin, tooltip |

### Typography

```
Display / Heading  : Inter, weight 600–700, tracking -0.02em
Body / Label       : Inter, weight 400–500
Data / Mono        : JetBrains Mono — giá tiền, mã tin, timestamps
Size scale         : 11 / 12 / 13 / 14 / 16 / 20 / 24px
```

> **Nguyên tắc:** Font size 13px là default cho table row. Không dùng font-size lớn hơn 16px trong data table.

### Spacing

```
4 / 8 / 12 / 16 / 24 / 32 / 48px
Grid: 8px base unit
```

---

## 2. Layout Tổng Thể

```
┌─────────────────────────────────────────────────────────────┐
│  TOPBAR  [Logo] [Breadcrumb]        [Noti] [Avatar] [Search] │  40px
├──────────┬──────────────────────────────────────────────────┤
│          │  CONTEXTUAL TOOLBAR (action bar theo màn hình)    │  36px
│ SIDEBAR  ├──────────────────────────────────────────────────┤
│  220px   │                                                    │
│ (fixed)  │              MAIN CONTENT AREA                     │
│          │              (scroll độc lập)                      │
│          │                                                    │
│          ├──────────────────────────────────────────────────┤
│          │  STATUS BAR: tổng record / filter đang dùng       │  28px
└──────────┴──────────────────────────────────────────────────┘
```

**Sidebar** không collapse hoàn toàn — thu lại còn 48px icon-only khi cần diện tích.

---

## 3. Sidebar Navigation

```
┌────────────────────┐
│ 🏢 BDS Admin  ≡    │
├────────────────────┤
│ ▸ Dashboard        │
├────────────────────┤
│ TIN ĐĂNG           │  ← section label, uppercase 10px muted
│   Tất cả tin       │
│   Chờ duyệt    [8] │  ← badge số lượng
│   Đã đăng         │
│   Từ chối          │
│   Hết hạn          │
├────────────────────┤
│ DANH MỤC           │
│   Loại BĐS         │
│   Khu vực          │
│   Tag / Tiện ích   │
├────────────────────┤
│ NGƯỜI DÙNG         │
│   Tài khoản        │
│   Gói đăng tin     │
├────────────────────┤
│ GIAO DIỆN          │
│   Cấu hình layout  │
│   Widget hiển thị  │
│   SEO template     │
├────────────────────┤
│ HỆ THỐNG           │
│   Cài đặt chung    │
│   Log hoạt động    │
└────────────────────┘
```

Active item: `background: --accent-dim`, `border-left: 2px solid --accent`, text `--text-primary`.

---

## 4. Module: Quản Lý Tin Đăng

### 4.1 Toolbar trên bảng

```
┌──────────────────────────────────────────────────────────────┐
│ [+ Tạo tin]  [Duyệt hàng loạt ▾]  [Xuất CSV]               │
│                          [🔍 Tìm mã/tiêu đề]  [Lọc ▾] [≡]  │
└──────────────────────────────────────────────────────────────┘
```

- `[Lọc ▾]` mở dropdown filter panel ngay bên dưới — **không mở modal**
- `[≡]` toggle hiện/ẩn cột (column visibility)

### 4.2 Filter Panel (inline, không modal)

```
┌──────────────────────────────────────────────────────────────────┐
│ Trạng thái: [Tất cả] [Chờ duyệt] [Đã đăng] [Từ chối] [Hết hạn] │
│ Loại BĐS:  [Căn hộ ▾]  Khu vực: [Hà Nội ▾] > [Cầu Giấy ▾]    │
│ Giá:       [______] – [______] triệu   Ngày đăng: [từ] – [đến]  │
│                                          [Xóa lọc]  [Áp dụng]   │
└──────────────────────────────────────────────────────────────────┘
```

Filter active → hiển thị tag pill bên dưới toolbar, mỗi tag có `×` để xóa riêng.

### 4.3 Bảng Danh Sách Tin

> Dense table. Row height 36px. Dùng mono font cho số.

| Cột | Rộng | Ghi chú |
|---|---|---|
| ☐ | 32px | Checkbox chọn hàng loạt |
| Mã tin | 80px | Mono, link click sang detail |
| Tiêu đề | flex | Truncate 1 dòng, tooltip full |
| Loại | 90px | Tag pill nhỏ |
| Khu vực | 110px | Quận/Huyện |
| Giá | 100px | Mono, align right |
| Trạng thái | 90px | Badge màu theo trạng thái |
| Người đăng | 110px | Avatar 16px + tên |
| Lượt xem | 64px | Mono |
| Ngày đăng | 90px | Relative time (hover → full) |
| Hết hạn | 90px | Màu đỏ nếu < 3 ngày |
| Hành động | 72px | `✓` `✕` `✎` `⋯` |

**Row states:**
- Default: `--bg-surface`
- Hover: `--bg-raised`
- Selected: `background: --accent-dim`, `border-left: 2px --accent`
- Chờ duyệt: chấm vàng trước mã tin

**Badge trạng thái:**
```
[● Chờ duyệt]  background: #3D2E00, color: #F59E0B, border: 1px #F59E0B40
[● Đã đăng  ]  background: #0F2E1A, color: #22C55E, border: 1px #22C55E40
[● Từ chối  ]  background: #2E0F0F, color: #EF4444, border: 1px #EF444440
[● Hết hạn  ]  background: #1E1E1E, color: #8B91A7, border: 1px #2E3347
```

---

## 5. Module: Chi Tiết / Tạo Mới Tin

Layout 2 cột — nội dung chính chiếm 65%, sidebar thao tác 35%.

```
┌────────────────────────────────┬───────────────────────┐
│  THÔNG TIN CƠ BẢN              │  TRẠNG THÁI & XUẤT BẢN│
│  ─────────────────────         │  ─────────────────────│
│  Tiêu đề *                     │  [● Chờ duyệt      ▾] │
│  ┌──────────────────────────┐  │                       │
│  │                          │  │  [Duyệt đăng]         │
│  └──────────────────────────┘  │  [Từ chối]            │
│                                │  [Lưu nháp]           │
│  Mô tả                         │  ─────────────────────│
│  ┌──────────────────────────┐  │  GÓI / THỜI HẠN       │
│  │  (rich text editor       │  │  Gói:  Standard 30n   │
│  │   toolbar gọn, 1 hàng)   │  │  Đăng: 01/06/2025     │
│  │                          │  │  HH:   01/07/2025 ⚠   │
│  └──────────────────────────┘  │  ─────────────────────│
│                                │  NGƯỜI ĐĂNG           │
│  PHÂN LOẠI & VỊ TRÍ            │  @nguyenvana           │
│  ─────────────────────         │  📞 0912 xxx xxx       │
│  [Loại BĐS ▾] [Nhu cầu ▾]     │  [Xem hồ sơ ↗]        │
│  [Tỉnh ▾] [Quận ▾] [Phường ▾] │  ─────────────────────│
│  Địa chỉ cụ thể                │  LỊCH SỬ DUYỆT        │
│  ┌──────────────────────────┐  │  02/06 Admin A duyệt  │
│  └──────────────────────────┘  │  28/05 Tạo bởi user   │
│  [Xem bản đồ ↗]               │                       │
│                                │  LÝ DO TỪ CHỐI        │
│  THÔNG SỐ BẤT ĐỘNG SẢN         │  ┌─────────────────┐  │
│  ─────────────────────         │  │ (textarea)      │  │
│  Diện tích  Giá     Pháp lý    │  └─────────────────┘  │
│  [___] m²   [___]đ  [SHR ▾]   │                       │
│                                │                       │
│  HÌNH ẢNH (tối đa 20 ảnh)      │                       │
│  ─────────────────────         │                       │
│  [grid ảnh 4 cột, drag reorder]│                       │
└────────────────────────────────┴───────────────────────┘
```

**Nguyên tắc form:**
- Label trên input, font 11px uppercase `--text-muted`, spacing 4px
- Input border `--border`, focus `border-color: --accent`, không shadow
- Required field: dấu `*` màu `--danger` cạnh label, không text "bắt buộc"
- Error: border đỏ + text lỗi 11px bên dưới input, không toast pop-up

---

## 6. Module: Cấu Hình Giao Diện

### 6.1 Layout chính

```
┌─────────────────────────────────────────────────────────────┐
│ CẤU HÌNH GIAO DIỆN              [Lưu cấu hình]  [Preview ↗] │
├──────────────────────┬──────────────────────────────────────┤
│  TAB ĐIỀU HƯỚNG      │                                       │
│  ─────────────────   │         VÙNG CẤU HÌNH                │
│  ▶ Trang chủ         │         (thay đổi theo tab)           │
│    Trang danh sách   │                                       │
│    Trang chi tiết    │                                       │
│    Trang tìm kiếm    │                                       │
│    Header / Footer   │                                       │
│    Widget sidebar    │                                       │
└──────────────────────┴──────────────────────────────────────┘
```

### 6.2 Cấu hình trang danh sách tin

```
┌─────────────────────────────────────────────────────────────┐
│ CHẾ ĐỘ HIỂN THỊ MẶC ĐỊNH                                   │
│ ( ) Grid 2 cột   (●) Grid 3 cột   ( ) Danh sách dọc        │
├─────────────────────────────────────────────────────────────┤
│ THÔNG TIN HIỂN THỊ TRÊN CARD/ROW                           │
│                                                             │
│ Kéo thả để sắp xếp thứ tự. Toggle để bật/tắt.             │
│                                                             │
│  ⠿  [✓] Ảnh đại diện          Tỉ lệ khung: [16:9 ▾]       │
│  ⠿  [✓] Tiêu đề               Số dòng: [2 ▾]              │
│  ⠿  [✓] Giá                   Định dạng: [Rút gọn ▾]       │
│  ⠿  [✓] Diện tích             Đơn vị: [m² ▾]               │
│  ⠿  [✓] Địa chỉ               Chi tiết đến: [Quận ▾]       │
│  ⠿  [✓] Loại BĐS              —                            │
│  ⠿  [ ] Ngày đăng             —                            │
│  ⠿  [ ] Lượt xem              —                            │
│  ⠿  [ ] Số phòng ngủ          —                            │
│  ⠿  [ ] Tên người đăng        —                            │
│  ⠿  [✓] Nhãn nổi bật (badge)  —                            │
├─────────────────────────────────────────────────────────────┤
│ PHÂN TRANG                                                  │
│ Số tin/trang: [___]    Kiểu: (●) Số trang  ( ) Load more   │
├─────────────────────────────────────────────────────────────┤
│ BỘ LỌC HIỂN THỊ                                             │
│ [✓] Loại BĐS  [✓] Khu vực  [✓] Giá  [ ] Diện tích         │
│ [ ] Số phòng  [ ] Pháp lý  [ ] Hướng nhà                   │
│ Vị trí hiển thị: (●) Sidebar  ( ) Trên danh sách           │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Cấu hình trang chi tiết tin

```
┌─────────────────────────────────────────────────────────────┐
│ LAYOUT TRANG CHI TIẾT                                       │
│ (●) 2 cột (nội dung + sidebar)   ( ) 1 cột toàn chiều rộng │
├────────────────────────────────┬────────────────────────────┤
│ CỘT NỘI DUNG CHÍNH (65%)       │ SIDEBAR (35%)              │
│ ─────────────────              │ ─────────────────          │
│ ⠿ [✓] Gallery ảnh              │ ⠿ [✓] Thông tin giá        │
│ ⠿ [✓] Thông số kỹ thuật        │ ⠿ [✓] Form liên hệ         │
│ ⠿ [✓] Mô tả chi tiết           │ ⠿ [✓] Thông tin MXH        │
│ ⠿ [✓] Thông tin vị trí + map   │ ⠿ [ ] Chia sẻ              │
│ ⠿ [ ] Video                    │ ⠿ [✓] Tin tương tự         │
│ ⠿ [✓] Tiện ích                 │ ⠿ [ ] Quảng cáo slot       │
│ ⠿ [ ] Hạ tầng xung quanh       │                            │
├────────────────────────────────┴────────────────────────────┤
│ THÔNG SỐ KỸ THUẬT — CHỌN TRƯỜNG HIỂN THỊ                   │
│ [✓] Diện tích  [✓] Giá/m²  [✓] Pháp lý  [✓] Phòng ngủ     │
│ [✓] Nhà vệ sinh  [ ] Hướng  [ ] Tầng  [✓] Năm xây          │
│ Số cột hiển thị thông số: (●) 3 cột  ( ) 4 cột  ( ) 2 cột  │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Cấu hình Widget Sidebar toàn site

```
┌─────────────────────────────────────────────────────────────┐
│ WIDGET SIDEBAR                        [+ Thêm widget]        │
├─────────────────────────────────────────────────────────────┤
│ ⠿  Tin nổi bật        [✓ Bật]  Số tin: [5]  [Sửa] [×]     │
│ ⠿  Tìm kiếm nhanh     [✓ Bật]             —  [Sửa] [×]     │
│ ⠿  Danh mục BĐS       [✓ Bật]  Hiện số:  [✓] [Sửa] [×]    │
│ ⠿  Bản đồ khu vực     [ Tắt]             —  [Sửa] [×]     │
│ ⠿  Tin mới nhất       [✓ Bật]  Số tin: [8]  [Sửa] [×]     │
│ ⠿  Quảng cáo 300×250  [ Tắt]             —  [Sửa] [×]     │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Dashboard

Không dùng big number card kiểu Saas thông thường. Dùng **data rows** — dense, như bảng điều phối.

```
┌─────────────────────────────────────────────────────────────┐
│ HÔM NAY — Thứ Hai, 09/06/2025  07:34                       │
├──────────────────────────────────────┬──────────────────────┤
│ XỬ LÝ CẦN THIẾT                      │ HOẠT ĐỘNG GẦN ĐÂY    │
│ ─────────────────                    │ ─────────────────    │
│ Chờ duyệt          8 tin      [Xem]  │ 10:22  A duyệt #4521 │
│ Báo cáo vi phạm    3 tin      [Xem]  │ 10:18  B đăng #4522  │
│ Tài khoản chờ kích  2 acc     [Xem]  │ 09:55  C đăng #4520  │
│ Tin hết hạn hôm nay 5 tin     [Xem]  │ 09:30  D báo cáo     │
├──────────────────────────────────────┤ ...                  │
│ THỐNG KÊ 30 NGÀY QUA                 │                      │
│ ─────────────────                    ├──────────────────────┤
│ Tin đăng mới      1,204              │ TOP KHU VỰC          │
│ Tin đã duyệt      1,102  (91.5%)     │ ─────────────────    │
│ Tin từ chối          89  ( 7.4%)     │ Cầu Giấy      342    │
│ Tổng lượt xem   84,291              │ Thanh Xuân    287    │
│ Người đăng mới      218              │ Nam Từ Liêm   201    │
│                                      │ Đống Đa       178    │
└──────────────────────────────────────┴──────────────────────┘
```

---

## 8. Patterns & Components

### Toaster / Notification

```
┌────────────────────────────────────┐
│ ✓  Đã duyệt 3 tin đăng             │  ← bottom-right, 280px
│    #4521, #4522, #4523              │     auto-dismiss 4s
└────────────────────────────────────┘
```

- Chỉ dùng toast cho **kết quả hành động đã xảy ra**
- Lỗi validation → hiển thị tại chỗ trên form, không toast

### Modal

Dùng khi cần xác nhận destructive action hoặc form phụ ngắn. Không dùng modal để hiển thị thông tin.

```
┌──────────────────────────────┐
│ Xác nhận từ chối 3 tin?      │
│                              │
│ Lý do:                       │
│ ┌──────────────────────────┐ │
│ │ (textarea)               │ │
│ └──────────────────────────┘ │
│                              │
│           [Hủy]  [Từ chối]  │
└──────────────────────────────┘
```

Width: 480px. Overlay: `rgba(0,0,0,0.7)`. Không animation scale/bounce.

### Dropdown Filter

```
┌─────────────────┐
│ ● Tất cả        │
│   Căn hộ chung  │
│   Nhà riêng     │
│   Đất nền       │
│   Văn phòng     │
│   Thương mại    │
└─────────────────┘
```

Border `--border`, background `--bg-surface`, max-height 240px scroll.

### Empty State

```
┌──────────────────────────────────────┐
│                                      │
│   Không có tin nào khớp bộ lọc       │
│   Thử bỏ một số điều kiện lọc        │
│                                      │
│              [Xóa bộ lọc]            │
│                                      │
└──────────────────────────────────────┘
```

Không dùng illustration. Text plain, action button rõ ràng.

---

## 9. Nguyên Tắc UX

| # | Nguyên tắc | Cụ thể |
|---|---|---|
| 1 | **Hành động hàng loạt là first-class** | Checkbox + action bar nổi khi chọn nhiều dòng |
| 2 | **Không mở màn hình mới để xem nhanh** | Click vào row → slide-in panel 40% chiều rộng xem chi tiết, mở tab mới chỉ khi cần edit full |
| 3 | **Trạng thái filter luôn hiện** | Tag pill + count "Đang lọc: 3 điều kiện" trên bảng |
| 4 | **Undo thay vì confirm mọi thứ** | Xóa/từ chối → toast với nút Hoàn tác trong 5s |
| 5 | **Số liệu dùng mono font** | Giá, diện tích, mã tin, timestamps — không trộn với sans-serif |
| 6 | **Keyboard-first** | `Space` chọn row, `D` duyệt, `R` từ chối, `/` focus search |
| 7 | **Mật độ thông tin có thể điều chỉnh** | Toggle "Compact / Comfortable" cho table, lưu per-user |
| 8 | **Không bao giờ mất dữ liệu form** | Auto-save draft mỗi 30s, cảnh báo khi rời trang chưa lưu |

---

## 10. Màn Hình Responsive (1280px → 1440px+)

CMS admin này **không cần mobile**. Breakpoint tối thiểu: 1280px.

- `< 1440px`: sidebar icon-only (48px), bảng scroll ngang
- `≥ 1440px`: sidebar đầy đủ (220px), bảng hiển thị tất cả cột

---

## 11. Checklist Trước Khi Dev

- [ ] Tất cả state của bảng đều có: loading skeleton, empty, error, data
- [ ] Mọi action destructive đều có confirm (modal hoặc undo toast)
- [ ] Filter state persist qua reload (URL params)
- [ ] Pagination state persist qua reload
- [ ] Keyboard navigation hoạt động trên bảng
- [ ] Column sort hiển thị rõ hướng sort và cột đang sort
- [ ] Permission check: editor không thấy nút "Xóa vĩnh viễn"
- [ ] Timestamps luôn dùng timezone Asia/Ho_Chi_Minh
