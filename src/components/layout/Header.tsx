export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex relative py-100">
      {children}
    </header>
  );
}