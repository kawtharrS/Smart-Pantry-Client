const steps = [
  "Add your Pantry items",
  "Track expiry dates",
  "Get smart suggestions",
  "Auto-generate meals",
  "Manage weekly shopping",
  "Reduce waste",
];

const Guide = () => (
  <section className="flex flex-col items-center py-16">
    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Your Guide</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="text-white font-bold text-lg text-center p-6 rounded-xl backdrop-blur-sm shadow-md  bg-amber-400"
        >
          <span className="text-2xl font-extrabold">{idx + 1}.</span> {step}
        </div>
      ))}
    </div>
  </section>
);

export default Guide;
