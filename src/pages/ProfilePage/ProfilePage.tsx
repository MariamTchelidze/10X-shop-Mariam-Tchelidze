// პროფილის სექციებს აქტიური მენიუს მიხედვით აჩვენებს.
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useRealm } from "../../context/RealmContext";
import { AddressesSection } from "./components/AddressesSection";
import { CardsSection } from "./components/CardsSection";
import { GeneralSettingsSection } from "./components/GeneralSettingsSection";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PurchasesSection } from "./components/PurchasesSection";
import { RefundsSection } from "./components/RefundsSection";
import type { ProfileSectionId } from "../../types/profile";
import { useProfileManagement } from "./useProfileManagement";

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { formatCurrency } = useRealm();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSectionId>("general");
  const profile = useProfileManagement({ user, updateProfile });

  const handleSignOut = () => {
        // სესიიდან გასვლის შემდეგ მომხმარებელს მთავარ გვერდზე ვაბრუნებთ.
    logout();
    navigate("/", { replace: true });
  };

  const changeSection = (section: ProfileSectionId) => {
    // სექციის შეცვლისას წინა მოქმედების სტატუსს ვასუფთავებთ.
    setActiveSection(section);
    profile.clearNotice();
  };

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl overflow-x-clip px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="mb-8 font-display text-3xl text-market-ink sm:mb-10 sm:text-4xl">
        My account
      </h1>
      <div className="grid min-w-0 gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={changeSection}
          onSignOut={handleSignOut}
        />

        <div className="min-w-0">
          {activeSection === "general" && (
            <GeneralSettingsSection
              name={profile.name}
              email={profile.email}
              onNameChange={profile.setName}
              onEmailChange={profile.setEmail}
              onSave={profile.saveProfile}
            />
          )}
          {activeSection === "addresses" && (
            <AddressesSection
              addresses={profile.addresses}
              values={profile.addressForm}
              editingAddressId={profile.editingAddressId}
              onFieldChange={profile.updateAddressField}
              onSubmit={profile.saveAddress}
              onEdit={profile.editAddress}
              onRemove={profile.removeAddress}
              onCancelEdit={profile.cancelAddressEdit}
            />
          )}
          {activeSection === "purchases" && (
            <PurchasesSection orders={profile.orders} formatCurrency={formatCurrency} />
          )}
          {activeSection === "refunds" && (
            <RefundsSection
              requests={profile.refundRequests}
              values={profile.refundForm}
              onFieldChange={profile.updateRefundField}
              onSubmit={profile.submitRefundRequest}
            />
          )}
          {activeSection === "cards" && (
            <CardsSection
              cards={profile.cards}
              values={profile.cardForm}
              onFieldChange={profile.updateCardField}
              onSubmit={profile.saveCard}
              onRemove={profile.removeCard}
            />
          )}
          {profile.notice && (
            <p role="status" className="mt-5 text-sm text-forest">
              {profile.notice}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
