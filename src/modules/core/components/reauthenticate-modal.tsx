"use client"

import { usePlaidLink } from "react-plaid-link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

export const ReauthenticateModal = ({ linkToken }: { linkToken: string }) => {
  const { open: openPlaid, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: () => {
      toast.success("Bank re-authenticated successfully!", {position: "top-center"});
    },
  });

  const [open, setOpen] = useState(true)

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Please Re-authenticate Your Bank Accounts
          </AlertDialogTitle>
          <AlertDialogDescription>
            We need you to log in again to restore your bank account connection.
            Click the button below to re-authenticate and continue using the
            service.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction disabled={!ready} onClick={() => {
            setOpen(false)
            openPlaid()
          }}>
            Reauthenticate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
