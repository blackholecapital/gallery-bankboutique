import { useAppStore } from '@/app/providers/StoreProvider';
import { Avatar } from '@/components/primitives/Avatar';
import { userInitials } from '@/entities/user/userView';

export function AppHeader() {
  const { currentUser } = useAppStore();

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center px-3">
      <h1 className="text-[18px] font-black tracking-[-0.03em] text-blue-600 drop-shadow-[0_1px_3px_rgba(37,99,235,0.30)]" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif', fontStyle: 'italic' }}>Gallery</h1>
      <div className="absolute right-3 flex items-center">
        {currentUser ? (
          <Avatar initials={userInitials(currentUser)} />
        ) : (
          <div className="h-7 w-7" />
        )}
      </div>
    </header>
  );
}
