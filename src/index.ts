import * as fs from "fs";
import * as path from "path";

import { Client, InvoiceV4 } from "mindee";
import { updateBaseAmounts } from "./utils/taxUtils";

const mindeeClient = new Client({});

function findBaseForTax(filepath: string) {
  console.log(filepath);
  const doc = mindeeClient.docFromPath(filepath);
  doc
    .parse(InvoiceV4, {
      fullText: true,
    })
    .then((response) => {
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
    });
}

const okFiles = "./tests/data";
const files: string[] = fs.readdirSync(okFiles);
const filepath = path.join(okFiles, files[1]);
findBaseForTax(filepath);
