export const matrixPosition = `
createMatrixFromPerspective(fieldOfViewInRadians, aspectRatio, near, far) {
  const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
  const rangeInv = 1 / (near - far);

  return [
    f / aspectRatio, 0,   0,                          0,
    0,               f,   0,                          0,
    0,               0,   (near + far) * rangeInv,    -1,
    0,               0,   near * far * rangeInv * 2,   0
  ];
}

createMatrix() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}
`;
