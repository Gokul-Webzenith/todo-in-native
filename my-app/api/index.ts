export default async function handler(req: any, res: any) {
  const { default: app } = await import("../packages/server/dist/index.js");
  return app(req, res);
}