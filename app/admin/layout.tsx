export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-zinc-950 min-h-screen">
      {children}
    </div>
  );
}