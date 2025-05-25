import Image from 'next/image';

export function Header() {
  return (
    <div className="mb-12 text-center">
      <div className="flex flex-col items-center">
        <Image
          src="/logo.svg"
          alt="NotTheBees Logo"
          width={500}
          height={500}
          className="w-[400px] h-[400px] -mt-[100px] -mb-[70px]"
          priority
        />
        <p className="text-lg text-[var(--text-secondary)] font-mono">They&apos;re in my eyes! Also, here&apos;s your SRT file.</p>
      </div>
    </div>
  );
} 