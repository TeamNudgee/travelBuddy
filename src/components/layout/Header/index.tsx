export const Header = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <div>
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm z-50 sm:w-[384px]">
        {children}
      </header>
      <div className="h-[64px]"></div>
    </div>
  );
};
