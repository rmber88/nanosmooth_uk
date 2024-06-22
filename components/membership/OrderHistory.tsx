import tw from "twin.macro";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";
import Typography from "../typography";
import { ButtonSpinner } from "../buttons/buttonSpinner";
import Link from "next/link";
import useUserOrders from "../../hooks/queries/orders/useUserOrders";
import styled from "@emotion/styled";
import { orderData } from "../../types/db";

const Status = styled.span(({ status }: { status: orderData["status"] }) => [
  tw`text-sm p-2 rounded-3xl font-bold`,
  status === "pending" && tw`text-yellow-700 bg-yellow-50`,
  status === "confirmed" && tw`text-blue-700 bg-blue-50`,
  status === "delivered" && tw`text-green-700 bg-green-50`,
]);

export default function OrderHistory() {
  const userOrders = useUserOrders();

  const isLoading = userOrders.isLoading;

  return (
    <section tw="pb-8">
      <span>{isLoading && ButtonSpinner}</span>

      {/* When subscribed */}
      {userOrders.data && (
        <ul tw="flex flex-col gap-4">
          {userOrders.data.map((order) => {
            //date, id , item, status, price
            return (
              <li
                tw="flex flex-col gap-2 rounded-xl bg-white-100 shadow p-3 "
                key={order.id}
              >
                <div tw="flex items-center justify-between">
                  <Typography.P isGrey>#{order.id}</Typography.P>
                  <Status status={order.status}>{order.status}</Status>
                </div>

                <div tw="flex justify-between ">
                  <Typography.P isGrey>Date</Typography.P>
                  <Typography.P tw="font-bold">
                    {new Date(order.date).toDateString()}
                  </Typography.P>
                </div>

                <div tw="flex justify-between ">
                  <Typography.P isGrey>Items</Typography.P>
                  <Typography.P tw="font-bold">
                    {order.items.map(
                      (item, idx) =>
                        `${item.name} X ${item.quantity}${
                          idx === order.items.length - 1 ? "" : ", "
                        }`
                    )}
                  </Typography.P>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* When unsubscribed */}
      {!userOrders.data && !isLoading && (
        <div>
          <Typography.P tw="mb-4" isGrey>
            You haven&apos;t placed an order yet...
          </Typography.P>
          <Link
            href={"/nano"}
            tw="rounded-xl px-4 py-2 border shadow transition-all hover:(bg-gray-50)"
          >
            Start shopping
          </Link>
        </div>
      )}
    </section>
  );
}
