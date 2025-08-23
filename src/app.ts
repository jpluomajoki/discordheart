import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { ActionRollCommand, ActionRollOptions } from './commands.js';
import type { ApplicationCommandOptionType } from 'discord-api-types/v10';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY!), async function (req, res) {
  // Interaction id, type and data
  const { type, data } = req.body;
  console.log("req:", req.body.data)

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    if (name === ActionRollCommand.name) {
      var modifier = 0;
      var advantage = false;
      var disadvantage = false;
      var advantageMod = 0
      var resultString = '';
      var advantageString = '';
      options.map((opt: { name: string, type: ApplicationCommandOptionType, value: any }) => {
        switch (opt.name) {
          case ActionRollOptions.Modifier:
            modifier = Number.parseInt(opt.value)
            break;
          case ActionRollOptions.Advantage:
            if (opt.value === ActionRollOptions.Advantage)
              advantage = true
            else {
              disadvantage = true
            }
            break;
        }
      })

      if (advantage && disadvantage) {
        advantage = false
        disadvantage = false
      }

      if (advantage) {
        advantageMod = Math.floor(Math.random() * 6) + 1;
        advantageString = ` with advantage (+${advantageMod})`
      }
      if (disadvantage) {
        advantageMod = -(Math.floor(Math.random() * 6) + 1);
        advantageString = ` with disadvantage (${advantageMod})`
      }

      const fear = Math.floor(Math.random() * 12) + 1;
      const hope = Math.floor(Math.random() * 12) + 1;
      const total = fear + hope + modifier + advantageMod;

      const modString = `(${modifier > 0 ? '+' : ''}${modifier} from modifier)`

      if (fear > hope) {
        resultString = `Rolled ${hope} and ${fear} ${modString}${advantageString} for a **total of ${total} with Fear!**`;
      } else if (hope > fear) {
        resultString = `Rolled ${hope} and ${fear} ${modString}${advantageString} for a **total of ${total} with Hope!**`;
      } else {
        resultString = `Rolled a **Crit** with two ${hope}'s${advantageString}!\nGain a hope, clear a stress and prepare to do something awesome!`;
      }
      console.log(`Hope: ${hope}\nFear: ${fear}\nadvantage: ${advantage}\ndisadvantage: ${disadvantage}\nadvantage mod: ${advantageMod}\nadvantage string: ${advantageString}\nresult string: ${resultString}`)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: resultString
            }
          ]
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
