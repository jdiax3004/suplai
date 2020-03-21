import { AvoidNullPipe } from './avoid-null.pipe';

describe('AvoidNullPipe', () => {
  it('create an instance', () => {
    const pipe = new AvoidNullPipe();
    expect(pipe).toBeTruthy();
  });
});
