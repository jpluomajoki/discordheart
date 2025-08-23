import 'dotenv/config';
import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

export const ActionRollOptions = {
  Modifier: 'modifier',
  Advantage: 'advantage',
  Disadvantage: 'disadvantage',
} as const

export const ActionRollCommand = {
  name: "action",
  description: 'Roll an action roll!',
  options: [
    {
      type: ApplicationCommandOptionType.Integer as number,
      name: ActionRollOptions.Modifier as string,
      description: 'Modifier for the roll',
      required: false,
    },
    {
      type: ApplicationCommandOptionType.String as number,
      name: ActionRollOptions.Advantage as string,
      description: 'Does the roll have advantage or disadvantage?',
      required: false,
      choices: [
        {
          name: "Advantage",
          value: ActionRollOptions.Advantage,
        },
        {
          name: "Disadvantage",
          value: ActionRollOptions.Disadvantage,
        }
      ]
    },
  ],
  type: ApplicationCommandType.ChatInput,
  integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
  contexts: [InteractionContextType.Guild, InteractionContextType.PrivateChannel],
};

export const AllCommands = [ActionRollCommand]
