import { notFound } from "next/navigation";
import { fetchPresentationById } from "@/lib/actions/presentations";
import { unwrap } from "@/lib/actions/action-result";
import { PresentationForm } from "../../PresentationForm";

export default async function EditPresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presentation = await unwrap(fetchPresentationById(id));

  if (!presentation) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Presentation</h1>
      <PresentationForm presentation={presentation} />
    </div>
  );
}
