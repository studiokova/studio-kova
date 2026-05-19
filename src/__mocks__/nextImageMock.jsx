const Image = ({ src, alt, width, height, ...props }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt || ''} width={width} height={height} {...props} />
);

export default Image;
