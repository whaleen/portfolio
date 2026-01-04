# orthobot

A discord bot that posts ESV bible passages when referenced in chat

NKJV with full Orthodox cannon coming soon...

## Usage

When you type a message of one of the following categories into a text server, orthobot will respond as appropriate

1. Specific Reference (e.g. Gen 1:1)

2. Whole Chapter (e.g. Gen 1)

3. Range of chapters (e.g. Gen 1-2)

4. Range of verses wihtin a chapter (e.g. Gen 1:1-3)

5. Range of verses crossing chapters (e.g. Gen 1:1-2:3)

You may also provide multiple references by delimiting them with a semicolon. (e.g. Gen 1-2; John 3:16)

## Instructions

**Step 1:** Download Node.js and create a Discord account.

- Node.js is required for running your bot. Download and install it from [nodejs.org](https://nodejs.org).
- Create a Discord account and server to test your bot.

**Step 2:** Create a Discord application for your bot.

- Go to [discordapp.com/developers/applications/me](https://discordapp.com/developers/applications/me) and log in.
- Click "New Application" and give your bot a name.
- In the right-hand menu, click "Bot" and then "Add Bot."
- Obtain the bot's authorization token by clicking "Click to Reveal" under "Token:"

**Step 3:** Protect your bot's token and get your Client ID.

- Keep the bot's authorization token secret as it controls your bot's actions.
- Copy your Client ID from the "App Details" section.

**Step 4:** Invite your bot to your server.

- Use your Client ID to create an invite URL: [https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8](https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8) (replacing CLIENTID in the URL with the Client ID obtained in Step 3.)

**Step 5** Replace YOUR_BOTS_AUTH_TOKEN in file in the root folder in the file called `auth.json` with the auth token you got in step 3 above.

```
{
    "token": "YOUR_BOTS_AUTH_TOKEN"
}
```

### Finally

```
npm install
```

And then run the server:

```
node bot.js
```

### Todo

- [ ] Multiple Translations Support
- [ ] Slash Commands
- [ ] Quotes (Fathers / Saints / Etc...)
- [ ] Glossary of terms
- [ ] ?
