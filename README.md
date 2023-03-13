# Mindee Tax Base Finder

The `findBaseAmounts` method is why you're here ;-)

Given a `Response<InvoiceV4>` object, it will calculate the base tax
amount for each tax line found by the Invoice API.

It will update each `TaxField` object in the response, setting the `base` property with the found tax base.

You can find a full working example in `./src/index.ts`.

### Note:
For the method to work properly, you **must** set the `fullText` option to `true`
when calling the `parse` method:
```ts
doc.parse(ReceiptResponse, {
  fullText: true,
})
```
