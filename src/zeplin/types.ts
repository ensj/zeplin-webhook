/* eslint-disable camelcase */

export interface ZeplinUserType {
  id: string
  email: string
  username: string
  emotar: string
  avatar: string
}

export interface OrganizationSummaryDataType {
  id: string
  name: string
  logo?: string
}

export interface OrganizationMemberDataType {
  user: ZeplinUserType
  tags: string[]
  role: 'owner' | 'admin' | 'editor' | 'member'
  restricted: boolean
}

interface BaseZeplinProjectDataType {
  id: string
  name: string
  description?: string
  platform: 'web' | 'ios' | 'android' | 'macos'
  thumbnail?: string
  status: 'active' | 'archived'
  organization?: OrganizationSummaryDataType
  rem_preferences?: {
    status: 'enabled' | 'disabled' | 'linked'
    root_font_size: number
    use_for_font_sizes: boolean
    use_for_measurements: boolean
  }
  created: number
  updated?: number

  number_of_members: number
  number_of_components: number
  number_of_text_styles: number
  number_of_colors: number
  number_of_spacing_tokens: number
}

export interface StyleguideDataType extends BaseZeplinProjectDataType {
  parent?: {
    id: string
  }
}

export interface ProjectDataType extends BaseZeplinProjectDataType {
  scene_url?: string
  number_of_screens: number
  linked_styleguide?: {
    id: string
  }
}

export interface ZeplinWebhookBodyType {
  event: string
  action: string
  timestamp: number
  resource: {
    id: string
    type: string
    data:
      | ProjectDataType
      | StyleguideDataType
      | OrganizationSummaryDataType
      | OrganizationMemberDataType
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

export interface Embed {
  author?: {
    name: string
    url?: string
    icon_url?: string
  }
  title: string
  url?: string
  description: string
  fields?: Array<{ name: string; value: string; inline?: boolean }>
  thumbnail?: {
    url: string
  }
  image?: {
    url: string
  }
  footer?: {
    text: string
    icon_url?: string
  }
  timestamp?: string
}

export interface DiscordWebhookMessageType {
  username?: string
  avatar_url?: string
  content: string
  embeds?: Array<Embed>
  tts?: boolean
  allowed_mentions?: {
    parse: Array<'roles' | 'users' | 'everyone'>
    roles?: Array<string>
    users?: Array<string>
  }
}
