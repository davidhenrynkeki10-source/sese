import fs from 'fs';

const buf = fs.readFileSync("C:/Users/hp/.gemini/antigravity/brain/3178062b-4c00-470c-81ba-e4d1a2867363/.user_uploaded/media_1791378019541.png");
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log({ width, height, ratio: width / height });
