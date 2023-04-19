import { encrypt, decrypt } from "./lib/encryption";

try {
  const test =
    "AQICAHj2nLbvZFcPV+Avw4ng17nZhU0FawAo6c/EOvt3RFQjcwHLqTynElZZ2HvF67hsE/GqAAAAtjCBswYJKoZIhvcNAQcGoIGlMIGiAgEAMIGcBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDNucMR10R9Z0IAaGkAIBEIBv8To/4c7xR1hMzRbfXXNxBV4Q9KdTYP1NzmFZCkFjTayu3z5uB5+Y61rqSNjqSCpD0b38412zsfAvA5ko22tTnBApnWqZPlHW4fzPyFWJjhq/03INR7DLvN0mg5kYR+wd2KdPrCmBukAoLCRWXLPk";

  const payload = JSON.stringify({
    email: "jacob.granberry@company-corp.com",
    expiration: "2023-04-19T14:29:10.938Z",
  });

  const testfunc = async () => {
    // const res = await encrypt(payload);
    // console.log("👾 ~ testfunc ~ res:", res);
    const dec = await decrypt(test);
    console.log("👾 ~ testfunc ~ res:", dec);
  };

  testfunc();
} catch (err) {
  console.log("👾 ~ err:", err);
}
