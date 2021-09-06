// import { kmeans } from './kmeans';

// const image1x1 = { width: 1, height: 1, data: new Uint8ClampedArray([127, 127, 127, 255]) };

// describe('kmeans', () => {
//   test('regular image', () => {
//     const image = {
//       width: 128,
//       height: 127,
//       data: new Uint8ClampedArray(128 * 127 * 4),
//     };
//     for (let i = 0; i < image.width * image.height; i++) {
//       if (i < image.width * 64) {
//         image.data[i * 4] = 222;
//       } else if (i < image.width * 72) {
//         image.data[i * 4 + 1] = 200;
//       } else {
//         image.data[i * 4] = 128;
//         image.data[i * 4 + 1] = 127;
//         image.data[i * 4 + 2] = 31;
//       }
//     }
//     const clusters = kmeans(image, [], 4, 16);
//     expect(clusters).toEqual(expect.arrayContaining(
//       [{
//         count: 7040, x: 128, y: 127, z: 31,
//       }, {
//         count: 1024, x: 0, y: 200, z: 0,
//       }, {
//         count: 8192, x: 222, y: 0, z: 0,
//       }],
//     ));
//   });
//   test('1x1 image', () => {
//     const result = kmeans(image1x1, 4, 4);
//     const zeros = result.filter((c) => c.count === 0);
//     const nonZero = result.filter((c) => c.count > 0);
//     expect(zeros).toHaveLength(3);
//     expect(nonZero).toEqual([{
//       count: 1,
//       x: 127,
//       y: 127,
//       z: 127,
//     }]);
//   });
//   test('k < 1', () => {
//     expect(() => kmeans(image1x1, 0, 16)).toThrow('k must be greater than 0');
//   });
// });
