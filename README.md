# Mindee Tax Base Finder

The `findBaseAmounts` method is why you're here ;-)

Given a `ReceiptResponse` object, it will calculate the base tax
amount for each tax line found by the Expense Receipts API.

It will return a `Map`, where the tax line is the key,
and the base amount found is the value.

You can find a full working example in `./src/index.ts`.

### Note:
For the method to work properly, you **must** set the `fullText` option to `true`
when calling the `parse` method:
```ts
doc.parse(ReceiptResponse, {
  fullText: true,
})
```
