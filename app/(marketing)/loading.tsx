import { Spinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="container-app grid min-h-[40vh] place-items-center py-12">
      <Spinner size={32} />
    </div>
  );
}
