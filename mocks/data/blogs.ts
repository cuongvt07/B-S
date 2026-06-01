import type { Blog } from '@/types';

const COVER = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

export const blogs: Blog[] = [
  {
    id: 'b-001',
    slug: 'kinh-nghiem-thue-nha-tphcm-10-luu-y',
    title: 'Kinh nghiệm thuê nhà tại TP.HCM: 10 điều cần lưu ý trước khi đặt cọc',
    excerpt:
      'Thuê nhà tại TP.HCM không khó nếu bạn nắm rõ những lưu ý quan trọng về hợp đồng, đặt cọc, kiểm tra nội thất và pháp lý chủ nhà. Bài viết tổng hợp 10 kinh nghiệm thực chiến.',
    content: `## Mở đầu

Thị trường thuê nhà tại TP.HCM rất sôi động nhưng cũng tiềm ẩn nhiều rủi ro nếu người thuê thiếu kinh nghiệm. Trước khi đặt cọc một căn nhà hay căn hộ, hãy đảm bảo bạn đã kiểm tra đủ những điều dưới đây.

## 1. Kiểm tra giấy tờ chủ nhà

Yêu cầu chủ nhà cung cấp **sổ hồng/sổ đỏ** hoặc giấy uỷ quyền cho thuê (nếu là người được uỷ quyền). Đối chiếu CCCD với tên trên sổ.

## 2. Đọc kỹ hợp đồng thuê

Hợp đồng nên có đầy đủ: thời hạn, giá thuê, phương thức thanh toán, điều khoản tăng giá, điều khoản chấm dứt sớm, trách nhiệm sửa chữa.

## 3. Đặt cọc hợp lý

Đặt cọc thường 1-2 tháng tiền thuê. **Không đặt cọc khi chưa xem nhà thật** hoặc qua trung gian không rõ ràng.

## 4. Kiểm tra nội thất chi tiết

Liệt kê toàn bộ đồ đạc, tình trạng (mới/cũ/hỏng) và ký xác nhận hai bên. Chụp ảnh làm bằng chứng.

## 5. Hỏi rõ về phí phát sinh

Phí quản lý, phí gửi xe, internet, điện nước có giá định mức hay theo nhà nước? Có phí dọn vệ sinh đầu vào không?

## 6. Tìm hiểu hàng xóm và khu vực

Khu vực có an ninh tốt không? Có hay bị ngập, kẹt xe? Hàng xóm có ồn ào? Tốt nhất nên ghé thử vào buổi tối hoặc cuối tuần.

## 7. Hỏi về điều khoản tăng giá

Một số chủ nhà sẽ tăng giá thuê sau 6-12 tháng. Cần ghi rõ trong hợp đồng tỷ lệ tăng tối đa.

## 8. Pháp lý PCCC

Đối với chung cư mini hoặc nhà trọ, hỏi rõ về giấy phép PCCC. Đây là vấn đề sống còn.

## 9. Lưu giữ hoá đơn

Mọi khoản thanh toán nên có hoá đơn/biên nhận. Chuyển khoản có nội dung rõ ràng.

## 10. Đừng vội

Nếu chủ nhà thúc ép đặt cọc nhanh, hãy cảnh giác. Nhà tốt sẽ có nhiều người thuê — nhưng nhà rất "ngon" mà giá rẻ bất thường thường có vấn đề.

## Tổng kết

Thuê nhà là một quyết định lớn. Đầu tư thêm vài giờ kiểm tra kỹ sẽ giúp bạn tránh được nhiều rắc rối về sau.`,
    coverImage: COVER('1560518883-ce09059eeffa'),
    authorName: 'Nguyễn Hoàng Nam',
    categoryTag: 'Kinh nghiệm',
    tags: ['thuê nhà', 'TP.HCM', 'hợp đồng', 'đặt cọc'],
    readingMinutes: 6,
    publishedAt: '2026-05-20T03:00:00.000Z',
    updatedAt: '2026-05-22T03:00:00.000Z',
  },
  {
    id: 'b-002',
    slug: 'top-5-du-an-can-ho-dau-tu-ha-noi-2026',
    title: 'Top 5 dự án căn hộ đáng đầu tư tại Hà Nội năm 2026',
    excerpt:
      'Cập nhật danh sách 5 dự án căn hộ tại Hà Nội đang có tiềm năng tăng giá và cho thuê tốt năm 2026, dựa trên dữ liệu giao dịch quý 1.',
    content: `## Tổng quan thị trường Hà Nội Q1/2026

Thị trường căn hộ Hà Nội ghi nhận lượng giao dịch tăng 18% so với cùng kỳ năm 2025, trong đó **phân khúc trung cấp 2-4 tỷ chiếm 64%**.

## 1. Vinhomes Smart City — Nam Từ Liêm

Lý do nên đầu tư:
- Hạ tầng nội khu hoàn thiện, đã đi vào vận hành
- Mật độ căn hộ ở thực cao, dễ cho thuê
- Giá đang neo ở mức 50-55 triệu/m², khả năng tăng 10-15%/năm

## 2. The Manor Central Park — Hoàng Mai

Vị trí đắc địa cạnh công viên Yên Sở. Hạng mục thương mại và văn phòng đã lấp đầy, kéo nhu cầu thuê căn hộ tăng mạnh.

## 3. Masteri Waterfront — Gia Lâm

Dự án Masterise Homes phát triển, vị trí ven sông, gần Vinhomes Ocean Park. Giá thứ cấp đang test mức kháng cự 65 triệu/m².

## 4. Sunshine City — Tây Hồ

Tiêu chuẩn smart-home, lifestyle resort. Phân khúc cao cấp nhưng tỷ suất cho thuê ổn định 4-5%/năm.

## 5. Hinode City — Hai Bà Trưng

Vị trí trung tâm, đã bàn giao 2024, cộng đồng cư dân ổn định. Phù hợp đầu tư cho thuê dài hạn.

## Lưu ý khi đầu tư

- **Kiểm tra pháp lý**: ưu tiên căn đã có sổ hồng
- **Hạ tầng kết nối**: gần metro/bus rapid sẽ tăng giá nhanh
- **Tỷ lệ cho thuê**: dự án có khu thương mại lấp đầy thường cho thuê tốt

## FAQ

**Có nên vay ngân hàng đầu tư căn hộ?**

Có thể, nhưng tỷ lệ vay không nên quá 50% giá trị căn hộ để đảm bảo dòng tiền.

**Mua tại thị trường sơ cấp hay thứ cấp?**

Thứ cấp giúp đánh giá được thực trạng dự án, ít rủi ro chậm tiến độ. Sơ cấp có chính sách ưu đãi tốt hơn.`,
    coverImage: COVER('1545324418-cc1a3fa10c00'),
    authorName: 'Trần Minh Quân',
    categoryTag: 'Phân tích thị trường',
    tags: ['Hà Nội', 'đầu tư', 'căn hộ', '2026'],
    readingMinutes: 7,
    publishedAt: '2026-05-15T03:00:00.000Z',
    updatedAt: '2026-05-18T03:00:00.000Z',
  },
  {
    id: 'b-003',
    slug: 'phong-thuy-huong-nha-menh-thuy',
    title: 'Phong thuỷ nhà ở: hướng nhà nào hợp với người mệnh Thuỷ?',
    excerpt:
      'Theo phong thuỷ ngũ hành, người mệnh Thuỷ có những hướng nhà tốt và xấu rõ ràng. Bài viết phân tích chi tiết và đưa ra gợi ý chọn hướng nhà phù hợp.',
    content: `## Người mệnh Thuỷ là ai?

Mệnh Thuỷ tương ứng với các năm sinh: 1953, 1962, 1963, 1974, 1975, 1982, 1983, 1996, 1997, 2004, 2005...

## Hướng nhà tốt cho mệnh Thuỷ

Mệnh Thuỷ thuộc **Đông Tứ Mệnh**, hợp với 4 hướng:

1. **Đông** (Chấn) — Sinh khí: tài lộc, sức khoẻ
2. **Đông Nam** (Tốn) — Thiên y: gia đạo bình an
3. **Bắc** (Khảm) — Diên niên: hôn nhân, sự nghiệp ổn định
4. **Nam** (Ly) — Phục vị: học hành, công danh

## Hướng nhà xấu cần tránh

- **Tây Bắc** (Càn)
- **Tây** (Đoài)
- **Tây Nam** (Khôn)
- **Đông Bắc** (Cấn)

## Bố trí nội thất theo mệnh Thuỷ

- **Màu sắc chủ đạo**: đen, xanh dương, trắng (Kim sinh Thuỷ)
- **Vị trí bàn làm việc**: đặt ở hướng Đông hoặc Bắc
- **Cây cảnh**: cây thuỷ sinh, hồ cá nhỏ ở phòng khách
- **Tránh**: gam màu vàng đậm (Thổ khắc Thuỷ), gốm sứ nâu

## Khi không thể chọn hướng nhà

Nếu căn hộ chung cư không hợp hướng, bạn có thể:
- Bố trí hướng cửa chính phòng ngủ theo hướng tốt
- Đặt giường ngủ đầu giường hướng tốt
- Sử dụng vật phẩm phong thuỷ hợp mệnh

## Kết luận

Phong thuỷ là yếu tố tham khảo, không nên cứng nhắc. Quan trọng nhất vẫn là ngôi nhà có vị trí thuận tiện, kết cấu vững chắc và giá phù hợp tài chính.`,
    coverImage: COVER('1600585154340-be6161a56a0c'),
    authorName: 'Lê Thị Hồng',
    categoryTag: 'Phong thuỷ',
    tags: ['phong thuỷ', 'hướng nhà', 'mệnh Thuỷ'],
    readingMinutes: 5,
    publishedAt: '2026-05-10T03:00:00.000Z',
    updatedAt: '2026-05-10T03:00:00.000Z',
  },
  {
    id: 'b-004',
    slug: 'thi-truong-bds-q1-2026-diem-sang',
    title: 'Thị trường BĐS quý 1/2026: đâu là điểm sáng?',
    excerpt:
      'Báo cáo phân tích thị trường bất động sản Việt Nam quý 1/2026: phân khúc nào tăng trưởng, khu vực nào hồi phục, dự báo nửa cuối năm.',
    content: `## Tổng quan

Q1/2026 ghi nhận sự phục hồi rõ rệt của thị trường BĐS Việt Nam sau giai đoạn trầm lắng 2023-2024.

## Phân khúc tăng trưởng

### Căn hộ trung cấp (2-4 tỷ)
- Lượng giao dịch +22% YoY
- Tập trung tại TP.HCM, Hà Nội, Bình Dương
- Người mua chủ yếu là thực mua (~78%)

### Đất nền vệ tinh
- Long Thành, Nhơn Trạch (Đồng Nai)
- Bình Phước, Vũng Tàu
- Hưởng lợi từ hạ tầng sân bay và cao tốc

## Phân khúc trầm lắng

- **Biệt thự nghỉ dưỡng**: tiếp tục khó thanh khoản
- **Căn hộ siêu sang (>15 tỷ)**: chỉ tăng 3% YoY

## Khu vực hồi phục

| Khu vực | Tăng giá Q1 | Triển vọng |
|---------|-------------|------------|
| TP. Thủ Đức | +8% | Tích cực |
| Bình Dương (Thuận An, Dĩ An) | +12% | Rất tích cực |
| Đông Hà Nội (Gia Lâm) | +9% | Tích cực |
| Long Thành (Đồng Nai) | +15% | Đột biến |

## Dự báo nửa cuối 2026

- Lãi suất duy trì thấp → hỗ trợ vay mua nhà
- Nhiều dự án mở bán mới sẽ làm tăng cạnh tranh phân khúc trung cấp
- Đất nền vùng ven tiếp tục là kênh đầu tư hot

## Lời khuyên

Người mua ở thực: nên xuống tiền giai đoạn Q2-Q3, nhiều chính sách ưu đãi.

Nhà đầu tư: ưu tiên phân khúc trung cấp, vị trí gần hạ tầng giao thông mới.`,
    coverImage: COVER('1554995207-c18c203602cb'),
    authorName: 'Hoàng Anh Tuấn',
    categoryTag: 'Phân tích thị trường',
    tags: ['phân tích', '2026', 'báo cáo', 'thị trường'],
    readingMinutes: 8,
    publishedAt: '2026-05-05T03:00:00.000Z',
    updatedAt: '2026-05-08T03:00:00.000Z',
  },
  {
    id: 'b-005',
    slug: 'check-phap-ly-du-an-can-ho-truoc-khi-mua',
    title: 'Cách check pháp lý dự án căn hộ trước khi mua — checklist 8 bước',
    excerpt:
      'Mua căn hộ là khoản đầu tư lớn nhất đời với nhiều người. Checklist 8 bước kiểm tra pháp lý dự án giúp bạn tránh "ngậm trái đắng".',
    content: `## Vì sao phải check pháp lý?

Nhiều người mua căn hộ đã mất tiền hoặc bị treo tài sản nhiều năm vì dự án vướng pháp lý. Trước khi xuống tiền, hãy đảm bảo 8 điểm sau.

## Checklist 8 bước

### 1. Giấy chứng nhận quyền sử dụng đất

Chủ đầu tư phải có sổ đỏ/sổ hồng cho khu đất dự án. Yêu cầu xem bản gốc hoặc bản photo công chứng.

### 2. Quyết định giao đất / cho thuê đất

Văn bản từ UBND tỉnh/thành phố. Kiểm tra **thời hạn sử dụng đất** (50, 70 hay lâu dài).

### 3. Quy hoạch 1/500

Quy hoạch chi tiết 1/500 đã được phê duyệt. Đây là cơ sở để chủ đầu tư được phép xây dựng.

### 4. Giấy phép xây dựng

Đối chiếu giấy phép xây dựng với thực tế thi công: số tầng, mật độ, công năng.

### 5. Văn bản thông báo đủ điều kiện bán nhà hình thành trong tương lai

Đây là **văn bản quan trọng nhất**. Sở Xây dựng cấp văn bản này khi dự án đã đủ điều kiện huy động vốn.

### 6. Bảo lãnh ngân hàng

Theo Luật Kinh doanh BĐS, dự án nhà ở hình thành trong tương lai phải có **bảo lãnh ngân hàng**. Yêu cầu xem chứng thư bảo lãnh.

### 7. Hợp đồng mua bán mẫu

Đọc kỹ hợp đồng, đặc biệt:
- Điều khoản phạt chậm tiến độ (thường 0.05%/ngày)
- Điều khoản về diện tích thông thuỷ vs tim tường
- Quy định về phí bảo trì 2%

### 8. Lịch sử pháp lý chủ đầu tư

Tra cứu chủ đầu tư có dự án nào bị chậm bàn giao, vướng kiện tụng không. Google + đọc forum cư dân.

## Tổng kết

8 bước trên là tối thiểu. Nếu có điều kiện, thuê luật sư chuyên BĐS để rà soát hợp đồng trước khi ký. Phí 5-10 triệu nhưng có thể tránh được rủi ro hàng tỷ đồng.`,
    coverImage: COVER('1582407947304-fd86f028f716'),
    authorName: 'LS. Phạm Văn Hậu',
    categoryTag: 'Pháp lý',
    tags: ['pháp lý', 'mua nhà', 'căn hộ', 'checklist'],
    readingMinutes: 9,
    publishedAt: '2026-04-28T03:00:00.000Z',
    updatedAt: '2026-05-02T03:00:00.000Z',
  },
];

export const blogBySlug = new Map(blogs.map((b) => [b.slug, b]));
