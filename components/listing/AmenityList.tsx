import { Check } from 'lucide-react';
import { AMENITIES } from '@/lib/constants';

export function AmenityList({ amenities }: { amenities: string[] }) {
  const map = new Map(AMENITIES.map((a) => [a.value, a.label]));
  if (!amenities.length) return null;
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {amenities.map((a) => (
        <li key={a} className="inline-flex items-center gap-2 text-sm text-ink">
          <Check size={16} className="text-price" />
          {map.get(a) ?? a}
        </li>
      ))}
    </ul>
  );
}
