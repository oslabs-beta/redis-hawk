module.exports = async () => {
  for (const server of global.servers) {
    await server.close();
  }
}