import { Suspense } from "react";
import ConfirmationContent from "./ConfirmationContent";

export const metadata = {
  title: "Commande confirmée - Studio Kova",
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
