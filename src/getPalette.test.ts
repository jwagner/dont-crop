import { getPalette } from './getPalette';
import { getTestImageData } from './test-helpers';

describe('getPalette', () => {
  test('matches snapshot', async () => {
    const imageData = await getTestImageData();
    const actual = getPalette(imageData, 5);
    expect(actual).toMatchSnapshot();
  });
});
