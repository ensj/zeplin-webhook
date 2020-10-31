import {
  ZeplinWebhookBodyType,
  DiscordWebhookMessageType,
  ProjectDataType,
  StyleguideDataType,
  OrganizationMemberDataType,
  OrganizationSummaryDataType,
  Embed,
} from './types'

import { discordWebhookURL } from '../config'

function handleZeplinEvent(
  data: ZeplinWebhookBodyType,
): DiscordWebhookMessageType {
  const responseMessage: DiscordWebhookMessageType = {
    content: '',
    embeds: [],
    allowed_mentions: {
      parse: ['everyone'],
    },
  }

  const eventAction = `${data.event.replace('.', ' ')} ${data.action}`
  const resourceType = data.resource.type

  responseMessage.content = `A new Zeplin Event has been triggered!\nEvent: ${eventAction}\nResource: ${resourceType}`

  const zeplinEmbed: Embed = {
    author: {
      name: `${data.actor.user.emotar} ${data.actor.user.username}`,
      icon_url: data.actor.user.avatar,
    },
    title: '',
    description: '',
  }

  /* eslint-disable no-case-declarations */
  switch (resourceType) {
    case 'Project':
      const resourceProj = data.resource.data as ProjectDataType
      zeplinEmbed.title = resourceProj.name
      zeplinEmbed.description = resourceProj.description
        ? resourceProj.description
        : 'There is no description for this resource'
      if (resourceProj.scene_url) zeplinEmbed.url = resourceProj.scene_url
      if (resourceProj.thumbnail) {
        zeplinEmbed.image = { url: resourceProj.thumbnail! }!
      }
      zeplinEmbed.fields = [
        { name: 'status', value: resourceProj.status },
        { name: 'platform', value: resourceProj.platform },
      ]
      break
    case 'Styleguide':
      const resourceStyle = data.resource.data as StyleguideDataType
      zeplinEmbed.title = resourceStyle.name
      zeplinEmbed.description = resourceStyle.description
        ? resourceStyle.description
        : 'There is no description for this resource'
      if (resourceStyle.thumbnail) {
        zeplinEmbed.image = { url: resourceStyle.thumbnail! }!
      }
      zeplinEmbed.fields = [
        { name: 'status', value: resourceStyle.status },
        { name: 'platform', value: resourceStyle.platform },
      ]
      break
    case 'OrganizationSummary':
      const resourceOrgSum = data.resource.data as OrganizationSummaryDataType
      zeplinEmbed.title = `${resourceOrgSum.name}`
      if (resourceOrgSum.logo) {
        zeplinEmbed.thumbnail = { url: resourceOrgSum.logo! }!
      }
      break
    case 'OrganizationMember':
      const resourceOrgMem = data.resource.data as OrganizationMemberDataType
      zeplinEmbed.title = `${resourceOrgMem.user.emotar} ${resourceOrgMem.user.avatar}`
      zeplinEmbed.fields = [
        { name: 'role', value: resourceOrgMem.role },
        { name: 'tags', value: resourceOrgMem.tags.join(', ') },
      ]
      break
    default:
      break
  }
  /* eslint-enable no-case-declarations */

  responseMessage.embeds = [zeplinEmbed]

  return responseMessage
}

async function sendToDiscord(
  data: DiscordWebhookMessageType,
): Promise<Response> {
  const response = await fetch(discordWebhookURL, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })

  return response
}

export default async function handleZeplin(
  request: Request,
): Promise<Response> {
  const reqBody: ZeplinWebhookBodyType = await request.json()

  if (!reqBody) {
    // this is for zeplin's webhook verification.
    return new Response('Congrats! You failed.', { status: 200 })
  }

  const responseMessage: DiscordWebhookMessageType = handleZeplinEvent(reqBody)

  return sendToDiscord(responseMessage)
}
