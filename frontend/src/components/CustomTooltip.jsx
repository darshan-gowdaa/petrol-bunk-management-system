const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3 border rounded-lg shadow-lg border-gray-800/40 bg-gray-800/80 backdrop-blur-sm">
      <p className="mb-2 font-medium text-gray-200">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm" style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;
