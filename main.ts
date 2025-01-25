import "jsr:@std/dotenv/load";
import dayjs from "npm:dayjs";

const FRED_URL = "https://api.stlouisfed.org/fred/series/observations";

const searchParamsObject = {
  series_id: "APU0000708111",
  api_key: Deno.env.get("FRED_API_KEY")!,
  file_type: "json",
  sort_order: "desc",
  limit: "1",
};

const url = new URL(FRED_URL);
const urlParams = new URLSearchParams(searchParamsObject);
url.search = urlParams.toString();
const fullUrl = url.toString();

const eggData = await (await fetch(fullUrl)).json();

const eggPrice = eggData.observations[0].value;
const eggPriceDate = eggData.observations[0].date;

await fetch(Deno.env.get("DISCORD_WEBHOOK_URL")!, {
  body: JSON.stringify({
    content: `The average supermaket price for a dozen of Grade A large eggs during ${dayjs(eggPriceDate).format('MMMM YYYY')} was $${eggPrice}.`,
  }),
  headers: {
    "Content-Type": "application/json",
  },
  method: "POST",
});

console.log("Message sent.");
