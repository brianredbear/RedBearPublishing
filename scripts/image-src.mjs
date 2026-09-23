export function stem(filename) {
  return filename.replace(/\.(jpg|jpeg|png)$/i, "");
}

export function webpSrc(filename, width) {
  return `/images/${stem(filename)}-${width}.webp`;
}
