import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { InvoiceData } from "@/types/invoice";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

export const InvoicePreview = ({ invoiceData }: InvoicePreviewProps) => {
  const handlePrint = async () => {
    // 找到打印目标节点
    const previewEl = document.getElementById("invoice-preview");
    if (!previewEl) {
      console.warn("[print] #invoice-preview element not found");
      return;
    }

    // 等待字体就绪（在支持的浏览器中）
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    } catch (_) {
      // 忽略字体 API 不可用的情况
    }

    // 等待预览区域内的所有图像加载完成
    const images: HTMLImageElement[] = Array.from(previewEl.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
      )
    );

    // 触发打印
    window.print();
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-lg font-semibold">Preview</h2>
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
        <Card id="invoice-preview" className="p-10 bg-card print:shadow-none border-none">
          {/* Header */}
          <div className="invoice-header">
            <div className="flex justify-between items-start">
              <div>
                <img className="w-[149px] h-[30px]" src="/dezprox-logo.png" alt="Dezprox Logo" />
                <div className="mt-2 space-y-2">
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                  <div className="flex justify-start items-center gap-1">
                    <p className="font-semibold text-[10px] text-[#2A2A2A]">Invoice No :</p>
                    <p className="font-semibold text-[10px] text-[#389B3C]">{invoiceData.invoiceNumber}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <p className="font-semibold text-[10px] text-[#2A2A2A]">SO No :</p>
                    <p className="font-semibold text-[10px] text-[#389B3C]">{invoiceData.invoiceNumber}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold font-outfit text-[#2A2A2A]">Dezprox LLP</p>
                <p className="text-[9px] font-outfit text-[#2A2A2A]">Rasipuram, Namakkal, IN</p>
                <p className="text-[9px] font-outfit text-[#2A2A2A]">+91 8072818574</p>
                <p className="text-[9px] font-outfit text-[#2A2A2A]">admin@dezprox.com</p>
                <p className="text-[9px] font-outfit text-[#2A2A2A]">www.dezprox.com</p>
              </div>
            </div>
          </div>

          {/* From/To Section */}
          <div className="flex justify-between items-start gap-8 invoice-parties mt-2">
            <div>
              <p className="text-[12px] font-bold text-[#389B3C]">INVOICE TO</p>
              <div className="flex justify-start items-center gap-1">
                <p className="text-[10px] font-bold text-[#2A2A2A]">Name :</p>
                <p className="text-[10px] font-bold text-[#389B3C]">{invoiceData.clientName}</p>
              </div>
              <div className="flex justify-start items-center gap-1">
                <p className="text-[10px] font-bold text-[#2A2A2A]">Phone no :</p>
                <p className="text-[10px] font-bold text-[#389B3C]">{invoiceData.clientPhone}</p>
              </div>
              <div className="flex justify-start items-center gap-1">
                <p className="text-[10px] font-bold text-[#2A2A2A]">Email :</p>
                <p className="text-[10px] font-bold text-[#389B3C]">{invoiceData.clientEmail}</p>
              </div>
              <div className="flex justify-start items-center gap-1">
                <p className="text-[10px] font-bold text-[#2A2A2A]">Address :</p>
                <p className="text-[10px] font-bold text-[#389B3C]">{invoiceData.clientAddress}</p>
              </div>
            </div>
            <div className="text-right flex flex-col gap-2">
              <div>
                <p className="text-[10px] text-[#2A2A2A]">Invoice Date.</p>
                <p className="text-[10px] text-[#5D5D5D]">
                  {new Date(invoiceData.invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-auto">
                <p className="text-[10px] text-[#2A2A2A]">Due Date.</p>
                <p className="text-[10px] text-[#5D5D5D]">
                  {new Date(invoiceData.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="invoice-table mt-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#2A732D] text-white">
                  <th className="text-center br-2 border border-white py-2">S.No</th>
                  <th className="text-center br-2 border border-white py-2">Description</th>
                  <th className="text-center br-2 border border-white py-2 w-16">Qty</th>
                  <th className="text-center br-2 border border-white py-2 w-24">Rate</th>
                  <th className="text-center br-2 border border-white py-2 w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const allItems = invoiceData.layers.flatMap((layer, layerIndex) =>
                    layer.items.map((item, itemIndex) => {
                      const rowIndex = invoiceData.layers
                        .slice(0, layerIndex)
                        .reduce((acc, curr) => acc + curr.items.length, 0) + itemIndex;
                      return { item, layer, rowIndex };
                    })
                  );

                  // Always ensure minimum 5 rows
                  const minRows = 5;
                  const totalRows = Math.max(allItems.length, minRows);
                  const emptyRowsCount = totalRows - allItems.length;

                  return (
                    <>
                      {allItems.map(({ item, layer, rowIndex }) => {
                        const isEven = rowIndex % 2 === 0;
                        return (
                          <tr
                            key={`${layer.id}-${item.id}`}
                            className={`${isEven ? 'bg-[#FFFFFF]' : 'bg-[#F3FFF3]'}`}
                          >
                            <td className="text-center py-2">{rowIndex + 1}</td>
                            <td className="p-3">{item.description}</td>
                            <td className="text-center py-2">{item.qty}</td>
                            <td className="text-center py-2">₹{item.rate.toLocaleString()}</td>
                            <td className="text-center py-2 font-medium">₹{item.amount.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      {Array.from({ length: emptyRowsCount }).map((_, index) => {
                        const rowIndex = allItems.length + index;
                        const isEven = rowIndex % 2 === 0;
                        return (
                          <tr
                            key={`empty-${index}`}
                            className={`${isEven ? 'bg-[#FFFFFF]' : 'bg-[#F3FFF3]'}`}
                          >
                            <td className="text-center py-2">{rowIndex + 1}</td>
                            <td className="p-3">&nbsp;</td>
                            <td className="text-center py-2">&nbsp;</td>
                            <td className="text-center py-2">&nbsp;</td>
                            <td className="text-center py-2 font-medium">&nbsp;</td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="invoice-footer">
            <div className="flex justify-between items-start">
              <div className="space-y-2 mt-auto">
                <div className="space-y-1">
                  <h1 className="text-[10px] tracking-wider font-semibold text-[#2A2A2A] mt-2">Payment Details:</h1>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[10px] text-[#9A9A9A]">Bank Name :</h1>
                    <p className="text-[10px] text-[#000]">{invoiceData.bankName}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[10px] text-[#9A9A9A]">Account Name :</h1>
                    <p className="text-[10px] text-[#000]">{invoiceData.accountName}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[10px] text-[#9A9A9A]">Account Number:</h1>
                    <p className="text-[10px] text-[#000]">{invoiceData.accountNumber}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-[10px] text-[#9A9A9A]">IFSC Code:</h1>
                    <p className="text-[10px] text-[#000]">{invoiceData.ifscCode}</p>
                  </div>
                </div>

                <div>
                  <h1 className="text-[8px] tracking-wider font-semibold text-[#000000]">Notes:</h1>
                  <p className="text-[8px] text-[#9A9A9A] w-[237px] mt-1">
                    - Meta Ad service has been successfully completed. <br />
                    - Ad spend already paid on client's behalf and included here. <br />
                    - Final performance report has been submitted. <br />
                    - Kindly make the payment within the due date.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-12 ">
                <div className="space-y-1 w-40  ">
                  <div className="flex justify-between items-center gap-5 ">
                    <span className="text-[11px] font-semibold">Grand Total:</span>
                    <span className="text-[11px] font-semibold text-success">
                      ₹{invoiceData.grandTotal.toLocaleString()}
                    </span>

                  </div>
                  {invoiceData.showDueAmount && (
                    <div className="flex justify-between items-center gap-5">
                      <span className="text-[11px] font-semibold text-[#FF0000]">Due Amount:</span>
                      <span className="text-[11px] font-semibold text-success">
                        ₹{invoiceData.dueAmount.toLocaleString()}
                      </span>

                    </div>
                  )}
                  <hr />
                  {invoiceData.showPaidAmount && (
                    <div className="flex justify-between items-center gap-5">
                      <span className="text-[11px] font-semibold">Paid Amount:</span>
                      <span className="text-[11px] font-semibold text-success">
                        ₹{invoiceData.paidAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="justify-end flex text-end flex-col">
                  {invoiceData.signatureImage ? (
                    <img
                      src={invoiceData.signatureImage}
                      alt="Signature"
                      className="w-16 h-16 object-contain mb-2"
                    />
                  ) : (
                    <div className="w-16 h-10 border relative -right-20 border-dashed border-gray-300 rounded-md mb-2 flex items-center justify-center">
                      <span className="text-[8px] text-gray-400">No Signature</span>
                    </div>
                  )}
                  <p className="text-[12px] font-bold">{invoiceData.signatoryName}</p>
                  <p className="text-[10px] font-semibold">{invoiceData.signatoryRole}</p>
                </div>
                <div className="justify-end font-semibold text-end text-[12px] flex">
                  Together, we make  <br />
                  brands unforgettable !!
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        /* A4 paper dimensions: 210mm × 297mm */
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
            min-height: 300px;
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

        /* Print styles - robust and minimal */
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
          }

          /* 只打印发票预览区域，避免复杂选择器造成内容被隐藏 */
          body * { visibility: hidden !important; }
          #invoice-preview, #invoice-preview * { visibility: visible !important; }

          .preview-sheet {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          #invoice-preview {
            position: fixed !important;
            left: 0;
            top: 0;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            display: flex !important;
            flex-direction: column !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .invoice-header { margin-bottom: 8mm; }
          .invoice-parties { margin-bottom: 8mm; }
          .invoice-table { flex: 1; min-height: 120mm; margin-bottom: 8mm; display: flex; flex-direction: column; }
          .invoice-table table { width: 100%; height: 100%; border-collapse: collapse; }
          .invoice-table tbody { height: 100%; vertical-align: top; }
          .invoice-footer { flex-shrink: 0; margin-top: auto; }

          /* 确保颜色打印 */
          .bg-\[\#2A732D\],
          .text-\[\#389B3C\],
          .bg-\[\#F3FFF3\] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};
