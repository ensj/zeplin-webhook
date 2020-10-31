interface ZeplinWebhookBodyType {
  event: string
  action: string
  timestamp: number
  resource: {
    id: string
    type: string
    data: any
  }
  context: any
  actor: {
    user: {
      id: string
      email: string
      username: string
      emotar: string
      avatar: string
    }
  }
}

export async function handleRequest(request: Request): Promise<Response> {
  if(request.method === 'POST') {
    try {
      return await handleZeplin(request)
    } catch(e) {
      return new Response(`Error! ${e}`, { status: 500 })
    }
  }

  return new Response(`Expected POST`, { status: 500 })
}

function handleZeplinEvent(event: string, action: string) {
  return event.split('.').join(' ') + ' ' + action
}

async function handleZeplin(request: Request): Promise<Response> {
  const body = request.body as unknown as ZeplinWebhookBodyType
  const discordWebHookURL = 
    'https://discord.com/api/webhooks/771942550041788467/Q3ywCRAUZmyAPjq3d6Qf4EdGbwdJDABBKYVqnsHen2IeZMFEdeGusQ8MZBz47QqvW85u'

  const { event: eventString, action: eventAction, resource, context, actor } = body

  const event = handleZeplinEvent(eventString, eventAction)

  if(event) {
    const response = await fetch(discordWebHookURL, {
      body: JSON.stringify({
        content: "A new zeplin event has been posted.",
        embeds: [{
          author: {
            name: actor.user.emotar + ' ' + actor.user.username ,
          },
          title: event,
        }]
      }),
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })

    return response
  }

  return new Response('Invalid or untracked Zeplin event', { status: 200 })
}