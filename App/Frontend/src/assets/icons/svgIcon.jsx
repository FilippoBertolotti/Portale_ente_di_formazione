const SvgIcon = ({ width = 48, height = 48, color = '#EF7E13', path1, path2, strokeWidth = 0 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 40"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0, 4)">
        <path
          d={path1}
          fill={strokeWidth > 0 ? "none" : color}  // Se strokeWidth > 0, fill none
          stroke={strokeWidth > 0 ? color : "none"} // Se strokeWidth > 0, applica stroke
          strokeWidth={strokeWidth}
        />
        {path2 && (
          <path
            d={path2}
            fill={strokeWidth > 0 ? "none" : color}
            stroke={strokeWidth > 0 ? color : "none"}
            strokeWidth={strokeWidth}
          />
        )}
      </g>
    </svg>
  );
};

export default SvgIcon;