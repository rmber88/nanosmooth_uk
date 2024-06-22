import tw from "twin.macro";
import useAllSubscriptions from "../../hooks/queries/subscriptions/useAllSubscriptions";
import { ButtonSpinner } from "../../components/buttons/buttonSpinner";
import Table, { TableProps } from "../../components/table";
import { subscriptionData, userData } from "../../types/db";
import CheckBox from "../../components/Checkbox";
import { Fragment, useCallback, useState } from "react";
import Typography from "../../components/typography";
import styled from "@emotion/styled";
import Wrapper from "../../components/layouts/wrapper";
import { AnimatePresence, motion } from "framer-motion";
import { CloseCircle } from "iconsax-react";
import useSubscriptionAction from "../../hooks/queries/subscriptions/useSubscriptionAction";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";

type select = {
  userId: string;
  stripeId: string;
  isStripePaused: boolean;
};

const Status = styled.span(
  ({ status }: { status: "paused" | "active" | "inactive" }) => [
    tw`text-sm p-2 rounded-3xl font-bold`,
    status === "inactive" && tw`text-yellow-700 bg-yellow-50`,
    status === "paused" && tw`text-blue-700 bg-blue-50`,
    status === "active" && tw`text-green-700 bg-green-50`,
  ]
);

const motionConfig = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
export default function Subscriptions() {
  const [selected, setSelected] = useState<select[]>([]);
  const allSubscriptions = useAllSubscriptions();
  const subscriptionAction = useSubscriptionAction();
  const isLoading = allSubscriptions.isLoading;
  const hasSelectedItems = !!selected.length;
  const canPauseAllSelected = selected.every(
    (item) => item.isStripePaused === false
  );
  const canResumeAllSelected = selected.every(
    (item) => item.isStripePaused === true
  );

  const handleAction = useCallback(
    (action: "pause" | "resume") => {
      subscriptionAction.mutate(
        { action, users: selected },
        {
          onSuccess: () => {
            setSelected([]);
            toast.success("Subscriptions updated!");
            allSubscriptions.refetch();
          },
          onError: handleError,
        }
      );
    },
    [selected, subscriptionAction, allSubscriptions]
  );

  const options = [
    {
      title: "Pause subscriptions",
      enabled: canPauseAllSelected,
      onClick: () => handleAction("pause"),
    },
    {
      title: "Resume subscriptions",
      enabled: canResumeAllSelected,
      onClick: () => handleAction("resume"),
    },
  ];

  const handleSelect = useCallback(
    (params: select & { isChecked: boolean }) => {
      if (params.isChecked) {
        // unselect
        setSelected((prev) =>
          prev.filter((item) => item.userId !== params.userId)
        );
      } else {
        // select
        setSelected((prev) => [
          ...prev,
          {
            stripeId: params.stripeId,
            userId: params.userId,
            isStripePaused: params.isStripePaused,
          },
        ]);
      }
    },
    []
  );

  const columns: TableProps<userData & subscriptionData>["columns"] = [
    {
      key: "checkbox",
      render: (data) => {
        const isChecked = !!selected?.find((item) => item.userId === data.id);

        const params: select & { isChecked: boolean } = {
          stripeId: data.stripeId!,
          userId: data.id,
          isChecked,
          isStripePaused: !!data.stripePaused,
        };

        return (
          <span>
            <CheckBox
              checked={isChecked}
              onChange={() => handleSelect(params)}
            />
          </span>
        );
      },
    },
    {
      key: "Name",
      title: "Name",
      render: (data) => {
        return (
          <div>
            <Typography.P>
              {data?.name ?? data?.billingAddress?.name}
            </Typography.P>
            <Typography.P tw="mt-2 text-sm" isGrey>
              {data?.email}
            </Typography.P>
          </div>
        );
      },
    },
    {
      key: "Quantity",
      title: "Quantity",

      render: (data) => {
        return (
          <div>
            <Typography.P>{data?.quantity / 14} boxe(s)</Typography.P>
            <Typography.P tw="mt-2 text-sm" isGrey>
              {data?.quantity} sachets
            </Typography.P>
          </div>
        );
      },
    },
    {
      key: "Status",
      title: "Status",

      render: (data) => {
        const status =
          data?.isActive && data?.stripePaused
            ? "paused"
            : data?.isActive && !data?.stripePaused
            ? "active"
            : "inactive";

        return <Status {...{ status }}>{status}</Status>;
      },
    },
    {
      key: "Next payment date",
      title: "Next payment date",

      render: (data) => {
        const nextDate = new Date(data?.endDate)?.toDateString();

        return <Typography.P>{nextDate}</Typography.P>;
      },
    },
  ];
  const data = allSubscriptions.data ?? [];

  return (
    <Wrapper tw="relative pt-12 lg:(pt-32)">
      <Typography.H1>Subscriptions</Typography.H1>
      <Fragment> {isLoading && ButtonSpinner}</Fragment>
      <AnimatePresence>
        {hasSelectedItems && (
          <motion.div
            tw="px-5 py-3 rounded-xl bg-gray-50 flex gap-2 justify-between items-center my-8"
            {...motionConfig}
          >
            <Typography.P>{selected.length} selected</Typography.P>
            <ul tw="flex flex-wrap gap-6">
              {options.map((option) => {
                return (
                  <li
                    tw="cursor-pointer transition-all px-4 py-3 border rounded-xl hover:(bg-gray-100 border-none)"
                    key={option.title}
                    onClick={() => option.enabled && option.onClick()}
                    style={{
                      opacity: option.enabled ? 1 : 0.4,
                    }}
                  >
                    {option.title}
                  </li>
                );
              })}
            </ul>
            <Fragment>
              {isLoading ? (
                ButtonSpinner
              ) : (
                <button
                  tw="transition-all opacity-50 hover:(opacity-100)"
                  type="button"
                  onClick={() => setSelected([])}
                >
                  <CloseCircle />
                </button>
              )}
            </Fragment>
          </motion.div>
        )}
      </AnimatePresence>
      <Table {...{ columns, data }} />
    </Wrapper>
  );
}

Subscriptions.meta = {
  allowAccess: "admin",
};
