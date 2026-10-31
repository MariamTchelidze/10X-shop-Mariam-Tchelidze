import type { FormEvent } from "react";
import type { ProfileAddress, ProfileAddressForm } from "../../../types/profile";
import { ProfileField } from "./ProfileField";
import { SectionPanel } from "./SectionPanel";

interface AddressesSectionProps {
  addresses: ProfileAddress[];
  values: ProfileAddressForm;
  editingAddressId: string | null;
  onFieldChange: (field: keyof ProfileAddressForm, value: string) => void;
  onSubmit: () => void;
  onEdit: (address: ProfileAddress) => void;
  onRemove: (id: string) => void;
  onCancelEdit: () => void;
}

export function AddressesSection({
  addresses,
  values,
  editingAddressId,
  onFieldChange,
  onSubmit,
  onEdit,
  onRemove,
  onCancelEdit,
}: AddressesSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <SectionPanel title="My addresses" intro="Keep delivery destinations close at hand.">
      {addresses.length > 0 && (
        <ul className="mb-8 grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="border border-market-border p-4">
              <p className="text-sm font-medium text-market-ink">{address.street}</p>
              <p className="mt-2 text-xs leading-5 text-market-muted">
                {address.city}, {address.postalCode}
                <br />
                {address.country}
              </p>
              <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest">
                <button type="button" onClick={() => onEdit(address)} className="text-market-ink underline underline-offset-4">
                  Edit
                </button>
                <button type="button" onClick={() => onRemove(address.id)} className="text-market-muted underline underline-offset-4">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="grid gap-5 sm:max-w-xl sm:grid-cols-2">
        <ProfileField id="address-country" label="Country" value={values.country} onChange={(value) => onFieldChange("country", value)} />
        <ProfileField id="address-city" label="City" value={values.city} onChange={(value) => onFieldChange("city", value)} />
        <ProfileField id="address-street" label="Street" value={values.street} onChange={(value) => onFieldChange("street", value)} />
        <ProfileField id="address-postalCode" label="Postal code" value={values.postalCode} onChange={(value) => onFieldChange("postalCode", value)} />
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" className="min-h-12 bg-market-ink px-7 text-xs uppercase tracking-[0.14em] text-market-paper">
            {editingAddressId ? "Update address" : "Add address"}
          </button>
          {editingAddressId && (
            <button type="button" onClick={onCancelEdit} className="min-h-12 px-4 text-xs uppercase tracking-widest text-market-muted">
              Cancel
            </button>
          )}
        </div>
      </form>
    </SectionPanel>
  );
}
