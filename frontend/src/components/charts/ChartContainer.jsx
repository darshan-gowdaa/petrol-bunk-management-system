// frontend/src/components/ChartContainer.jsx - Chart container component

const ChartContainer = ({ title, children }) => {
  return (
    <div className="rounded-lg border border-gray-800/40 bg-gray-800/10 p-4 shadow-sm backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-200">{title}</h3>
      <div className="aspect-[16/9] w-full sm:aspect-[21/9] md:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[16/7] min-h-[250px]">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
