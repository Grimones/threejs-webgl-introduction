export const drawCall = `
drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const pMatrix = this.createMatrixFromPerspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
  const mMatrix = this.createMatrix();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(shader_prog.positionLocation, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(shader_prog.u_PerspLocation, false, pMatrix);
  gl.uniformMatrix4fv(shader_prog.u_ModelViewLocation, false, mMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}
`;
