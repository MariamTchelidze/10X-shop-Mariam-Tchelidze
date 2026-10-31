import type { FormEvent } from "react";
import type { RefundFormValues, RefundRequest } from "../profileTypes";
import { ProfileField } from "./ProfileField";
import { SectionPanel } from "./SectionPanel";
import { formatDate } from "../../../utils/formatters";

interface RefundsSectionProps {
  requests: RefundRequest[];
  values: RefundFormValues;
  onFieldChange: (field: keyof RefundFormValues, value: string) => void;
  onSubmit: () => void;
}

export function RefundsSection({ requests, values, onFieldChange, onSubmit }: RefundsSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <SectionPanel
      title="Refunds"
      intro="Submit bank details for a refund request. Requests are saved locally for this demo."
    >
      <form onSubmit={handleSubmit} className="grid gap-5 sm:max-w-xl">
        <ProfileField id="refund-bank" label="Bank name" value={values.bankName} onChange={(value) => onFieldChange("bankName", value)} />
        <ProfileField id="refund-holder" label="Account holder" value={values.accountHolder} onChange={(value) => onFieldChange("accountHolder", value)} />
        <ProfileField id="refund-iban" label="IBAN" minLength={15} value={values.iban} onChange={(value) => onFieldChange("iban", value.toUpperCase())} />
        <button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper sm:w-fit">
          Submit refund request
        </button>
      </form>
      {requests.length > 0 && (
        <ul className="mt-8 divide-y divide-market-border border-y border-market-border">
          {requests.map((request) => (
            <li key={request.id} className="flex flex-wrap justify-between gap-3 py-4 text-xs">
              <span className="text-market-ink">{request.bankName} · {request.iban.slice(-4).padStart(request.iban.length, "•")}</span>
              <span className="text-market-muted">{formatDate(request.submittedAt)} · {request.status}</span>
            </li>
          ))}
        </ul>
      )}
    </SectionPanel>
  );
}
