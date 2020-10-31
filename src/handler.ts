import handleZeplin from './zeplin'
import { zeplinKey } from './config'

export default async function handleRequest(
  request: Request,
): Promise<Response> {
  if (request.method === 'POST') {
    try {
      if (request.headers.get('Zeplin-Signature') === zeplinKey) {
        return await handleZeplin(request)
      }
      return new Response('This is not a valid Zeplin Request!', {
        status: 500,
      })
    } catch (e) {
      return new Response(`Error! ${e}`, { status: 500 })
    }
  }

  return new Response('Expected POST', { status: 500 })
}
