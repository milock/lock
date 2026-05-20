export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      msg: 'ok',
      app: 'lock',
      version: '1.0.0',
    }),
    {
      status: 200,
    }
  )
}