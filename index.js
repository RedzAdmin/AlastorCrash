/**
 * ALASTOR Crash - WhatsApp Bot
 * Copyright (c) 2024 CODEBREAKER
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 */
require('./system/config.js')
const fs = require('fs-extra')
const chalk = require('chalk')
// Import your whatsapp.js correctly
const rikzHandler = require('./system/whatsapp.js')
const PhoneNumber = require('awesome-phonenumber')
const { smsg } = require('./system/lib/myfunction.js')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")

// Import premium functions
const { expiredCheck } = require('./system/lib/premium.js')

// Load premium data
let premium = [];
try {
    premium = JSON.parse(fs.readFileSync("./system/database/premium.json", "utf8"));
    if (!Array.isArray(premium)) {
        console.error("⚠️ premium.json is not an array, resetting to empty array");
        premium = [];
        fs.writeFileSync("./system/database/premium.json", JSON.stringify(premium, null, 2));
    }
} catch (err) {
    console.error("⚠️ Failed to read premium.json, using empty array.");
    premium = [];
    fs.writeFileSync("./system/database/premium.json", JSON.stringify(premium, null, 2));
}

// Create simple store
const store = {
    messages: {},
    contacts: {},
    chats: {},
    
    loadMessage: async (jid, id) => {
        return store.messages[`${jid}:${id}`] || null
    },
    
    saveMessage: (jid, id, message) => {
        store.messages[`${jid}:${id}`] = { message }
    },
    
    bind: (ev) => {
        ev.on('messages.upsert', (data) => {
            data.messages.forEach(m => {
                if (m.key) {
                    store.saveMessage(m.key.remoteJid, m.key.id, m)
                }
            })
        })
        
        ev.on('contacts.update', (updates) => {
            updates.forEach(update => {
                if (update.id) {
                    store.contacts[update.id] = { ...store.contacts[update.id], ...update }
                }
            })
        })
    }
}

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log(chalk.blue('🧹 Garbage collection completed'))
    }
}, 60000)

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log(chalk.red('⚠️ RAM too high (>400MB), restarting bot...'))
        process.exit(1)
    }
}, 30000)

// Auto-join function
async function autoJoinCommunity(sock) {
    try {
        const autojoinPath = './system/database/autojoin.json';
        
        if (!fs.existsSync(autojoinPath)) {
            const defaultConfig = {
                enabled: true,
                channel: "120363404912601381@newsletter",
                welcomeMessage: "╭━━━━━━━━━━━━━━━━━━┈⊷\n┃✮│➣ *THANKS FOR USING ALASTOR CRASH*\n╰━━━━━━━━━━━━━━━━━━┈⊷\n\n✅ *Thanks for joining our community!*\n\n📢 *Channel:* DARK EMPIRE TECH\n👥 *Support:* Contact owner\n\nUse .menu for commands menu!"
            };
            fs.writeFileSync(autojoinPath, JSON.stringify(defaultConfig, null, 2));
        }
        
        const config = JSON.parse(fs.readFileSync(autojoinPath, 'utf8'));
        if (!config.enabled) return;
        
        console.log(chalk.cyan('🤖 Auto-join feature enabled...'));
        
        try {
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            await sock.sendMessage(botNumber, {
                text: config.welcomeMessage || "╭━━━━━━━━━━━━━━━━━━┈⊷\n┃✮│➣ *🤖 WELCOME TO ALASTOR CRASH*\n╰━━━━━━━━━━━━━━━━━━┈⊷\n\nBot connected successfully!\nUse .menu for commands.",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: config.channel || '120363404912601381@newsletter',
                        newsletterName: 'DARK EMPIRE TECH',
                        serverMessageId: -1
                    }
                }
            });
            console.log(chalk.green('✅ Auto-join welcome message sent'));
        } catch (error) {
            console.log(chalk.yellow('⚠️ Could not send welcome message'));
        }
        
    } catch (error) {
        console.error('Auto-join error:', error);
    }
}

async function startAlastorBot() {
    try {
        let { version, isLatest } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        // Create readline interface for pairing code input
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        const question = (text) => new Promise((resolve) => rl.question(text, resolve))

        // Check if we need to use mobile
        const useMobile = process.argv.includes("--mobile")

        // Always use pairing code (NO QR CODE)
        const pairingCode = true

        const AlastorBot = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false, // NO QR code display - pairing only
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        // Save credentials when they update
        AlastorBot.ev.on('creds.update', saveCreds)

        // Bind store to events
        store.bind(AlastorBot.ev)

        // Handle pairing code (EXACTLY like the old bot)
        if (pairingCode && !AlastorBot.authState.creds.registered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api')

            let phoneNumberInput
            if (!!global.owner && global.owner.length > 0) {
                phoneNumberInput = global.owner[0]
            } else {
                phoneNumberInput = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 2347030626048 (without + or spaces) : `)))
            }

            // Clean the phone number - remove any non-digit characters
            phoneNumberInput = phoneNumberInput.replace(/[^0-9]/g, '')

            // Validate the phone number using awesome-phonenumber
            const pn = require('awesome-phonenumber');
            if (!pn('+' + phoneNumberInput).isValid()) {
                console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 15551234567 for US, 447911123456 for UK, etc.) without + or spaces.'));
                process.exit(1);
            }

            setTimeout(async () => {
                try {
                    let code = await AlastorBot.requestPairingCode(phoneNumberInput)
                    code = code?.match(/.{1,4}/g)?.join("-") || code
                    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                    console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
                    
                    // Close readline after displaying code
                    rl.close()
                } catch (error) {
                    console.error('Error requesting pairing code:', error)
                    console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
                    rl.close()
                }
            }, 3000)
        }

        // Message handling - FIXED: Call rikzHandler directly
        AlastorBot.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                
                // Handle ephemeral messages
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') 
                    ? mek.message.ephemeralMessage.message 
                    : mek.message
                
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    // Handle status if needed
                    return;
                }
                
                // Check if bot is in private mode
                if (!global.public && !mek.key.fromMe && chatUpdate.type === 'notify') {
                    const isGroup = mek.key?.remoteJid?.endsWith('@g.us')
                    if (!isGroup) return // Block DMs in private mode
                }
                
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

                // Clear message retry cache
                if (AlastorBot?.msgRetryCounterCache) {
                    AlastorBot.msgRetryCounterCache.clear()
                }

                try {
                    // FIXED: Call rikzHandler directly (since it's a function, not an object)
                    // Process the message through your whatsapp.js handler
                    const m = chatUpdate.messages[0]
                    if (m.message) {
                        const mek = m
                        // Add serializeM function if not exists
                        if (!AlastorBot.serializeM) {
                            AlastorBot.serializeM = (m) => smsg(AlastorBot, m, store)
                        }
                        
                        // Serialize the message
                        const serializedMsg = AlastorBot.serializeM(mek)
                        
                        // Call your rikz handler with the correct parameters
                        await rikzHandler(AlastorBot, serializedMsg, chatUpdate, store)
                    }
                } catch (err) {
                    console.error("Error in handleMessages:", err)
                    if (mek.key && mek.key.remoteJid) {
                        await AlastorBot.sendMessage(mek.key.remoteJid, {
                            text: '❌ An error occurred while processing your message.'
                        }).catch(console.error);
                    }
                }
            } catch (err) {
                console.error("Error in messages.upsert:", err)
            }
        })

        // Add utility functions
        AlastorBot.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        AlastorBot.getName = (jid, withoutContact = false) => {
            id = AlastorBot.decodeJid(jid)
            withoutContact = AlastorBot.withoutContact || withoutContact
            let v
            
            if (id.endsWith("@g.us")) {
                return new Promise(async (resolve) => {
                    v = store.contacts[id] || {}
                    resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
                })
            } else {
                v = id === '0@s.whatsapp.net' ? {
                    id,
                    name: 'WhatsApp'
                } : id === AlastorBot.decodeJid(AlastorBot.user.id) ?
                    AlastorBot.user :
                    (store.contacts[id] || {})
                return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            }
        }

        AlastorBot.public = global.public
        AlastorBot.serializeM = (m) => smsg(AlastorBot, m, store)

        // Connection handling
        AlastorBot.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect } = s
            
            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp with pairing code...'))
            }
            
            if (connection == "open") {
                console.log(chalk.magenta(` `))
                console.log(chalk.yellow(`🌿 Connected to => ` + JSON.stringify(AlastorBot.user, null, 2)))

                // AUTO-JOIN COMMUNITY FEATURE
                await autoJoinCommunity(AlastorBot);

                // Start premium expiration check WITH PREMIUM PARAMETER
                expiredCheck(AlastorBot, premium)

                // Send connection message
                try {
                    const botNumber = AlastorBot.user.id.split(':')[0] + '@s.whatsapp.net';
                    await AlastorBot.sendMessage(botNumber, {
                        text: `╭━━━━━━━━━━━━━━━━━━┈⊷\n┃✮│➣ *🤖 ${global.botName || 'ALASTOR CRASH'} CONNECTED*\n╰━━━━━━━━━━━━━━━━━━┈⊷\n\n┃✮│➣ *Connected Successfully!*\n\n⏰ *Time:* ${new Date().toLocaleString()}\n┃✮│➣ *Status:* Online and Ready!\n\n*Use .menu for commands*`
                    });
                } catch (error) {
                    console.error('Error sending connection message:', error.message)
                }

                await delay(1999)
                console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botName || 'ALASTOR CRASH'} ]`)}\n\n`))
                console.log(chalk.cyan(`< ================================================== >`))
                console.log(chalk.magenta(`\n• YT CHANNEL: Hacking Unveiled`))
                console.log(chalk.magenta(`• GITHUB: CODEBREAKER`))
                console.log(chalk.magenta(`• WA NUMBER: ${global.owner?.[0] || '2347030626048'}`))
                console.log(chalk.green(`• 🤖 Bot Connected Successfully! ✅`))
                console.log(chalk.blue(`Auto-join: Enabled`))
                console.log(chalk.blue(`Login Method: Pairing Code`))
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                const statusCode = lastDisconnect?.error?.output?.statusCode
                
                console.log(chalk.red(`Connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}`))
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        fs.removeSync('./session')
                        console.log(chalk.yellow('Session folder deleted. Please re-authenticate.'))
                    } catch (error) {
                        console.error('Error deleting session:', error)
                    }
                    console.log(chalk.red('Session logged out. Please re-authenticate.'))
                }
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('Reconnecting...'))
                    await delay(5000)
                    startAlastorBot()
                }
            }
        })

        // Handle group participants update
        AlastorBot.ev.on('group-participants.update', async (update) => {
            // You can add group update handling here
            console.log('Group update:', update)
        })

        // Anti-call handler
        AlastorBot.ev.on('call', async (calls) => {
            try {
                for (const call of calls) {
                    const callerJid = call.from || call.peerJid || call.chatId;
                    if (!callerJid) continue;
                    
                    console.log(chalk.yellow(`📞 Incoming call from: ${callerJid}`))
                }
            } catch (e) {
                // ignore
            }
        });

        return AlastorBot
    } catch (error) {
        console.error('Error in startAlastorBot:', error)
        await delay(5000)
        startAlastorBot()
    }
}

// Start the bot with error handling
startAlastorBot().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})