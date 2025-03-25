const SvgIcon = ({ className, name, onClick }) => {
  const renderIcon = () => {
    switch (name) {
      case 'arrow-left':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Swap me">
          <path id="Vector" d="M17.5017 9.16274C17.7349 9.16274 17.9348 9.24603 18.0931 9.40428C18.2513 9.56254 18.3346 9.76244 18.3346 9.99565C18.3346 10.2289 18.2513 10.4288 18.0931 10.587C17.9348 10.7453 17.7349 10.8286 17.5017 10.8286H4.49989L8.08976 14.4184C8.25634 14.585 8.33963 14.7766 8.3313 15.0015C8.3313 15.2264 8.24801 15.4179 8.08976 15.5845C7.92317 15.7511 7.7316 15.8344 7.50672 15.8427C7.28183 15.8511 7.09026 15.7678 6.92367 15.6012L1.89286 10.5787C1.80956 10.4954 1.75126 10.4038 1.71794 10.3038C1.68463 10.2039 1.66797 10.1039 1.66797 9.99565C1.66797 9.88737 1.68463 9.77909 1.71794 9.68747C1.75126 9.59585 1.80956 9.50423 1.89286 9.42094L6.89869 4.40678C7.06527 4.2402 7.26517 4.15691 7.49839 4.15691C7.7316 4.15691 7.92317 4.2402 8.08976 4.40678C8.23968 4.57336 8.31465 4.77326 8.31465 4.99815C8.31465 5.22304 8.23968 5.41461 8.08143 5.57286L4.49989 9.16274H17.5017Z" fill="#141414"/>
          </g>
          </svg>

        );
      case 'search':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'close':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span className={className} onClick={onClick}>
      {renderIcon()}
    </span>
  );
};

export default SvgIcon;
