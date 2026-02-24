export default async function handler(req: any, res: any) {
  const { default: handler } = await import(
    "../packages/server/dist/index.js"
  );

  return handler(req, res);
}