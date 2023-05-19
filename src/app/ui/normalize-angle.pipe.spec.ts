import { NormalizeAnglePipe } from './normalize-angle.pipe';

describe('HumanAnglePipe', () => {
  it('create an instance', () => {
    const pipe = new NormalizeAnglePipe();
    expect(pipe).toBeTruthy();
  });

  it('should normalize the angle in the range +/- 180 degrees', () => {
    const pipe = new NormalizeAnglePipe();

    expect(pipe.transform(181)).toBe(-179);
    expect(pipe.transform(-181)).toBe(179);

    expect(pipe.transform(450)).toBe(90);
    expect(pipe.transform(-450)).toBe(-90);
  });
});
