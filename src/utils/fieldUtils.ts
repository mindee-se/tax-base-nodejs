import * as geometry from "mindee/src/geometry";
import { TaxField } from "mindee/src/fields";
import { Word } from "mindee/src/fields/fullText";

export function getWordsOnSameRow(
  words: Array<Word>,
  source: TaxField
): Array<Word> {
  return words
    .filter((word) => {
      const centroid = geometry.getCentroid(word.polygon);
      return geometry.isPointInPolygonY(centroid, source.polygon);
    })
    .sort((a, b) => {
      return geometry.relativeX(a.polygon) - geometry.relativeX(b.polygon);
    });
}

export function getWordsOnSameColumn(
  words: Array<Word>,
  source: TaxField
): Array<Word> {
  return words
    .filter((word) => {
      const centroid = geometry.getCentroid(word.polygon);
      return geometry.isPointInPolygonX(centroid, source.polygon);
    })
    .sort((a, b) => {
      return geometry.relativeY(a.polygon) - geometry.relativeY(b.polygon);
    });
}
