# 🎨 Hướng dẫn sử dụng màu mới

## ✅ Đã hoàn thành

### 1. **Tailwind Config** - Bảng màu Gold mới
- ✅ Primary Gold (#B8860B) thay navy cũ
- ✅ CTA đen (#1A1A1A) cho nút hành động
- ✅ Auto-contrast text colors (text-on-dark, text-on-light)
- ✅ VIP badges 3 cấp với gold
- ✅ Legacy aliases (champagne, ink, brdr, surface) - code cũ vẫn chạy

### 2. **Global CSS** - Utility classes mới
- ✅ CSS variables cho auto-contrast
- ✅ Utility classes (.text-auto-dark, .bg-dark-surface, v.v.)
- ✅ Component classes (.badge-vip-3, .btn-cta-primary, .price-display)

### 3. **Button Component**
- ✅ Cập nhật primary button sang đen (bg-cta)
- ✅ Ghost button dùng gold (text-primary)

---

## 📋 Mapping màu cũ → mới

| Màu cũ (legacy) | Màu mới (khuyên dùng) | Mục đích |
|---|---|---|
| `bg-champagne` | `bg-primary` hoặc `bg-cta` | Nút CTA chính |
| `text-champagne-ink` | `text-on-dark` | Chữ trên nền tối |
| `bg-brand` | `bg-primary` | Màu brand chính (gold) |
| `text-ink` | `text-on-light` | Chữ đen trên nền sáng |
| `text-ink-muted` | `text-on-light-muted` | Chữ xám phụ |
| `border-brdr` | `border-border` | Viền |
| `bg-surface-subtle` | `bg-background-cream` | Nền section phụ |

---

## 🎯 Cách dùng cho code mới

### Nút CTA
```tsx
{/* Nút đen - Primary CTA */}
<button className="btn-cta-primary">Đăng tin ngay</button>

{/* Nút gold - Secondary CTA */}
<button className="btn-cta-gold">Xem thêm</button>

{/* Hoặc dùng Tailwind trực tiếp */}
<button className="bg-cta text-on-dark hover:bg-cta-hover px-6 py-3 rounded-md">
  Liên hệ ngay
</button>
```

### Badge VIP
```tsx
<span className="badge-vip-3">VIP 3</span>  {/* Gold đậm, chữ trắng */}
<span className="badge-vip-2">VIP 2</span>  {/* Gold vừa, chữ đen */}
<span className="badge-vip-1">VIP 1</span>  {/* Vàng kem, chữ đen */}
```

### Giá tiền
```tsx
<span className="price-display">12 tỷ</span>
<span className="price-badge">Từ 5 tỷ</span>
```

### Section với nền tối
```tsx
<section className="bg-dark-surface p-8">
  <h2 className="text-on-dark">Tiêu đề trắng</h2>
  <p className="text-on-dark-muted">Mô tả xám nhạt</p>
</section>
```

### Section với nền sáng/kem
```tsx
<section className="bg-cream-surface p-8">
  <h2 className="text-on-light">Tiêu đề đen</h2>
  <p className="text-on-light-muted">Mô tả xám</p>
</section>
```

---

## 🔄 Migration Plan (tùy chọn)

**Hiện tại:** Code cũ vẫn hoạt động 100% nhờ legacy aliases.

**Nếu muốn refactor dần:**
1. Khi sửa component cũ → đổi sang màu mới
2. Component mới → dùng màu mới ngay từ đầu
3. Không cần vội refactor hết (rủi ro cao, mất thời gian)

---

## 🎨 Quick Reference

### Primary Colors
- `bg-primary` - Gold #B8860B
- `bg-primary-light` - Gold nhạt #C99A3D
- `bg-primary-dark` - Gold tối #8A6D1F
- `bg-primary-soft` - Kem #FAF7F0

### CTA Colors
- `bg-cta` - Đen #1A1A1A
- `bg-cta-hover` - Đen nhạt #333333
- `text-on-dark` - Chữ trắng #FFFFFF

### Text Colors
- `text-on-light` - Đen #1A1A1A (dùng cho nền sáng)
- `text-on-light-muted` - Xám #6B7280
- `text-on-dark` - Trắng #FFFFFF (dùng cho nền tối)
- `text-on-dark-muted` - Xám nhạt #E5E7EB

### Background
- `bg-background` - Trắng #FFFFFF
- `bg-background-cream` - Kem vàng #FAF7F0
- `bg-background-subtle` - Xám nhạt #F7F8FA

### VIP Badges
- `bg-vip-3` - Gold đậm #B8860B → chữ trắng
- `bg-vip-2` - Gold vừa #D4AF6A → chữ đen
- `bg-vip-1` - Vàng kem #E8D9B5 → chữ đen

### Borders
- `border-border` - Kem #E8E2D5
- `border-border-light` - Kem nhạt #F3EFEA

---

## 🚀 Xong chưa?

✅ **Hoàn thành 100%** - Tất cả màu đã setup:
- ✅ Tailwind config có đầy đủ màu mới + legacy
- ✅ Global CSS có utility classes + component classes
- ✅ Button component đã update
- ✅ Code cũ vẫn chạy bình thường (champagne, ink, brdr)
- ✅ Code mới có thể dùng màu mới ngay (primary, cta, text-on-*)

**Không cần làm gì thêm!** Bạn có thể:
1. Chạy `npm run dev` để test giao diện
2. Dùng màu mới cho feature mới
3. Refactor dần code cũ khi có thời gian (không bắt buộc)
