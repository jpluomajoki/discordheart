import 'dotenv/config';
import { type APIApplicationCommand } from 'discord-api-types/v10'

export async function DiscordRequest(endpoint: string, options: RequestInit | { body: any }) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/jpluomajoki/discordheart, 0.1.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function getCommands() {
  const appId = process.env.APP_ID;

  const globalEndpoint = `applications/${appId}/commands`;

  try {
    const res = await DiscordRequest(globalEndpoint, {
      method: 'GET',
    });
    console.log(await res.json());
  } catch (err) {
    console.error('Error installing commands: ', err);
  }
}

type LooseAPIApplicationCommand = Omit<APIApplicationCommand, 'id' | 'application_id' | 'default_member_permissions' | 'version'>;

export async function InstallGlobalCommands(appId: string, commands: LooseAPIApplicationCommand[]) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

