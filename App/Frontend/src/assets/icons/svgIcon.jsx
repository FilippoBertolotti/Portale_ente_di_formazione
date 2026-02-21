const SvgIcon = ({ width = 48, height = 48, color = '#000000', path1, path2 }) => {
  
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
          fill={color}
        />
        {path2 && (
          <path
            d={path2}
            fill={color}
          />
        )}
        </g>
      </svg>
  );
};

export default SvgIcon;