import * as fs from "fs";
import * as path from "path";

import { Client, InvoiceV4 } from "mindee";
import { updateBaseAmounts } from "./utils/taxUtils";

const mindeeClient = new Client({});

function findBaseForTax(filepath: string) {
  const doc = mindeeClient.docFromPath(filepath);
  doc
    .parse(InvoiceV4, {
      fullText: true,
    })
    .then((response) => {
      console.log(filepath);
      updateBaseAmounts(response);
      response.document?.taxes.forEach((taxField) => {
        console.log(
          "base:",
          taxField.base,
          "rate:",
          taxField.rate,
          "tax:",
          taxField.value
        );
      });
      console.log();
    });
}

const okFiles = "./tests/data";
const files: string[] = fs.readdirSync(okFiles);
files.forEach(function (filename) {
  if (filename === ".gitkeep") {
    return;
  }
  findBaseForTax(path.join(okFiles, filename));
});
