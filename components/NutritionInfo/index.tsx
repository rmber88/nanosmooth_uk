import tw from "twin.macro";
import Typography from "../typography";
import { Fragment, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { AnimatePresence, motion } from "framer-motion";

export type NutritionInfoProps = {
  color: { 100: string; 500: string };
  title: string;
  ingredients: string;
  majorNutrients: {
    title: string;
    subtitle?: string;
    per25g: string;
    per25gSub?: string;
    per100g: string;
    per100gSub?: string;
  }[];
  minorNutrients: {
    title: string;
    per25g: string;
    per100g: string;
  }[];
  roundedSide?: "left" | "right" | "both" | "none";
};

type styleProps = {
  color: string;
};

const motionConfig = {
  initial: {
    opacity: 0,
    translateX: "-20%",
  },
  animate: {
    opacity: 1,
    translateX: 0,
  },
  exit: {
    opacity: 0,
    translateX: "-20%",
  },
};

export default function NutritionInfo({
  color,
  ingredients,
  majorNutrients,
  minorNutrients,
  title,
  roundedSide = "none",
}: NutritionInfoProps) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);

  const headerData: NutritionInfoProps["majorNutrients"][0] = {
    title: "",
    per25g: "Per 25g sachet",
    per100g: "per 100g",
  };

  const majorTable = [headerData, ...majorNutrients].map((nutrient) => {
    return (
      <li tw="border-t border-[#ccc] flex" key={nutrient.title} role="row">
        <div
          tw="p-2 max-w-[unset] flex flex-col"
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "0px",
          }}
        >
          <p tw="text-[0.8rem]">{nutrient.title}</p>
          {!!nutrient.subtitle && (
            <span tw="font-mono text-[0.8rem] opacity-50">
              {nutrient.subtitle}
            </span>
          )}
        </div>

        <div
          tw="p-2 flex flex-col w-full text-right max-w-[5rem]"
          style={{ backgroundColor: color[100] }}
        >
          <p tw="text-[0.8rem] font-bold">{nutrient.per25g}</p>
          {!!nutrient.per25gSub && (
            <span tw="font-mono text-[0.8rem] opacity-50">
              {nutrient.per25gSub}
            </span>
          )}
        </div>

        <div tw="p-2 flex flex-col w-full text-right max-w-[5rem]">
          <p tw="text-[0.8rem] font-bold">{nutrient.per100g}</p>
          {!!nutrient.per100gSub && (
            <span tw="font-mono text-[0.8rem] opacity-50">
              {nutrient.per100gSub}
            </span>
          )}
        </div>
      </li>
    );
  });

  const minorTable = [headerData, ...minorNutrients].map((nutrient) => {
    return (
      <li tw="border-t border-[#ccc] flex" key={nutrient.title} role="row">
        <div
          tw="p-2 max-w-[unset] flex flex-col"
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "0px",
          }}
        >
          <p tw="text-[0.8rem]">{nutrient.title}</p>
        </div>

        <div
          tw="p-2 flex flex-col w-full text-right max-w-[5rem]"
          style={{ backgroundColor: color[100] }}
        >
          <p tw="text-[0.8rem]">{nutrient.per25g}</p>
        </div>

        <div tw="p-2 flex flex-col w-full text-right max-w-[5rem]">
          <p tw="text-[0.8rem]">{nutrient.per100g}</p>
        </div>
      </li>
    );
  });

  return (
    <section>
      <span
        tw="px-4 py-2 font-bold mb-4 mt-4"
        style={{ color: color[500], backgroundColor: color[100] }}
      >
        {title}
      </span>

      <Typography.H1 tw="font-bold mt-2 mb-8">Nutrition Info</Typography.H1>
      <div tw="flex flex-col mb-8">
        <Typography.P tw="font-mono text-sm" isGrey>
          Ingredients (freeze-dried powders only):
        </Typography.P>
        <Typography.P>{ingredients}</Typography.P>
      </div>

      {/* Mobile tables */}
      <article tw="flex gap-2 lg:(hidden)">
        <button
          className={"text-black-100 disabled:(opacity-50)"}
          onClick={() => setCurrentPage((p) => (p === 1 ? p - 1 : 1))}
          // disabled={currentPage === 0}
        >
          <ArrowLeft2 />
        </button>

        <div tw="w-full">
          <AnimatePresence key={currentPage}>
            {[majorTable, minorTable].map((list, index) => {
              const isActive = index === currentPage;

              return (
                <Fragment key={`nutrient-table-${index}`}>
                  {isActive && <motion.ul {...motionConfig}>{list}</motion.ul>}
                </Fragment>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          className={"text-black-100 disabled:(opacity-50)"}
          onClick={() => setCurrentPage((p) => (p === 0 ? p + 1 : 0))}
          // disabled={currentPage === 1}
        >
          <ArrowRight2 />
        </button>
      </article>

      {/* Web tables */}
      <article tw="hidden lg:(flex gap-6)">
        {[majorTable, minorTable].map((list, index) => {
          return (
            <ul tw="w-full" key={`nutrient-table-${index}`}>
              {list}
            </ul>
          );
        })}
      </article>

      {/* Footer */}
      <div tw="mt-8">
        <Typography.P isGrey tw="text-sm font-mono">
          *Reference intake of an average adult (8400KJ/200KCal)
        </Typography.P>
        <Typography.P isGrey tw="text-sm font-mono">
          ** Contains naturally occurring sugars from fruit
        </Typography.P>
      </div>
    </section>
  );
}
