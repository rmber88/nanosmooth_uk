// Import necessary libraries and components
import tw from "twin.macro";
import useUserOrders from "../../hooks/queries/orders/useUserOrders";
import Typography from "../typography";
import { ButtonSpinner } from "../buttons/buttonSpinner";
import Link from "next/link";
import styled from "@emotion/styled";
import { orderData } from "../../types/db";

// Define a styled component for order status with conditional styling
const Status = styled.span(({ status }: { status: orderData["status"] }) => [
  tw`text-sm p-2 rounded-3xl font-bold`,
  status === "pending" && tw`text-yellow-700 bg-yellow-50`,
  status === "confirmed" && tw`text-blue-700 bg-blue-50`,
  status === "delivered" && tw`text-green-700 bg-green-50`,
]);

// Functional component to display user's order history
export default function OrderHistory() {
  const userOrders = useUserOrders(); // Fetch user orders using a custom hook
  const isLoading = userOrders.isLoading; // Check if data is loading

  return (
    <section tw="pb-8">
      {/* Show spinner while loading */}
      <span>{isLoading && <ButtonSpinner />}</span>

      {/* Display orders if data is available */}
      {userOrders.data && (
        <ul tw="flex flex-col gap-4">
          {userOrders.data.map((order) => (
            <li
              key={order.id}
              tw="flex flex-col gap-2 rounded-xl bg-white shadow p-3"
            >
              <div tw="flex items-center justify-between">
                <Typography.P isGrey>#{order.id}</Typography.P>
                <Status status={order.status}>{order.status}</Status>
              </div>

              <div tw="flex justify-between">
                <Typography.P isGrey>Date</Typography.P>
                <Typography.P tw="font-bold">
                  {new Date(order.date).toDateString()}
                </Typography.P>
              </div>

              <div tw="flex justify-between">
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
          ))}
        </ul>
      )}

      {/* Display message if no orders have been placed */}
      {!userOrders.data && !isLoading && (
        <div>
          <Typography.P tw="mb-4" isGrey>
            You haven&apos;t placed an order yet...
          </Typography.P>
          <Link
            href="/nano"
            tw="rounded-xl px-4 py-2 border shadow transition-all hover:(bg-gray-50)"
          >
            Start shopping
          </Link>
        </div>
      )}
    </section>
  );
}
