import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { InvoiceData, Layer, Signature } from "@/types/invoice";
import { LayerEditor } from "./LayerEditor";

interface InvoiceEditorProps {
  invoiceData: InvoiceData;
  onUpdateData: (data: Partial<InvoiceData>) => void;
  onAddLayer: () => void;
  onUpdateLayer: (layerId: string, updates: Partial<Layer>) => void;
  onDeleteLayer: (layerId: string) => void;
}

export const InvoiceEditor = ({
  invoiceData,
  onUpdateData,
  onAddLayer,
  onUpdateLayer,
  onDeleteLayer
}: InvoiceEditorProps) => {
  // switches control preview visibility, persisted and synced to invoiceData
  const LS_KEYS_PREVIEW = {
    showDue: "invoice-preview:showDueAmount",
    showPaid: "invoice-preview:showPaidAmount",
  } as const;

  const [showDueInPreview, setShowDueInPreview] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(LS_KEYS_PREVIEW.showDue);
      return stored !== null ? stored === "1" : (invoiceData.showDueAmount ?? true);
    } catch {
      return invoiceData.showDueAmount ?? true;
    }
  });

  const [showPaidInPreview, setShowPaidInPreview] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(LS_KEYS_PREVIEW.showPaid);
      return stored !== null ? stored === "1" : (invoiceData.showPaidAmount ?? true);
    } catch {
      return invoiceData.showPaidAmount ?? true;
    }
  });

  useEffect(() => {
    onUpdateData({ showDueAmount: showDueInPreview });
    try {
      localStorage.setItem(LS_KEYS_PREVIEW.showDue, showDueInPreview ? "1" : "0");
    } catch {}
  }, [showDueInPreview]);

  useEffect(() => {
    onUpdateData({ showPaidAmount: showPaidInPreview });
    try {
      localStorage.setItem(LS_KEYS_PREVIEW.showPaid, showPaidInPreview ? "1" : "0");
    } catch {}
  }, [showPaidInPreview]);

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    onUpdateData({ [field]: value });
  };

  const handleNumberChange = (field: keyof InvoiceData, value: string) => {
    const num = Number(value.replace(/[^0-9.-]/g, ""));
    onUpdateData({ [field]: isNaN(num) ? 0 : num } as Partial<InvoiceData>);
  };

  // Preload up to 4 preset signatures from public assets if none exist
  const PRESET_SIGNATURES: Signature[] = [
    { id: "pub-1", name: "Agnel", src: "/Agnel_Signature.png?v=2", type: "image/png", size: 0, width: 0, height: 0 },
    { id: "pub-2", name: "Bharani", src: "/Bharani_signature.png?v=2", type: "image/png", size: 0, width: 0, height: 0 },
    { id: "pub-3", name: "Dinesh", src: "/dinesh_signature.png?v=2", type: "image/png", size: 0, width: 0, height: 0 },
    { id: "pub-4", name: "Mohan", src: "/Mohan_signature.png?v=2", type: "image/png", size: 0, width: 0, height: 0 },
  ];

  useEffect(() => {
    if ((invoiceData.signatures?.length ?? 0) === 0) {
      onUpdateData({ signatures: PRESET_SIGNATURES, selectedSignatureName: PRESET_SIGNATURES[0].name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignatureNameChange = (id: string, name: string) => {
    const prev = invoiceData.signatures ?? [];
    const targetPrev = prev.find((s) => s.id === id);
    const wasSelected = targetPrev && targetPrev.name === invoiceData.selectedSignatureName;
    const trimmed = name.trim();
    const safeName = trimmed.length > 0 ? trimmed : (targetPrev?.name ?? "Signature");
    const updated = prev.map((s) => (s.id === id ? { ...s, name: safeName } : s));
    const updates: Partial<InvoiceData> = { signatures: updated };
    if (wasSelected) {
      updates.selectedSignatureName = safeName;
    }
    onUpdateData(updates);
  };

  const handleSelectedSignatureChange = (value: string) => {
    // Treat explicit none selection as clearing the value
    onUpdateData({ selectedSignatureName: value === "none" ? "" : value });
  };

  // Legacy single signature upload handler removed; using preset signatures

  const inputFields = [
    { id: "companyName", label: "Company Name", value: invoiceData.companyName, type: "text" },
    { id: "clientName", label: "Client Name", value: invoiceData.clientName, type: "text" },
    { id: "clientPhone", label: "Client Phone", value: invoiceData.clientPhone, type: "text" },
    { id: "clientEmail", label: "Client Email", value: invoiceData.clientEmail, type: "email" },
    { id: "clientAddress", label: "Client Address", value: invoiceData.clientAddress, type: "text" },
    { id: "invoiceNumber", label: "Invoice Number", value: invoiceData.invoiceNumber, type: "text" },
    { id: "soNumber", label: "SO Number", value: invoiceData.soNumber, type: "text" },
    { id: "invoiceDate", label: "Invoice Date", value: invoiceData.invoiceDate, type: "date" },
    { id: "dueDate", label: "Due Date", value: invoiceData.dueDate, type: "date" },
    { id: "bankName", label: "Bank Name", value: invoiceData.bankName, type: "text" },
    { id: "accountName", label: "Account Name", value: invoiceData.accountName, type: "text" },
    { id: "accountNumber", label: "Account Number", value: invoiceData.accountNumber, type: "text" },
    { id: "ifscCode", label: "IFSC Code", value: invoiceData.ifscCode, type: "text" },
    { id: "signatoryName", label: "Signatory Name", value: invoiceData.signatoryName, type: "text" },
    { id: "signatoryRole", label: "Signatory Role", value: invoiceData.signatoryRole, type: "text" }
  ];

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-none">
        <h2 className="text-lg font-semibold mb-4 text-[#2A2A2A]">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="text-[10px] font-bold text-[#2A2A2A]">
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                value={field.value || ""}
                onChange={(e) => handleInputChange(field.id as keyof InvoiceData, e.target.value)}
                className="text-[10px] text-[#389B3C] font-medium"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Amounts (with preview visibility toggles) */}
      <Card className="p-6 bg-card border-none">
        <h2 className="text-lg font-semibold mb-4 text-[#2A2A2A]">Amounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="dueAmount" className="text-[10px] font-bold text-[#2A2A2A]">
                Due Amount
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#2A2A2A]">Show in Preview</span>
                <Switch checked={showDueInPreview} onCheckedChange={setShowDueInPreview} />
              </div>
            </div>
            <Input
              id="dueAmount"
              type="number"
              value={invoiceData.dueAmount ?? 0}
              onChange={(e) => handleNumberChange("dueAmount", e.target.value)}
              // editing independent of preview visibility
              className="text-[10px] text-[#389B3C] font-medium"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="paidAmount" className="text-[10px] font-bold text-[#2A2A2A]">
                Paid Amount
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#2A2A2A]">Show in Preview</span>
                <Switch checked={showPaidInPreview} onCheckedChange={setShowPaidInPreview} />
              </div>
            </div>
            <Input
              id="paidAmount"
              type="number"
              value={invoiceData.paidAmount ?? 0}
              onChange={(e) => handleNumberChange("paidAmount", e.target.value)}
              // editing independent of preview visibility
              className="text-[10px] text-[#389B3C] font-medium"
            />
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6 bg-card border-none">
        <h2 className="text-lg font-semibold mb-4 text-[#2A2A2A]">Notes</h2>
        <div>
          <Label htmlFor="notes" className="text-[10px] font-bold text-[#2A2A2A]">
            Notes (shown in preview)
          </Label>
          <Textarea
            id="notes"
            value={invoiceData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={5}
            className="text-[10px] text-[#389B3C] font-medium"
            placeholder="Enter notes..."
          />
        </div>
      </Card>

      <Card className="p-6 bg-card border-none">
        <h2 className="text-lg font-semibold mb-4 text-[#2A2A2A]">Signatures</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-[10px] font-bold text-[#2A2A2A] block mb-2">
                Preset signatures are imported. Use the selector below.
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#2A2A2A]">
                  {(invoiceData.signatures?.length ?? 0)}/4 available
                </span>
              </div>
            </div>
          </div>

          {/* Signature thumbnails and naming */}
          {invoiceData.signatures && invoiceData.signatures.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {invoiceData.signatures.map((sig) => (
                <div key={sig.id} className="border border-dashed border-[#389B3C] rounded-md p-2">
                  <div className="w-full h-16 md:h-20 overflow-hidden rounded">
                    <img
                      src={sig.src}
                      alt={`${sig.name || 'Signature'} preview`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Label htmlFor={`sig-name-${sig.id}`} className="text-[10px] font-bold text-[#2A2A2A] block mt-2">
                    Signature Name
                  </Label>
                  <Input
                    id={`sig-name-${sig.id}`}
                    type="text"
                    value={sig.name}
                    onChange={(e) => handleSignatureNameChange(sig.id, e.target.value)}
                    className="text-[10px] text-[#389B3C] font-medium"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Selected signature dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="selected-signature" className="text-[10px] font-bold text-[#2A2A2A] block mb-2">
                Selected Signature (shown in preview)
              </Label>
              <Select value={invoiceData.selectedSignatureName ?? ""} onValueChange={handleSelectedSignatureChange}>
                <SelectTrigger id="selected-signature" className="h-8 w-full text-[10px]">
                  <SelectValue placeholder="Choose signature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {(invoiceData.signatures ?? []).map((sig) => (
                    <SelectItem key={sig.id} value={sig.name}>
                      {sig.name || `Signature`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#2A2A2A]">Layers</h2>
        <Button onClick={onAddLayer} size="sm" className="bg-[#2A732D] hover:bg-[#389B3C]">
          <Plus className="w-4 h-4 mr-2" />
          Add Layer
        </Button>
      </div>

      {invoiceData.layers.map((layer) => (
        <LayerEditor
          key={layer.id}
          layer={layer}
          onUpdate={(updates) => onUpdateLayer(layer.id, updates)}
          onDelete={() => onDeleteLayer(layer.id)}
        />
      ))}

      <Card className="p-6 bg-[#389B3C]/10 border-none">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-[#2A2A2A]">Grand Total</span>
          <span className="text-2xl font-bold text-[#389B3C]">
            ₹{invoiceData.grandTotal.toLocaleString()}
          </span>
        </div>
      </Card>
    </div>
  );
};
