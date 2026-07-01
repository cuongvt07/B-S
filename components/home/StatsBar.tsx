'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@/components/icons';
import { useSiteSettings } from '@/components/layout/SiteSettingsProvider';
import { listings } from '@/mocks/data/listings';
import { blogs } from '@/mocks/data/blogs';
import { cities } from '@/mocks/data/cities';

function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, start, target]);

  return value;
}

function StatItem({
  target,
  suffix = '',
  title,
  description,
  inView,
}: {
  target: number;
  suffix?: string;
  title: string;
  description: string;
  inView: boolean;
}) {
  const value = useCountUp(target, inView);

  return (
    <div className="stats-about__item">
      <strong>
        {value.toLocaleString('vi-VN')}
        {suffix}
      </strong>
      <span>{title}</span>
      <p>{description}</p>
    </div>
  );
}

export function StatsBar() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const { siteName } = useSiteSettings();
  const activeCount = listings.filter((listing) => listing.status === 'active').length;

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="stats-about">
      <div className="container-app">
        <div className="stats-about__layout">
          <div className="stats-about__image">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=88"
              alt="Biệt thự hiện đại dành cho cộng đồng bất động sản"
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
            />
          </div>

          <div className="stats-about__copy">
            <span>Về {siteName}</span>
            <h2 className="uppercase">Cộng đồng {siteName} tin tưởng</h2>
            <p>
              Nền tảng tin đăng minh bạch, xác thực — kết nối hàng nghìn chủ nhà và
              người mua thuê mỗi ngày.
            </p>
          </div>

          <div className="stats-about__panel">
            <div className="stats-about__metrics">
              <StatItem
                target={activeCount}
                suffix="+"
                title="Tin đăng xác thực"
                description="Thông tin rõ ràng, được cập nhật liên tục trên nền tảng."
                inView={inView}
              />
              <StatItem
                target={cities.length}
                suffix="+"
                title="Tỉnh thành phủ sóng"
                description="Kết nối nhu cầu mua, bán và cho thuê trên toàn quốc."
                inView={inView}
              />
              <StatItem
                target={50}
                suffix="K+"
                title="Người dùng tin tưởng"
                description="Cộng đồng người mua, người thuê và chủ nhà năng động."
                inView={inView}
              />
              <StatItem
                target={blogs.length}
                suffix="+"
                title="Bài viết chuyên môn"
                description="Kiến thức và phân tích thị trường được cập nhật hàng tuần."
                inView={inView}
              />
            </div>

            <div className="stats-about__footer">
              <div>
                <span className="stats-about__avatar">B</span>
                <em>Bắt đầu hành trình bất động sản của bạn.</em>
              </div>
              <Link href="/tin-dang" className="unstyled">
                Khám phá ngay <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
