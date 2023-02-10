import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useFetch } from "../hooks/Fetch";
import {
  errorNotifications,
  successNotifications,
} from "../hooks/Notification";

type Payment = {
  description: string;
  price: string;
  id: number;
  getCredit: Function;
};

export default function PaypalCheckoutButton({
  description,
  price,
  id,
  getCredit,
}: Payment) {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState<any>(null);
  const fetch = useFetch();

  const handleApprove = async (orderId: any) => {
    // Call backend function to fulfill order

    await fetch.post(`/user/CheckOut/${id}`, { orderId });

    // if response is success
    setPaidFor(true);
    successNotifications(`Pay ${Number(price) / 10} credit successful!`);
    location.reload();
    // Refresh user's account or subscription status

    // if the response is error
    // setError('Your payment was processed successfully. However we are)
  };

  if (paidFor) {
    // Display success message, modal or redirect user to success page
    successNotifications("Thank you for your purchase!");
  }

  if (error) {
    // Display error message, modal or redirect user to error page
    errorNotifications(error);
  }

  return (
    <PayPalButtons
      style={{
        color: "silver",
        layout: "horizontal",
        height: 48,
        tagline: false,
        shape: "pill",
      }}
      onClick={(data, actions) => {
        // Validate on button click, client or server side
        const hasAlreadyBoughtCourse = false;
        if (hasAlreadyBoughtCourse) {
          setError(
            "You already bought this course. Go to your account to view your list of courses. "
          );
          return actions.reject();
        } else {
          return actions.resolve();
        }
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: description,
              amount: {
                value: price,
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order?.capture();
        console.log({ order });
        handleApprove(data.orderID);
      }}
      onCancel={() => {
        // Display cancel message, modal or redirect user to cancel page or back to cart
      }}
      onError={(err) => {
        setError(JSON.stringify(err));
        console.error("PayPal Checkout onError", err);
      }}
    />
  );
}
