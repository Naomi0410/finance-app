import { BudgetSummary } from "@/types/budget";
import { THEMES_META } from "@/lib/constants";

interface Props {
  budgets: BudgetSummary[];
  onOverviewPage?: boolean;
}

export default function SpendingSummaryList({ budgets, onOverviewPage }: Props) {
  return (
    <section
      className={`min-w-[280px] py-0 sm:py-250 lg:!py-0 items-center ${
        onOverviewPage ? "flex justify-center 1350:justify-end min-w-auto" : ""
      }`}
    >
      <h2
        className={`text-preset-2 text-grey-900 mb-300 ${
          onOverviewPage ? "hidden" : ""
        }`}
      >
        Spending Summary
      </h2>

      <ul
        className={`flex flex-col divide-grey-100 items-start divide-y w-full ${
          onOverviewPage
            ? "grid grid-cols-2 gap-y-200 gap-x-500 1350:gap-0 1350:flex w-fit divide-none"
            : ""
        }`}
      >
        {budgets.map((budget) => {
          const { spent, amount, category, theme, _id } = budget;

          // Use category to look up theme meta
          const themeMeta = THEMES_META[theme];
          const themeColorClass = themeMeta?.class || "";
          const themeColorStyle = themeMeta ? {} : { backgroundColor: theme };

          return (
            <li
              key={_id}
              className={`flex gap-200 items-center w-fit ${
                onOverviewPage ? "py-0 1350:py-100" : "py-200"
              } first:pt-0 last:pb-0 w-full`}
            >
              <span
                className={`min-w-[4px] rounded-full ${
                  onOverviewPage ? "h-[43px]" : "h-[21px]"
                } ${themeColorClass}`}
                style={themeColorStyle}
              />
              <div
                className={`flex justify-between items-center w-full items-start ${
                  onOverviewPage ? "flex-col" : ""
                }`}
              >
                <span
                  className={`text-grey-500 ${
                    onOverviewPage ? "text-preset-5" : "text-preset-4"
                  }`}
                >
                  {category}
                </span>

                <div>
                  {onOverviewPage ? (
                    <span className="text-preset-4-bold">
                      ${(amount ?? 0).toFixed(2)}
                    </span>
                  ) : (
                    <>
                      <span className="text-preset-3 text-grey-900 mr-100">
                       ${(spent ?? 0).toFixed(2)}
                      </span>
                      <span className="text-preset-5 text-grey-500">
                        of$ {(amount ?? 0).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
