type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
};

export function Avatar({ src, alt = 'Avatar', initials = 'AC' }: AvatarProps) {
  if (src) {
    return <img alt={alt} className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200" src={src} />;
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600">
      {initials}
    </div>
  );
}
