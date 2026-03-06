const SvgIcon = ({ 
  width = 48, 
  height = 48, 
  color = '#EF7E13', 
  color2, 
  path1, 
  path2, 
  strokeWidth = 0, 
  viewBox = "0 0 32 32", 
  translate = false, 
  className
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ''}
    >
      <g transform={translate ? "translate(0, 4)" : ""}>
        <path
          d={path1}
          fill={strokeWidth > 0 ? "none" : color}  // Se strokeWidth > 0, fill none
          stroke={strokeWidth > 0 ? color : "none"} // Se strokeWidth > 0, applica stroke
          strokeWidth={strokeWidth}
        />
        {path2 && (
          <path
            d={path2}
            fill={strokeWidth > 0 ? "none" : color2 || color}
            stroke={strokeWidth > 0 ? color2 || color : "none"}
            strokeWidth={strokeWidth}
          />
        )}
      </g>
    </svg>
  );
};

export default SvgIcon;