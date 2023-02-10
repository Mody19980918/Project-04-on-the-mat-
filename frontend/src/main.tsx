import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        currency: "HKD",
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT,
      }}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="top-center">
          <ModalsProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);
