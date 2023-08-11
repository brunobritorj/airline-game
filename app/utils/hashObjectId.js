import crypto from "crypto";
import { ObjectId } from "mongodb";

export default function hashObjectId(inputString) {
  const hash = crypto.createHash("md5").update(inputString).digest("hex");
  return new ObjectId(hash.slice(0, 24));
}
