import path from "path";
import { readFile, writeFile } from "fs/promises";
import { env } from "process";

const buildJSONFilePath = () => {
 const dataJsonPath = path.join(process.cwd(), "data", "data.json");
 return dataJsonPath;
};

const extractData = async (filePath) => {
 const fileData = await readFile(
  filePath,
  { encoding: "utf-8" },
  (err, data) => {
   if (err) {
    throw new Error(err);
   }
   return data;
  }
 );
 return JSON.parse(fileData);
};

const handler = async (req, res) => {
 try {
  const { method } = req;
  if (method === "POST") {
   const { email, eventId } = JSON.parse(req.body);

   const filePath = buildJSONFilePath();
   const fileData = await extractData(filePath);
   const { allEvents, event_categories } = fileData;

   if (!allEvents) {
    return res.status(404).json({ msg: `Your data is gone.`, success: false });
   }
   let duplicateEmailSupplied = false;
   const newAllEvents = allEvents.map((ev) => {
    const { id, emails_registered } = ev;
    if (id === eventId) {
     if (emails_registered.includes(email)) {
      duplicateEmailSupplied = true;
      return ev;
     }
     // emails_registered.push(email);
     // return { ...ev, emails_registered };
     return { ...ev, emails_registered: [...emails_registered, email] };
    }
    return ev;
   });
   if (duplicateEmailSupplied) {
    return res.status(409).json({
     msg: `This email has already been registered.`,
     success: false,
    });
   }

   // console.log(fileData);

   fileData.allEvents = newAllEvents;

   writeFile(filePath, JSON.stringify(fileData, null, 2), (err) => {
    if (err) {
     console.log("writeFile error", err);
     throw new Error();
    }
   });

   return res.status(200).json({
    msg: `You have been successfully registered with the email:"${email}" for the event:"${
     eventId
     //  .split(
     //  "-"
     // )
    }"`,
    success: true,
   });
  }
 } catch (err) {
  console.log(err);
 }
};

export default handler;
