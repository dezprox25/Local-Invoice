import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Download, Printer } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { printElement } from "@/lib/print";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

export const InvoicePreview = ({ invoiceData }: InvoicePreviewProps) => {
  type DocumentType = "invoice" | "quotation";
  const LS_KEY_DOC_TYPE = "invoice-preview:documentType";

  const isDocumentType = (value: unknown): value is DocumentType =>
    value === "invoice" || value === "quotation";

  const [documentType, setDocumentType] = useState<DocumentType>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY_DOC_TYPE);
      return isDocumentType(stored) ? stored : "invoice";
    } catch {
      return "invoice";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY_DOC_TYPE, documentType);
    } catch { }
  }, [documentType]);

  const handleDocumentTypeChange = (value: string) => {
    const normalized = value.toLowerCase();
    if (isDocumentType(normalized)) {
      setDocumentType(normalized);
      try {
        window.dispatchEvent(
          new CustomEvent("invoice-preview:documentTypeChanged", {
            detail: { documentType: normalized },
          })
        );
      } catch { }
    }
  };

  const handlePrint = async () => {
    const previewEl = document.getElementById("invoice-preview");
    if (!previewEl) {
      console.warn("[print] #invoice-preview element not found");
      return;
    }

    const title = `${documentType === "invoice" ? "Invoice" : "Quotation"} ${invoiceData.invoiceNumber}`;
    try {
      await printElement(previewEl, { title, pagePaddingMM: 0 });
    } catch (err) {
      console.error("[print] isolated print failed:", err);
    }
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      <div className="flex justify-between items-center print:hidden no-print">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex items-center gap-2" aria-label="Document type selection">
            <Label htmlFor="document-type" className="text-[11px] font-bold text-[#2A2A2A]">
              Document Type
            </Label>
            <Select value={documentType} onValueChange={handleDocumentTypeChange}>
              <SelectTrigger
                id="document-type"
                aria-label="Select document type"
                className="h-8 w-36 text-[11px]"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="quotation">Quotation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} size="sm" variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handlePrint} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="preview-sheet">
        <div id="invoice-preview" className="p-10  bg-card print:shadow-none border-none">
          {/* Header */}
          <div className="invoice-header">
            <div className="flex justify-between items-start">
              <div>
                <img className="w-[149px] h-[30px]" src="/dezprox-logo.png" alt="Dezprox Logo" />
                <div className="mt-2 space-y-2">
                  <h1 className="text-3xl font-bold">
                    {documentType === "invoice" ? "INVOICE" : "QUOTATION"}
                  </h1>
                  {documentType === "invoice" && (
                    <div className="flex justify-start items-center gap-1">
                      <p className="font-semibold text-[12px] text-[#2A2A2A]">Invoice No :</p>
                      <p className="font-semibold text-[12px] text-[#389B3C]">{invoiceData.invoiceNumber}</p>
                    </div>
                  )}
                  <div className="flex justify-start items-center gap-1">
                    <p className="font-semibold text-[12px] text-[#2A2A2A]">SO No :</p>
                    <p className="font-semibold text-[12px] text-[#389B3C]">{invoiceData.soNumber || invoiceData.invoiceNumber}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-semibold font-outfit text-[#2A2A2A]">Dezprox LLP - ACP-1336</p>
                <p className="text-[12px] font-outfit text-[#2A2A2A]">53, 5/47D, North street, <br />Rasipuram, Namakkal 637 407</p>
                <p className="text-[12px] mt-3 font-outfit text-[#2A2A2A]">+91 8072818574</p>
                <p className="text-[12px] font-outfit text-[#2A2A2A]">admin@dezprox.com</p>
                <p className="text-[12px] font-outfit text-[#2A2A2A]">www.dezprox.com</p>
              </div>
            </div>
          </div>

          {/* From/To Section */}
          <div className="flex justify-between items-start gap-8 invoice-parties mt-2">
            <div>
              <p className="text-[14px] font-bold text-[#389B3C]">
                {documentType === "invoice" ? "INVOICE TO" : "QUOTATION TO"}
              </p>
              <p className="text-[11px] font-medium mt-1 text-[#2A2A2A] whitespace-pre-wrap">
                {invoiceData.clientDetails}
              </p>
            </div>
            <div className="text-right flex flex-col gap-2 mt-auto">
              <div>
                <p className="text-[12px] font-medium text-[#2A2A2A]">
                  {documentType === "invoice" ? "Invoice Date." : "Quotation Date."}
                </p>
                <p className="text-[12px] text-[#5D5D5D]">
                  {new Date(invoiceData.invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#2A2A2A]">Due Date.</p>
                <p className="text-[12px] text-[#5D5D5D]">
                  {new Date(invoiceData.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table + Footer wrapped to occupy full A4 height */}
          <section
            style={{ height: 'calc(170mm - 10mm)', minHeight: 'calc(107mm - 10mm)' }}
          
          >
          <div
            className="invoice-content flex flex-col"
          >
            {/* Items Table */}
            <div style={{height:'100px'}} className="invoice-table mt-6 flex-1 ">
              <table  className="w-full text-sm ">
                <thead>
                  <tr className="bg-[#2A732D] text-white">
                    <th className="text-center br-2 border border-white py-2 uppercase">S.No</th>
                    <th className="text-center br-2 border border-white py-2 uppercase">Item Description</th>
                    <th className="text-center br-2 border border-white py-2 w-16 uppercase">Qty</th>
                    <th className="text-center br-2 border border-white py-2 w-24 uppercase">Price</th>
                    <th className="text-center br-2 border border-white py-2 w-32 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="h-full align-top ">
                  {(() => {
                    const allItems = invoiceData.layers.flatMap((layer, layerIndex) =>
                      layer.items.map((item, itemIndex) => {
                        const rowIndex = invoiceData.layers
                          .slice(0, layerIndex)
                          .reduce((acc, curr) => acc + curr.items.length, 0) + itemIndex;
                        return { item, layer, rowIndex };
                      })
                    );
                    return (
                      <>
                        {allItems.map(({ item, layer, rowIndex }) => {
                          const isEven = rowIndex % 2 === 0;
                          return (
                            <tr
                              key={`${layer.id}-${item.id}`}
                              className={`${isEven ? 'bg-[#FFFFFF]' : 'bg-[#F3FFF3] min-h-[35px]  '}`}
                            >
                              <td className="text-center py-2">{rowIndex + 1}</td>
                              <td className="p-3">{item.description}</td>
                              <td className="text-center py-2">{item.qty}</td>
                              <td className="text-center py-2">₹{item.rate.toLocaleString()}</td>
                              <td className="text-center py-2 font-medium">₹{item.amount.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                    
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
            <div className="space-y-1 w-40 ml-auto py-5">
              <div className="flex justify-between items-center gap-5">
                <span className="text-[13px] font-semibold">Grand Total:</span>
                <span className="text-[13px] font-semibold text-[#2A2A2A]">
                  ₹{invoiceData.grandTotal.toLocaleString()}
                </span>
              </div>
              {invoiceData.showDueAmount && (
                <div className="flex justify-between items-center gap-5">
                  <span className="text-[13px] font-semibold text-[#FF0000]">Due Amount:</span>
                  <span className="text-[13px] font-semibold text-[#2A2A2A]">
                    ₹{invoiceData.dueAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <hr />
              {invoiceData.showPaidAmount && (
                <div className="flex justify-between items-center gap-5">
                  <span className="text-[14px] font-semibold text-success">Paid Amount:</span>
                  <span className="text-[14px] font-semibold text-success">
                    ₹{invoiceData.paidAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          </section>

          {/* Grand Total */}
          <div className="invoice-footer mt-auto">
            <div className="flex justify-between items-start">
              <div className="space-y-2 mt-auto">
                <div className="s">
                  <h1 className="text-[12px] tracking-wider font-semibold text-[#2A2A2A] mt-2">Payment Details:</h1>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[11px] text-[#9A9A9A]">Bank Name :</h1>
                    <p className="text-[11px] text-[#000]">{invoiceData.bankName}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[11px] text-[#9A9A9A]">Account Name :</h1>
                    <p className="text-[11px] text-[#000]">{invoiceData.accountName}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[11px] text-[#9A9A9A]">Account Number:</h1>
                    <p className="text-[11px] text-[#000]">{invoiceData.accountNumber}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[11px] text-[#9A9A9A]">IFSC Code:</h1>
                    <p className="text-[11px] text-[#000]">{invoiceData.ifscCode}</p>
                  </div>
                </div>

                <div>
                  <h1 className="text-[12px] tracking-wider font-semibold text-[#000000]">Notes:</h1>
                  <p className="text-[11px] text-[#9A9A9A] w-[337px] mt-1" style={{ whiteSpace: 'pre-line' }}>
                    {invoiceData.notes}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-12">

                <div className="justify-end flex text-end flex-col">
                  {(() => {
                    const active = (invoiceData.signatures ?? []).find(
                      (s) => s.name === (invoiceData.selectedSignatureName ?? "")
                    );
                    const src = active?.src || (invoiceData.signatureImage || "");
                    return src ? (
                      <img
                        src={src}
                        alt={active?.name ? `${active.name} signature` : "Signature"}
                        className="w-20 h-12 ml-auto md:w-32 md:h-auto object-contain"
                      />
                    ) : (
                      <div className="w-20 h-12 md:w-24 md:h-16 border relative -right-20 border-dashed border-gray-300 rounded-md mb-2 flex items-center justify-center">
                        <span className="text-[11px] text-gray-400">No Signature</span>
                      </div>
                    );
                  })()}
                  <p className="text-[14px] font-semibold">{invoiceData.signatoryName}</p>
                  <p className="text-[11px] ">{invoiceData.signatoryRole}</p>
                </div>
                <div className="justify-end font-medium text-end text-[14px] flex">
                  Together, we make  <br />
                  brands unforgettable !!
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @page {
          size: A4;
          margin: 0;
        }

        /* Screen preview */
        @media screen {
          .preview-sheet {
            position: relative;
            width: min(100%, 210mm);
            aspect-ratio: 210 / 297;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          #invoice-preview {
            width: 100%;
            height: 100%;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          
          .invoice-table {
            flex: 1;
           
            display: flex;
            flex-direction: column;
          }
          
          .invoice-table table {
            flex: 1;
          }
          
          .invoice-table tbody {
            height: 100%;
          }
        }

        /* ✅ Print ONLY the invoice - hide everything else */
        @media print {
          /* Hide everything by default */
          body > *:not(.preview-sheet) {
            display: none !important;
          }

          /* Reset html and body */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Make preview sheet the only visible element */
          .preview-sheet {
            display: block !important;
            position: static !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Hide buttons and controls */
          .print\\:hidden, 
          .no-print {
            display: none !important;
          }

          /* Invoice preview styling */
          #invoice-preview {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            min-height: 297mm !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
          }

          /* Table styling */
          #invoice-preview table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          #invoice-preview th,
          #invoice-preview td {
            padding: 6px !important;
          }

          #invoice-preview tr {
            page-break-inside: avoid !important;
          }

          /* Preserve background colors */
          .bg-\\[\\#2A732D\\] {
            background-color: #2A732D !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .bg-\\[\\#F3FFF3\\] {
            background-color: #F3FFF3 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .text-\\[\\#389B3C\\] {
            color: #389B3C !important;
          }

          /* Layout spacing */
          .invoice-header { margin-bottom: 8mm; }
          .invoice-parties { margin-bottom: 8mm; }
          .invoice-table { 
            flex: 1; 
        
            display: flex;
           
            flex-direction: column;
          }
          .invoice-footer { 
            flex-shrink: 0; 
            margin-top: auto; 
          }
        }
      `}</style>
    </div>
  );
};
