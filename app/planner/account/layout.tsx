export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="self-start text-5xl font-bold mb-8">Profile</h1>
      <section>{children}</section>
    </>
  );
}
