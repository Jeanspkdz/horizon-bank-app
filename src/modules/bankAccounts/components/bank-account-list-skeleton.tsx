import { CreditCardSkeleton } from "@/modules/core/components/credit-card--skeleton";

export const UserBankAccountListSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <CreditCardSkeleton key={index} />
      ))}
    </div>
  );
};
