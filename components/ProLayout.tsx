import { ReactNode } from "react";
import { ProSidebar } from "@/components/ProSidebar";
import { ProTopbar } from "@/components/ProTopbar";

export const ProLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-graphite text-ivoire">
    <div className="flex min-h-screen">
      <ProSidebar />
      <div className="flex flex-1 flex-col">
        <ProTopbar />
        <main className="flex-1 px-6 py-10">{children}</main>
      </div>
    </div>
  </div>
);
