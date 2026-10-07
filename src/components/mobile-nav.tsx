import { MobileNavClient } from "@/components/mobile-nav-client";
import { listStores, getStoreId } from "@/lib/store";

export default async function MobileNav() {
  const stores = await listStores();
  const storeId = await getStoreId();

  return (
    <MobileNavClient
      stores={stores.map((s) => ({ id: s.id, name: s.name }))}
      currentStoreId={storeId}
      pathname="/"
    />
  );
}