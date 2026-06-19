import fs from "node:fs/promises";
import path from "node:path";

const purgeData = process.argv.includes("--purge-data");
const dbPath = path.join(process.cwd(), "data", "db.json");

if (!purgeData) {
  console.log(
    "Safe cleanup selected: no store data was deleted. Remove the plugin integration files manually after disabling it.",
  );
  process.exit(0);
}

const raw = await fs.readFile(dbPath, "utf8");
const database = JSON.parse(raw);

if (Object.hasOwn(database, "ethbatReviews")) {
  delete database.ethbatReviews;
  await fs.writeFile(dbPath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
  console.log("Removed only the plugin-owned data key: ethbatReviews.");
} else {
  console.log("No plugin-owned settings were present.");
}
