import { InviteList } from "./invite-list";

export default async function Notifications() {
  return (
    <>
      <h1 className="self-start text-5xl font-bold mb-8">Notifications</h1>

      <section className="bg-secondary min-h-96">
        <InviteList />
      </section>
    </>
  );
}
