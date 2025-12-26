//========HELO FRIEND========//
const fs = require("fs-extra");
const toMs = require("ms");
//======================
let premium = [];
try {
    premium = JSON.parse(fs.readFileSync("./system/database/premium.json", "utf8"));
    if (!Array.isArray(premium)) throw new Error("premium.json file must be an array!");
} catch (err) {
    console.error("⚠️ Failed to read premium.json, using empty array.");
    premium = [];
}

const addPremiumUser = (userId, expired, _dir = premium) => {
    if (!Array.isArray(_dir)) {
        console.error("❌ ERROR: _dir is not an array!");
        return false;
    }
    console.log(`🔹 Adding user ${userId} with duration ${expired}`);
    const msTime = toMs(expired);
    if (!msTime) {
        console.error("❌ Invalid time format! Use '30d', '7d', '1h' etc.");
        return false;
    }
    const cekUser = _dir.find((user) => user.id === userId);
    if (cekUser) {
        cekUser.expired += msTime;
        console.log(`🔄 User already exists, expiry time updated to ${cekUser.expired}`);
    } else {
        const obj = { id: userId, expired: Date.now() + msTime };
        _dir.push(obj);
        console.log(`✅ New user added: ${JSON.stringify(obj)}`);
    }
    try {
        fs.writeFileSync("./system/database/premium.json", JSON.stringify(_dir, null, 2));
        console.log("📝 Premium database updated!");
    } catch (error) {
        console.error("❌ Failed to save premium.json:", error);
        return false;
    }
    return true;
};

const getPremiumPosition = (userId, _dir) => {
    return _dir.findIndex((user) => user.id === userId);
};

const getPremiumExpired = (userId, _dir) => {
    const user = _dir.find((u) => u.id === userId);
    return user ? user.expired : null;
};

const checkPremiumUser = (userId, _dir) => {
    return _dir.some((user) => user.id === userId);
};

const expiredCheck = (conn, _dir) => {
    setInterval(() => {
        _dir.forEach((user, index) => {
            if (Date.now() >= user.expired) {
                console.log(`🔥 Premium expired: ${user.id}`);
                _dir.splice(index, 1);
                fs.writeFileSync("./system/database/premium.json", JSON.stringify(_dir, null, 2));
                conn.sendMessage(user.id, { text: "Your premium has expired, please purchase again." });
            }
        });
    }, 1000);
};

//======================
const delPremiumUser = (userId, _dir = premium) => {
    if (!Array.isArray(_dir)) {
        console.error("❌ ERROR: _dir is not an array!");
        return false;
    }
    let index = _dir.findIndex(user => user.id === userId);
    if (index !== -1) {
        _dir.splice(index, 1);
        try {
            fs.writeFileSync("./system/database/premium.json", JSON.stringify(_dir, null, 2));
            console.log(`✅ Removed Premium: ${userId}`);
            return true;
        } catch (error) {
            console.error("❌ Failed to save premium.json:", error);
            return false;
        }
    }
    return false;
};

const getAllPremiumUser = (_dir) => {
    return _dir.map((user) => user.id);
};

//======================
module.exports = {
    addPremiumUser,
    getPremiumExpired,
    getPremiumPosition,
    delPremiumUser,
    expiredCheck,
    checkPremiumUser,
    getAllPremiumUser,
};