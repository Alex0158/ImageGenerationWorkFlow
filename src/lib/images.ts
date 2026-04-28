import type { Work } from '@/data/works';

const availableSizes = (width: number) =>
  [...new Set([480, 720, width].filter((size) => size <= width))].sort((a, b) => a - b);

export const sourceSet = (work: Work, type: 'avif' | 'webp') =>
  availableSizes(work.width)
    .map((size) => `/assets/works/${work.slug}-${size}.${type} ${size}w`)
    .join(', ');

export const imageSrc = (work: Work) => `/assets/works/${work.slug}-720.webp`;
