import { getWordsOnSameColumn, getWordsOnSameRow } from "./fieldUtils";
import { InvoiceV4, Response } from "mindee";

export function updateBaseAmounts(
  invoiceResponse: Response<InvoiceV4>,
  roundingError: number | undefined = undefined
) {
  if (invoiceResponse.document !== undefined) {
    invoiceResponse.document.taxes.forEach((tax) => {
      const pageText = invoiceResponse.pages[tax.pageId].fullText;
      if (
        tax.rate === undefined ||
        tax.value === undefined ||
        pageText === undefined
      ) {
        return;
      }

      let maxRoundingError: number;
      if (roundingError === undefined) {
        maxRoundingError = Math.ceil(1 / (tax.rate / 100) / 2) / 100;
      } else {
        maxRoundingError = roundingError;
      }

      const estimate = (tax.value / tax.rate) * 100;

      const allWords = new Set([
        ...getWordsOnSameRow(pageText.words, tax),
        ...getWordsOnSameColumn(pageText.words, tax),
      ]);

      const cleanedWords = Array.from(allWords.values())
        // we only want those words that could fit the estimate
        .filter((word) => {
          const value = getNumberFromString(word.text);
          if (Number.isNaN(value)) return false;
          const taxRoundingError = Math.abs(estimate - value);
          return taxRoundingError <= maxRoundingError;
        })
        // order results from smallest to largest
        .sort((a, b) => {
          const aValue = getNumberFromString(a.text);
          const bValue = getNumberFromString(b.text);
          if (aValue > bValue) return 1;
          if (aValue < bValue) return -1;
          return 0;
        });

      // best fit will be the smallest amount
      if (cleanedWords.length === 0) return;
      const foundWord = cleanedWords[0];

      const value = getNumberFromString(foundWord.text);

      tax.base = value;
      tax.reconstructed = true;
    });
  }
}

function cleanTextForAmount(text: string): string {
  return text.replace(/\(|\)|€|:|%/g, "");
}

function getNumberFromString(text: string): number {
  text = cleanTextForAmount(text);
  const reversed = text.split("").reverse();
  let indexOfComma = reversed.indexOf(",");
  let indexOfPeriod = reversed.indexOf(".");
  indexOfComma = indexOfComma < 2 ? -1 : indexOfComma;
  indexOfPeriod = indexOfPeriod < 2 ? -1 : indexOfPeriod;
  const decimalSeperator =
    (indexOfComma < indexOfPeriod && indexOfComma !== -1) ||
    indexOfPeriod === -1
      ? ","
      : ".";
  const thousandsSeperator = decimalSeperator === "." ? "," : ".";
  text = text.replaceAll(thousandsSeperator, "");
  if (decimalSeperator === ",") {
    text = text.replaceAll(decimalSeperator, ".");
  }
  return parseFloat(text);
}
