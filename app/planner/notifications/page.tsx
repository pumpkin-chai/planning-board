import { InviteList } from "./invite-list";

export default async function Notifications() {
  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Notifications</h1>

      <section className="p-4 bg-secondary min-h-96">
        <InviteList />
      </section>
    </div>
  );
}
