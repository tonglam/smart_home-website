import { PopulateForm } from "./populate-form";

export default function PopulateMockDataPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-start min-h-screen">
      {/* Render the client component form */}
      <PopulateForm />
    </div>
  );
}
