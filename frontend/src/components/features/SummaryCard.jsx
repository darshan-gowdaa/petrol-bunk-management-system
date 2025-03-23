const SummaryCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  onClick,
}) => {
  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend === "up" ? "text-green-500" : "text-red-500";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === "up" ? "↑" : "↓";
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-blue-50 p-2">
            <Icon className="h-6 w-6 text-blue-500" />
          </div>
        )}
      </div>

      {(trend || trendValue || trendLabel) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`flex items-center ${getTrendColor()}`}>
              {getTrendIcon()}
              {trendValue}
            </span>
          )}
          {trendLabel && (
            <span className="text-sm text-gray-500">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
