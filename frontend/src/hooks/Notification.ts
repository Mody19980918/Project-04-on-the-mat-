import React from "react";
import { showNotification } from "@mantine/notifications";
export function successNotifications(messages: string) {
  showNotification({
    title: "Successful",
    autoClose: 2000,
    message: messages,
    color: "green",
    radius: "lg",
  });
}
export function errorNotifications(messages: string) {
  showNotification({
    title: "Error",
    autoClose: 2000,
    message: messages,
    color: "red",
    radius: "lg",
  });
}

export function ChatMessageNotifications(
  sender_name: string,
  messages: string
) {
  showNotification({
    title: sender_name,
    autoClose: 2000,
    message: messages,
    color: "green",
    radius: "lg",
  });
}
