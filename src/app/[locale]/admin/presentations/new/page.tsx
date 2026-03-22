import { PresentationForm } from "../PresentationForm";

export default function NewPresentationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Add Presentation</h1>
      <PresentationForm />
    </div>
  );
}
