import { cva, VariantProps } from "class-variance-authority";
import {
  BadgeDollarSign,
  LucideIcon,
  Package,
  Plane,
  Utensils,
} from "lucide-react";

type CategoriesData = {
  label: string;
  icon: LucideIcon;
};
export type Category = "loan_payments" | "travel" | "food_and_drink" | "other";


const categories: Record<Category, CategoriesData> = {
  loan_payments: {
    label: "Loan Payments",
    icon: BadgeDollarSign,
  },
  food_and_drink: {
    label: "Food and Drink",
    icon: Utensils,
  },
  travel: {
    label: "Travel",
    icon: Plane,
  },
  other: {
    label: "Others",
    icon: Package,
  },
};

const categoryCountBar = cva("flex gap-4 items-center px-5 py-4 rounded-2xl font-semibold", {
  variants: {
    type: {
      loan_payments: ["bg-blue-300/15", "text-blue-600"],
      travel: ["bg-pink-300/15", "text-pink-600"],
      food_and_drink: ["bg-green-300/15", "text-green-600"],
      other: ["bg-accent-foreground"],
    },
    size: {
      small: ["text-xs"],
      medium: ["text-base"],
    },
  },
  defaultVariants: {
    type: "other",
    size: "medium",
  },
});

const categoryIcon = cva("rounded-full p-3 ", {
  variants: {
    type: {
      loan_payments: ["bg-blue-400/25"],
      travel: ["bg-pink-400/25"],
      food_and_drink: ["bg-green-400/25"],
      other: ["bg-accent-foreground/25"],
    },
    size: {
      small: ["text-xs"],
      medium: ["text-base"],
    },
  },
  defaultVariants: {
    type: "other",
    size: "medium",
  },
});

const categoryBar = cva("rounded-3xl overflow-hidden mt-2 h-2 [&>div]:h-full", {
  variants: {
    type: {
      loan_payments: ["bg-blue-400/25 [&>div]:bg-blue-600"],
      travel: ["bg-pink-400/25 [&>div]:bg-pink-600"],
      food_and_drink: ["bg-green-400/25 [&>div]:bg-green-600"],
      other: ["bg-accent-foreground/25, [&>div]:bg-accent-foreground"],
    },
    size: {
      small: ["text-xs"],
      medium: ["text-base"],
    },
  },
  defaultVariants: {
    type: "other",
    size: "medium",
  },
});

type CategorySummaryVariant = VariantProps<typeof categoryCountBar>;
type RequiredCategorySummaryVariant = {
  [K in keyof CategorySummaryVariant]: NonNullable<CategorySummaryVariant[K]>;
};

interface CategoryProgressProps extends RequiredCategorySummaryVariant {
  amount: number;
  percentaje: number;
}

export const CategoryCountBar = ({
  percentaje,
  amount,
  size = "medium",
  type = "other",
}: CategoryProgressProps) => {
  const label = categories[type]["label"];
  const Icon = categories[type]["icon"];

  console.log(percentaje);

  return (
    <article className={categoryCountBar({ size, type })}>
      <div className={categoryIcon({ size, type })}>
        <Icon width={30} height={30} />
      </div>

      <div className="grow flex flex-col">
        <div className="w-full flex justify-between">
          <p>{label}</p>
          <span>{amount}</span>
        </div>

        {/* Percentaje */}
        <div className={categoryBar({ size, type })}>
          <div style={{ width: `${percentaje}%` }}></div>
        </div>
      </div>
    </article>
  );
};
