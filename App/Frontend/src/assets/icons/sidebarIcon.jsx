const SidebarIcon = ({ width = 48, height = 48, color = '#000000', path1, path2 }) => {
  
  return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 30 30"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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
      </svg>
  );
};

export default SidebarIcon;