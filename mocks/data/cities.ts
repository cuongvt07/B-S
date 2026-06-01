import type { City, District } from '@/types';

function d(code: string, name: string, slug: string, cityCode: string): District {
  return { code, name, slug, cityCode };
}

// Tier 1 — đầy đủ quận/huyện cho 8 tỉnh có lượng tin BĐS lớn nhất
const HCM_DISTRICTS: District[] = [
  d('q1', 'Quận 1', 'quan-1', 'hcm'),
  d('q3', 'Quận 3', 'quan-3', 'hcm'),
  d('q4', 'Quận 4', 'quan-4', 'hcm'),
  d('q5', 'Quận 5', 'quan-5', 'hcm'),
  d('q6', 'Quận 6', 'quan-6', 'hcm'),
  d('q7', 'Quận 7', 'quan-7', 'hcm'),
  d('q8', 'Quận 8', 'quan-8', 'hcm'),
  d('q10', 'Quận 10', 'quan-10', 'hcm'),
  d('q11', 'Quận 11', 'quan-11', 'hcm'),
  d('q12', 'Quận 12', 'quan-12', 'hcm'),
  d('qbt', 'Quận Bình Thạnh', 'binh-thanh', 'hcm'),
  d('qbtan', 'Quận Bình Tân', 'binh-tan', 'hcm'),
  d('qgv', 'Quận Gò Vấp', 'go-vap', 'hcm'),
  d('qpn', 'Quận Phú Nhuận', 'phu-nhuan', 'hcm'),
  d('qtb', 'Quận Tân Bình', 'tan-binh', 'hcm'),
  d('qtp', 'Quận Tân Phú', 'tan-phu', 'hcm'),
  d('qtd', 'TP. Thủ Đức', 'thu-duc', 'hcm'),
  d('hbc', 'Huyện Bình Chánh', 'binh-chanh', 'hcm'),
  d('hcg', 'Huyện Củ Chi', 'cu-chi', 'hcm'),
  d('hhm', 'Huyện Hóc Môn', 'hoc-mon', 'hcm'),
  d('hnb', 'Huyện Nhà Bè', 'nha-be', 'hcm'),
  d('hcgio', 'Huyện Cần Giờ', 'can-gio', 'hcm'),
];

const HN_DISTRICTS: District[] = [
  d('hk', 'Quận Hoàn Kiếm', 'hoan-kiem', 'hn'),
  d('bd', 'Quận Ba Đình', 'ba-dinh', 'hn'),
  d('dd', 'Quận Đống Đa', 'dong-da', 'hn'),
  d('ht', 'Quận Hai Bà Trưng', 'hai-ba-trung', 'hn'),
  d('th', 'Quận Tây Hồ', 'tay-ho', 'hn'),
  d('cg', 'Quận Cầu Giấy', 'cau-giay', 'hn'),
  d('tx', 'Quận Thanh Xuân', 'thanh-xuan', 'hn'),
  d('hm', 'Quận Hoàng Mai', 'hoang-mai', 'hn'),
  d('lb', 'Quận Long Biên', 'long-bien', 'hn'),
  d('nb', 'Quận Nam Từ Liêm', 'nam-tu-liem', 'hn'),
  d('btl', 'Quận Bắc Từ Liêm', 'bac-tu-liem', 'hn'),
  d('hd', 'Quận Hà Đông', 'ha-dong', 'hn'),
  d('st', 'Thị xã Sơn Tây', 'son-tay', 'hn'),
  d('bv', 'Huyện Ba Vì', 'ba-vi', 'hn'),
  d('cm', 'Huyện Chương Mỹ', 'chuong-my', 'hn'),
  d('dp', 'Huyện Đan Phượng', 'dan-phuong', 'hn'),
  d('da', 'Huyện Đông Anh', 'dong-anh', 'hn'),
  d('gl', 'Huyện Gia Lâm', 'gia-lam', 'hn'),
  d('hoa', 'Huyện Hoài Đức', 'hoai-duc', 'hn'),
  d('me', 'Huyện Mê Linh', 'me-linh', 'hn'),
  d('my', 'Huyện Mỹ Đức', 'my-duc', 'hn'),
  d('pt', 'Huyện Phú Xuyên', 'phu-xuyen', 'hn'),
  d('pho', 'Huyện Phúc Thọ', 'phuc-tho', 'hn'),
  d('qo', 'Huyện Quốc Oai', 'quoc-oai', 'hn'),
  d('soc', 'Huyện Sóc Sơn', 'soc-son', 'hn'),
  d('to', 'Huyện Thạch Thất', 'thach-that', 'hn'),
  d('tt', 'Huyện Thanh Trì', 'thanh-tri', 'hn'),
  d('tu', 'Huyện Thanh Oai', 'thanh-oai', 'hn'),
  d('th-ng', 'Huyện Thường Tín', 'thuong-tin', 'hn'),
  d('ung', 'Huyện Ứng Hoà', 'ung-hoa', 'hn'),
];

const DANANG_DISTRICTS: District[] = [
  d('hcao', 'Quận Hải Châu', 'hai-chau', 'dnang'),
  d('tk', 'Quận Thanh Khê', 'thanh-khe', 'dnang'),
  d('st', 'Quận Sơn Trà', 'son-tra', 'dnang'),
  d('nhs', 'Quận Ngũ Hành Sơn', 'ngu-hanh-son', 'dnang'),
  d('lc', 'Quận Liên Chiểu', 'lien-chieu', 'dnang'),
  d('cl', 'Quận Cẩm Lệ', 'cam-le', 'dnang'),
  d('hv', 'Huyện Hoà Vang', 'hoa-vang', 'dnang'),
  d('hs', 'Huyện Hoàng Sa', 'hoang-sa', 'dnang'),
];

const HAIPHONG_DISTRICTS: District[] = [
  d('hb', 'Quận Hồng Bàng', 'hong-bang', 'hp'),
  d('lc', 'Quận Lê Chân', 'le-chan', 'hp'),
  d('nq', 'Quận Ngô Quyền', 'ngo-quyen', 'hp'),
  d('hai', 'Quận Hải An', 'hai-an', 'hp'),
  d('ka', 'Quận Kiến An', 'kien-an', 'hp'),
  d('do', 'Quận Đồ Sơn', 'do-son', 'hp'),
  d('dk', 'Quận Dương Kinh', 'duong-kinh', 'hp'),
  d('thuy', 'Huyện Thuỷ Nguyên', 'thuy-nguyen', 'hp'),
  d('an', 'Huyện An Dương', 'an-duong', 'hp'),
  d('al', 'Huyện An Lão', 'an-lao', 'hp'),
  d('kt', 'Huyện Kiến Thuỵ', 'kien-thuy', 'hp'),
  d('tl', 'Huyện Tiên Lãng', 'tien-lang', 'hp'),
  d('vb', 'Huyện Vĩnh Bảo', 'vinh-bao', 'hp'),
  d('ct', 'Huyện Cát Hải', 'cat-hai', 'hp'),
  d('bl', 'Huyện Bạch Long Vĩ', 'bach-long-vi', 'hp'),
];

const CANTHO_DISTRICTS: District[] = [
  d('nk', 'Quận Ninh Kiều', 'ninh-kieu', 'ct'),
  d('bt', 'Quận Bình Thuỷ', 'binh-thuy', 'ct'),
  d('cr', 'Quận Cái Răng', 'cai-rang', 'ct'),
  d('ot', 'Quận Ô Môn', 'o-mon', 'ct'),
  d('tn', 'Quận Thốt Nốt', 'thot-not', 'ct'),
  d('pd', 'Huyện Phong Điền', 'phong-dien', 'ct'),
  d('tl', 'Huyện Thới Lai', 'thoi-lai', 'ct'),
  d('cd', 'Huyện Cờ Đỏ', 'co-do', 'ct'),
  d('vt', 'Huyện Vĩnh Thạnh', 'vinh-thanh', 'ct'),
];

const BD_DISTRICTS: District[] = [
  d('tdm', 'TP. Thủ Dầu Một', 'thu-dau-mot', 'bd'),
  d('thn', 'TP. Thuận An', 'thuan-an', 'bd'),
  d('dia', 'TP. Dĩ An', 'di-an', 'bd'),
  d('tu', 'Thị xã Tân Uyên', 'tan-uyen', 'bd'),
  d('bc', 'Thị xã Bến Cát', 'ben-cat', 'bd'),
  d('bb', 'Huyện Bàu Bàng', 'bau-bang', 'bd'),
  d('btan', 'Huyện Bắc Tân Uyên', 'bac-tan-uyen', 'bd'),
  d('da', 'Huyện Dầu Tiếng', 'dau-tieng', 'bd'),
  d('ph', 'Huyện Phú Giáo', 'phu-giao', 'bd'),
];

const DN_DISTRICTS: District[] = [
  d('bh', 'TP. Biên Hoà', 'bien-hoa', 'dn'),
  d('lk', 'TP. Long Khánh', 'long-khanh', 'dn'),
  d('lt', 'Huyện Long Thành', 'long-thanh', 'dn'),
  d('nt', 'Huyện Nhơn Trạch', 'nhon-trach', 'dn'),
  d('tp', 'Huyện Trảng Bom', 'trang-bom', 'dn'),
  d('vc', 'Huyện Vĩnh Cửu', 'vinh-cuu', 'dn'),
  d('xl', 'Huyện Xuân Lộc', 'xuan-loc', 'dn'),
  d('th-d', 'Huyện Thống Nhất', 'thong-nhat', 'dn'),
  d('cm', 'Huyện Cẩm Mỹ', 'cam-my', 'dn'),
  d('dq', 'Huyện Định Quán', 'dinh-quan', 'dn'),
  d('tan', 'Huyện Tân Phú', 'tan-phu', 'dn'),
];

const BRVT_DISTRICTS: District[] = [
  d('vt', 'TP. Vũng Tàu', 'vung-tau', 'brvt'),
  d('br', 'TP. Bà Rịa', 'ba-ria', 'brvt'),
  d('pm', 'Thị xã Phú Mỹ', 'phu-my', 'brvt'),
  d('cd', 'Huyện Châu Đức', 'chau-duc', 'brvt'),
  d('xm', 'Huyện Xuyên Mộc', 'xuyen-moc', 'brvt'),
  d('ld', 'Huyện Long Điền', 'long-dien', 'brvt'),
  d('dat', 'Huyện Đất Đỏ', 'dat-do', 'brvt'),
  d('cdo', 'Huyện Côn Đảo', 'con-dao', 'brvt'),
];

// Tier 2 — danh sách tỉnh còn lại (districts để rỗng, chỉ lọc ở mức tỉnh)
const OTHER_PROVINCES: Array<{ code: string; name: string; slug: string }> = [
  { code: 'ag', name: 'An Giang', slug: 'an-giang' },
  { code: 'bl', name: 'Bạc Liêu', slug: 'bac-lieu' },
  { code: 'bk', name: 'Bắc Kạn', slug: 'bac-kan' },
  { code: 'bg', name: 'Bắc Giang', slug: 'bac-giang' },
  { code: 'bn', name: 'Bắc Ninh', slug: 'bac-ninh' },
  { code: 'btre', name: 'Bến Tre', slug: 'ben-tre' },
  { code: 'bdh', name: 'Bình Định', slug: 'binh-dinh' },
  { code: 'bp', name: 'Bình Phước', slug: 'binh-phuoc' },
  { code: 'bt', name: 'Bình Thuận', slug: 'binh-thuan' },
  { code: 'cm', name: 'Cà Mau', slug: 'ca-mau' },
  { code: 'cb', name: 'Cao Bằng', slug: 'cao-bang' },
  { code: 'dl', name: 'Đắk Lắk', slug: 'dak-lak' },
  { code: 'dnong', name: 'Đắk Nông', slug: 'dak-nong' },
  { code: 'db', name: 'Điện Biên', slug: 'dien-bien' },
  { code: 'dt', name: 'Đồng Tháp', slug: 'dong-thap' },
  { code: 'gl', name: 'Gia Lai', slug: 'gia-lai' },
  { code: 'hg', name: 'Hà Giang', slug: 'ha-giang' },
  { code: 'hnam', name: 'Hà Nam', slug: 'ha-nam' },
  { code: 'hat', name: 'Hà Tĩnh', slug: 'ha-tinh' },
  { code: 'hd', name: 'Hải Dương', slug: 'hai-duong' },
  { code: 'hau', name: 'Hậu Giang', slug: 'hau-giang' },
  { code: 'hb', name: 'Hoà Bình', slug: 'hoa-binh' },
  { code: 'hy', name: 'Hưng Yên', slug: 'hung-yen' },
  { code: 'kh', name: 'Khánh Hoà', slug: 'khanh-hoa' },
  { code: 'kg', name: 'Kiên Giang', slug: 'kien-giang' },
  { code: 'kt', name: 'Kon Tum', slug: 'kon-tum' },
  { code: 'lc', name: 'Lai Châu', slug: 'lai-chau' },
  { code: 'ldong', name: 'Lâm Đồng', slug: 'lam-dong' },
  { code: 'ls', name: 'Lạng Sơn', slug: 'lang-son' },
  { code: 'lcai', name: 'Lào Cai', slug: 'lao-cai' },
  { code: 'la', name: 'Long An', slug: 'long-an' },
  { code: 'nd', name: 'Nam Định', slug: 'nam-dinh' },
  { code: 'na', name: 'Nghệ An', slug: 'nghe-an' },
  { code: 'nb', name: 'Ninh Bình', slug: 'ninh-binh' },
  { code: 'nt', name: 'Ninh Thuận', slug: 'ninh-thuan' },
  { code: 'pt', name: 'Phú Thọ', slug: 'phu-tho' },
  { code: 'py', name: 'Phú Yên', slug: 'phu-yen' },
  { code: 'qb', name: 'Quảng Bình', slug: 'quang-binh' },
  { code: 'qnam', name: 'Quảng Nam', slug: 'quang-nam' },
  { code: 'qng', name: 'Quảng Ngãi', slug: 'quang-ngai' },
  { code: 'qninh', name: 'Quảng Ninh', slug: 'quang-ninh' },
  { code: 'qtri', name: 'Quảng Trị', slug: 'quang-tri' },
  { code: 'st', name: 'Sóc Trăng', slug: 'soc-trang' },
  { code: 'sl', name: 'Sơn La', slug: 'son-la' },
  { code: 'tn', name: 'Tây Ninh', slug: 'tay-ninh' },
  { code: 'th', name: 'Thái Bình', slug: 'thai-binh' },
  { code: 'tng', name: 'Thái Nguyên', slug: 'thai-nguyen' },
  { code: 'tho', name: 'Thanh Hoá', slug: 'thanh-hoa' },
  { code: 'tth', name: 'Thừa Thiên Huế', slug: 'thua-thien-hue' },
  { code: 'tg', name: 'Tiền Giang', slug: 'tien-giang' },
  { code: 'tv', name: 'Trà Vinh', slug: 'tra-vinh' },
  { code: 'tq', name: 'Tuyên Quang', slug: 'tuyen-quang' },
  { code: 'vl', name: 'Vĩnh Long', slug: 'vinh-long' },
  { code: 'vp', name: 'Vĩnh Phúc', slug: 'vinh-phuc' },
  { code: 'yb', name: 'Yên Bái', slug: 'yen-bai' },
];

export const cities: City[] = [
  { code: 'hcm', name: 'TP. Hồ Chí Minh', slug: 'tphcm', districts: HCM_DISTRICTS },
  { code: 'hn', name: 'Hà Nội', slug: 'ha-noi', districts: HN_DISTRICTS },
  { code: 'dnang', name: 'Đà Nẵng', slug: 'da-nang', districts: DANANG_DISTRICTS },
  { code: 'hp', name: 'Hải Phòng', slug: 'hai-phong', districts: HAIPHONG_DISTRICTS },
  { code: 'ct', name: 'Cần Thơ', slug: 'can-tho', districts: CANTHO_DISTRICTS },
  { code: 'bd', name: 'Bình Dương', slug: 'binh-duong', districts: BD_DISTRICTS },
  { code: 'dn', name: 'Đồng Nai', slug: 'dong-nai', districts: DN_DISTRICTS },
  { code: 'brvt', name: 'Bà Rịa - Vũng Tàu', slug: 'ba-ria-vung-tau', districts: BRVT_DISTRICTS },
  ...OTHER_PROVINCES.map((p) => ({ ...p, districts: [] as District[] })),
];

export const cityByCode = new Map(cities.map((c) => [c.code, c]));

const districtByKey = new Map(
  cities.flatMap((c) => c.districts.map((d2) => [`${c.code}:${d2.code}`, d2] as const))
);

export function getDistrict(cityCode: string, districtCode: string): District | undefined {
  return districtByKey.get(`${cityCode}:${districtCode}`);
}

export function formatLocation(cityCode: string, districtCode?: string, ward?: string): string {
  const city = cityByCode.get(cityCode);
  if (!city) return '';
  const district = districtCode ? getDistrict(cityCode, districtCode) : undefined;
  return [ward, district?.name, city.name].filter(Boolean).join(', ');
}
