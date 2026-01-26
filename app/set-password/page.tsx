import { Suspense } from "react";
import SetPasswordClient from "./SetPasswordClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <SetPasswordClient />
    </Suspense>
  );
}
