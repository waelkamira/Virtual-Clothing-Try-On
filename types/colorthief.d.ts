declare module 'colorthief' {
  export default class ColorThief {
    getColor(image: HTMLImageElement): [number, number, number];
    getPalette(
      image: HTMLImageElement,
      colorCount?: number,
      quality?: number,
    ): Array<[number, number, number]>;
  }
}
